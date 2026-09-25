# Placeholder parser – v3 keeps the data source isolated from the UI.
# The live ČVS parser can be tightened to the exact current HTML/API structure
# without changing the application UI.
from pathlib import Path
import json
p=Path("data/matches.json")
data=json.loads(p.read_text(encoding="utf-8"))
print("Current match records:",len(data))
