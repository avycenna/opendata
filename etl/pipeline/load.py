import json
import sqlite3
from pathlib import Path
from pipeline.config import DATA_DIR_JSON

# === CONFIG ===
GEOCODED_DIR = Path(DATA_DIR_JSON) / "geocoded"
AGGREGATED_FILE = Path(DATA_DIR_JSON) / "schools_aggregated.json"
DATABASE_FILE = Path("data/schools.db")

# === AGGREGATE FUNCTION ===
def _aggregate_json_files() -> list[dict]:
  """Aggregate all geocoded JSON files into a single list."""
  all_records = []
  
  json_files = list(GEOCODED_DIR.glob("*_geocoded.json"))
  
  if not json_files:
    print(f"No geocoded JSON files found in {GEOCODED_DIR}")
    return all_records
  
  for json_file in json_files:
    print(f"Reading {json_file.name}...")
    with open(json_file, "r", encoding="utf-8") as f:
      records = json.load(f)
      all_records.extend(records)
      print(f"  -> {len(records)} records loaded")
  
  # Save aggregated file
  AGGREGATED_FILE.parent.mkdir(parents=True, exist_ok=True)
  with open(AGGREGATED_FILE, "w", encoding="utf-8") as f:
    json.dump(all_records, f, ensure_ascii=False, indent=2)
  
  print(f"\nAggregated {len(all_records)} total records into {AGGREGATED_FILE}")
  return all_records


# === DATABASE FUNCTIONS ===
def _create_database_schema(conn: sqlite3.Connection):
  """Create the normalized database schema matching Prisma schema."""
  cursor = conn.cursor()
  
  # Create Region table
  cursor.execute("""
    CREATE TABLE IF NOT EXISTS Region (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_latin TEXT NOT NULL,
      name_arabic TEXT NOT NULL,
      UNIQUE(name_latin, name_arabic)
    )
  """)
  
  # Create Province table
  cursor.execute("""
    CREATE TABLE IF NOT EXISTS Province (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_latin TEXT NOT NULL,
      name_arabic TEXT NOT NULL,
      regionId INTEGER NOT NULL,
      FOREIGN KEY (regionId) REFERENCES Region(id),
      UNIQUE(name_latin, name_arabic, regionId)
    )
  """)
  
  # Create Commune table
  cursor.execute("""
    CREATE TABLE IF NOT EXISTS Commune (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_latin TEXT NOT NULL,
      name_arabic TEXT NOT NULL,
      provinceId INTEGER NOT NULL,
      FOREIGN KEY (provinceId) REFERENCES Province(id),
      UNIQUE(name_latin, name_arabic, provinceId)
    )
  """)
  
  # Create School table
  cursor.execute("""
    CREATE TABLE IF NOT EXISTS School (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_latin TEXT NOT NULL,
      name_arabic TEXT NOT NULL,
      address_latin TEXT NOT NULL,
      address_arabic TEXT NOT NULL,
      type TEXT NOT NULL,
      level TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      communeId INTEGER NOT NULL,
      FOREIGN KEY (communeId) REFERENCES Commune(id)
    )
  """)
  
  # Create indexes for common queries
  cursor.execute("CREATE INDEX IF NOT EXISTS idx_province_region ON Province(regionId)")
  cursor.execute("CREATE INDEX IF NOT EXISTS idx_commune_province ON Commune(provinceId)")
  cursor.execute("CREATE INDEX IF NOT EXISTS idx_school_commune ON School(communeId)")
  cursor.execute("CREATE INDEX IF NOT EXISTS idx_school_coords ON School(latitude, longitude)")
  cursor.execute("CREATE INDEX IF NOT EXISTS idx_school_type ON School(type)")
  cursor.execute("CREATE INDEX IF NOT EXISTS idx_school_level ON School(level)")
  
  conn.commit()
  print("Database schema created successfully")


