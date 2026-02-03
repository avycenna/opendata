import json
import time
from pathlib import Path
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed
from pipeline.config import DATA_DIR_JSON, GOOGLE_MAPS_API_KEY

# === CONFIG ===
DELAY_BETWEEN_REQUESTS = 0.05
FALLBACK_TO_ARABIC = True
SAVE_EVERY = 50
MAX_WORKERS = 5

# Bounding box for Morocco (including Western Sahara)
MOROCCO_BOUNDS = {
  "south": 21.0,   # southernmost latitude
  "north": 36.0,   # northernmost latitude
  "west": -17.5,   # westernmost longitude
  "east": -1.0,    # easternmost longitude
}

# Google Maps viewport bias
MOROCCO_VIEWPORT = f"{MOROCCO_BOUNDS['south']},{MOROCCO_BOUNDS['west']}|{MOROCCO_BOUNDS['north']},{MOROCCO_BOUNDS['east']}"

# === VALIDATION FUNCTIONS ===
def _is_within_morocco(lat: float, lon: float) -> bool:
  # Check if coordinates are within bounding box
  return (
    MOROCCO_BOUNDS["south"] <= lat <= MOROCCO_BOUNDS["north"] and
    MOROCCO_BOUNDS["west"] <= lon <= MOROCCO_BOUNDS["east"]
  )

def _validate_response(data: dict, expected_region: str = "") -> bool:
  # Validate that the geocoding response is in Morocco
  if data.get("status") != "OK" or not data.get("results"):
    return False
  
  result = data["results"][0]
  formatted_address = result.get("formatted_address", "").lower()
  
  # Must contain Morocco
  morocco_indicators = ["morocco", "maroc", "المغرب"]
  if not any(indicator in formatted_address for indicator in morocco_indicators):
    return False
  
  # Optionally check if expected region is in the address
  if expected_region:
    # Normalize for comparison
    region_lower = expected_region.lower()
    if region_lower not in formatted_address:
      # Not a hard failure, just a warning
      pass
  
  return True

# === GEOCODING FUNCTIONS ===
def _geocode_google(query: str, expected_region: str = "") -> tuple[float, float]:
  # Return (lat, lon) for a query, or (0.0, 0.0) if not found or outside bounding box
  if not query.strip():
    return 0.0, 0.0
  try:
    resp = requests.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      params={
        "address": query,
        "key": GOOGLE_MAPS_API_KEY,
        "bounds": MOROCCO_VIEWPORT,  # Bias results to Morocco
        "region": "ma",              # Region bias for Morocco
      },
      timeout=10,
    )
    data = resp.json()
    
    # Validate response is in Morocco
    if not _validate_response(data, expected_region):
      return 0.0, 0.0
    
    loc = data["results"][0]["geometry"]["location"]
    lat, lon = loc["lat"], loc["lng"]
    
    # Final bounds check
    if not _is_within_morocco(lat, lon):
      print(f"Coordinates outside Morocco for '{query}': ({lat}, {lon})")
      return 0.0, 0.0
    
    return lat, lon
  except Exception as e:
    print(f"Error geocoding '{query}': {e}")
  return 0.0, 0.0

def _construct_query(record: dict, use_arabic=False) -> str:
  # Build a full address query for Google Maps
  name = record.get("name_arabic") if use_arabic else record.get("name_latin")
  address = record.get("address_arabic") if use_arabic else record.get("address_latin")
  commune = record.get("commune", "")
  province = record.get("province", "")
  region = record.get("region", "")
  components = [name, address, commune, province, region, "Morocco"]
  return ", ".join([c for c in components if c])

# MAIN PROCESSING FUNCTION
def _process_record(record: dict, cache: dict) -> dict:
  # Geocode a single record using cache and fallback
  key = _construct_query(record, use_arabic=False)
  expected_region = record.get("region", "")
  
  if key in cache:
    lat, lon = cache[key]
    # Validate cached coordinates are still within bounds
    if _is_within_morocco(lat, lon):
      record["latitude"], record["longitude"] = lat, lon
      return record

  lat, lon = _geocode_google(key, expected_region)

  # Fallback to Arabic if needed
  if FALLBACK_TO_ARABIC and lat == 0.0 and lon == 0.0:
    key_ar = _construct_query(record, use_arabic=True)
    if key_ar in cache:
      lat, lon = cache[key_ar]
      if not _is_within_morocco(lat, lon):
        lat, lon = 0.0, 0.0
    else:
      lat, lon = _geocode_google(key_ar, expected_region)
      cache[key_ar] = (lat, lon)

  record["latitude"] = lat
  record["longitude"] = lon
  cache[key] = (lat, lon)

  return record

def _add_lat_lon_parallel(input_path: str, output_path: str, temp_path: str):
  input_path = Path(input_path)
  output_path = Path(output_path)
  temp_path = Path(temp_path)

  # Load JSON or resume from temp
  if temp_path.exists():
    print(f"Resuming from temp file: {temp_path}")
    with open(temp_path, "r", encoding="utf-8") as f:
      data = json.load(f)
  else:
    with open(input_path, "r", encoding="utf-8") as f:
      data = json.load(f)

  total = len(data)
  print(f"Total records to process: {total}")

  # Build cache of already geocoded addresses
  cache = { 
    _construct_query(r, use_arabic=False): (r.get("latitude", 0.0), r.get("longitude", 0.0))
    for r in data if "latitude" in r and "longitude" in r
  }

  batch_count = 0
  with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
    futures = {executor.submit(_process_record, r, cache): r for r in data}

    for i, future in enumerate(as_completed(futures), start=1):
      record = future.result()
      batch_count += 1

      # Save progress every SAVE_EVERY records
      if batch_count >= SAVE_EVERY or i == total:
        temp_path.parent.mkdir(parents=True, exist_ok=True)
        with open(temp_path, "w", encoding="utf-8") as f:
          json.dump(data, f, ensure_ascii=False, indent=2)
        batch_count = 0
        print(f"Progress saved at record {i}/{total}")

      time.sleep(DELAY_BETWEEN_REQUESTS)  # small delay to reduce API throttling

  # Ensure output directory exists
  output_path.parent.mkdir(parents=True, exist_ok=True)
  with open(output_path, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

  temp_path.unlink(missing_ok=True)
  print(f"Geocoding completed: {len(data)} records written to {output_path}")


# === ENTRY POINT ===
def run():
  datasets = [
    ("public_primaire_clean.json", "public_primaire_geocoded.json", "public_primaire_geocoded_temp.json"),
    ("public_college_clean.json", "public_college_geocoded.json", "public_college_geocoded_temp.json"),
    ("public_lycee_clean.json", "public_lycee_geocoded.json", "public_lycee_geocoded_temp.json"),
  ]

  for input_file, output_file, temp_file in datasets:
    _add_lat_lon_parallel(
      input_path=f"{DATA_DIR_JSON}/clean/{input_file}",
      output_path=f"{DATA_DIR_JSON}/geocoded/{output_file}",
      temp_path=f"{DATA_DIR_JSON}/geocoded/{temp_file}",
    )
