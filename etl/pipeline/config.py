import os

INPUT_PUBLIC_PRIMAIRE = "etab_pub_primaire_juin-2023.xlsx"
INPUT_PUBLIC_COLLEGE = "etab_pub_collegial_juin-2023.xlsx"
INPUT_PUBLIC_LYCEE = "etab_pub_qualifiant_juin-2023.xlsx"
DATA_DIR_XLSX = "data/xlsx"
DATA_DIR_JSON = "data/json"
MISSING_VALUE_REPLACEMENT = "MISSING"
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY", "")
