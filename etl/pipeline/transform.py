import pandas as pd
from pathlib import Path
from pipeline.config import DATA_DIR_JSON, MISSING_VALUE_REPLACEMENT

# === COLUMN MAPPING ===
COLUMN_RENAME_MAP = {
  "NOM_ETABL": "name_latin",
  "NOM_ETABA": "name_arabic",
  "AdresseL": "address_latin",
  "AdresseA": "address_arabic",
  "COMMUNE": "commune",
  "PROVINCE": "province",
  "REGION": "region",
}

# === TRANSFORM FUNCTION ===
def _transform_schools(school_type: str, school_level: str) -> int:
  input_path = Path(DATA_DIR_JSON) / f"raw/{school_type}_{school_level}_raw.json"
  output_path = Path(DATA_DIR_JSON) / f"clean/{school_type}_{school_level}_clean.json"

  print(f"Transforming {input_path}...")
  df = pd.read_json(input_path, dtype=False)

  # Rename columns
  df = df.rename(columns=COLUMN_RENAME_MAP)
  df.columns = df.columns.str.strip().str.lower()

  # Strip strings & normalize spaces
  for col in df.select_dtypes(include="string"):
    df[col] = df[col].str.strip().str.replace(r'\s+', ' ', regex=True)

  # Fill missing values
  if MISSING_VALUE_REPLACEMENT is not None:
    df = df.fillna(MISSING_VALUE_REPLACEMENT).replace("", MISSING_VALUE_REPLACEMENT)

  # Add metadata
  df["type"] = school_type
  df["level"] = school_level

  # Drop fully empty rows
  df = df.dropna(how="all")

  # Save cleaned JSON
  output_path.parent.mkdir(parents=True, exist_ok=True)
  df.to_json(output_path, orient="records", force_ascii=False, indent=2)

  print(f"Transformation completed: {len(df)} records written to {output_path}")
  return len(df)


# === ENTRY POINT ===
def run():
  _transform_schools(school_type="public", school_level="primaire")
  _transform_schools(school_type="public", school_level="college")
  _transform_schools(school_type="public", school_level="lycee")
