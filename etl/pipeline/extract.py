import json
from pathlib import Path
import pandas as pd

# === CONFIG ===
from pipeline.config import (
  INPUT_PUBLIC_PRIMAIRE,
  INPUT_PUBLIC_COLLEGE,
  INPUT_PUBLIC_LYCEE,
  DATA_DIR_XLSX,
  DATA_DIR_JSON,
  MISSING_VALUE_REPLACEMENT
)

# === CONSTANTS ===
EXPECTED_COLUMNS = [
  "NOM_ETABL",
  "NOM_ETABA",
  "AdresseL",
  "AdresseA",
  "COMMUNE",
  "PROVINCE",
  "REGION",
]

# === EXTRACTION ===
def _extract_xlsx_to_json(xlsx_filename: str, school_type: str, school_level: str) -> int:
  xlsx_path = Path(DATA_DIR_XLSX) / xlsx_filename
  json_path = Path(DATA_DIR_JSON) / f"raw/{school_type}_{school_level}_raw.json"

  print(f"Extracting data from {xlsx_path}...")

  # Read Excel without coercing meaning
  df = pd.read_excel(xlsx_path, dtype=str)

  # Validate schema
  missing = set(EXPECTED_COLUMNS) - set(df.columns)
  if missing:
    raise ValueError(f"Missing expected columns: {missing}")

  # Keep only expected columns (order matters)
  df = df[EXPECTED_COLUMNS]

  # Replace missing/NaN values with None
  df = df.fillna(MISSING_VALUE_REPLACEMENT)

  # Convert to JSON records
  records = df.to_dict(orient="records")

  # Write JSON
  json_path.parent.mkdir(parents=True, exist_ok=True)
  with open(json_path, "w", encoding="utf-8") as f:
    json.dump(records, f, ensure_ascii=False, indent=2)

  print(f"Extraction completed: {len(records)} records written to {json_path}")
  return len(records)


# === ENTRY POINT ===
def run():
  _extract_xlsx_to_json(INPUT_PUBLIC_PRIMAIRE, school_type="public", school_level="primaire")
  _extract_xlsx_to_json(INPUT_PUBLIC_COLLEGE, school_type="public", school_level="college")
  _extract_xlsx_to_json(INPUT_PUBLIC_LYCEE, school_type="public", school_level="lycee")