def _normalize_and_load(conn: sqlite3.Connection, records: list[dict]) -> dict:
  """Normalize data and load into SQLite database."""
  cursor = conn.cursor()
  
  # Lookup dictionaries for deduplication
  regions: dict[str, int] = {}       # name_latin -> id
  provinces: dict[tuple[str, int], int] = {}  # (name_latin, regionId) -> id
  communes: dict[tuple[str, int], int] = {}   # (name_latin, provinceId) -> id
  
  stats = {"regions": 0, "provinces": 0, "communes": 0, "schools": 0}
  
  for record in records:
    region_name = record.get("region", "").strip()
    province_name = record.get("province", "").strip()
    commune_name = record.get("commune", "").strip()
    
    # Skip records with missing location data
    if not region_name or not province_name or not commune_name:
      continue
    
    # Insert or get Region (using Latin name as key, Arabic defaults to empty)
    if region_name not in regions:
      cursor.execute(
        "INSERT INTO Region (name_latin, name_arabic) VALUES (?, ?)",
        (region_name, "")
      )
      regions[region_name] = cursor.lastrowid
      stats["regions"] += 1
    region_id = regions[region_name]
    
    # Insert or get Province
    province_key = (province_name, region_id)
    if province_key not in provinces:
      cursor.execute(
        "INSERT INTO Province (name_latin, name_arabic, regionId) VALUES (?, ?, ?)",
        (province_name, "", region_id)
      )
      provinces[province_key] = cursor.lastrowid
      stats["provinces"] += 1
    province_id = provinces[province_key]
    
    # Insert or get Commune
    commune_key = (commune_name, province_id)
    if commune_key not in communes:
      cursor.execute(
        "INSERT INTO Commune (name_latin, name_arabic, provinceId) VALUES (?, ?, ?)",
        (commune_name, "", province_id)
      )
      communes[commune_key] = cursor.lastrowid
      stats["communes"] += 1
    commune_id = communes[commune_key]
    
    # Get school data
    name_latin = record.get("name_latin", "").strip()
    name_arabic = record.get("name_arabic", "").strip()
    address_latin = record.get("address_latin", "").strip()
    address_arabic = record.get("address_arabic", "").strip()
    school_type = record.get("type", "").strip()
    school_level = record.get("level", "").strip()
    latitude = record.get("latitude", 0.0)
    longitude = record.get("longitude", 0.0)
    
    # Insert School
    cursor.execute(
      """INSERT INTO School 
         (name_latin, name_arabic, address_latin, address_arabic, type, level, latitude, longitude, communeId) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
      (name_latin, name_arabic, address_latin, address_arabic, school_type, school_level, latitude, longitude, commune_id)
    )
    stats["schools"] += 1
  
  conn.commit()
  return stats


def _load_to_sqlite(records: list[dict]):
  """Create SQLite database and load all normalized records."""
  DATABASE_FILE.parent.mkdir(parents=True, exist_ok=True)
  
  # Remove existing database to start fresh
  if DATABASE_FILE.exists():
    DATABASE_FILE.unlink()
    print(f"Removed existing database: {DATABASE_FILE}")
  
  conn = sqlite3.connect(DATABASE_FILE)
  conn.execute("PRAGMA foreign_keys = ON")
  
  try:
    _create_database_schema(conn)
    stats = _normalize_and_load(conn, records)
    
    print("\n=== Database Summary ===")
    print(f"Regions:   {stats['regions']}")
    print(f"Provinces: {stats['provinces']}")
    print(f"Communes:  {stats['communes']}")
    print(f"Schools:   {stats['schools']}")
    print(f"\nDatabase saved to: {DATABASE_FILE}")
    
  finally:
    conn.close()


# === ENTRY POINT ===
def run():
  """Main load function: aggregate JSON files and load into SQLite."""
  print("=" * 50)
  print("LOAD: Aggregating JSON files and loading to SQLite")
  print("=" * 50)
  
  # Step 1: Aggregate all geocoded JSON files
  print("\n[Step 1] Aggregating JSON files...")
  records = _aggregate_json_files()
  
  if not records:
    print("No records to load. Exiting.")
    return
  
  # Step 2: Normalize and load into SQLite database
  print("\n[Step 2] Normalizing and loading into SQLite database...")
  _load_to_sqlite(records)
  
  print("\n" + "=" * 50)
  print("LOAD: Complete!")
  print("=" * 50)
