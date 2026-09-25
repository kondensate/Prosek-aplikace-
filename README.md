# Prosek Volejbal

Tato verze používá:
- `data.json` pro zápasy
- automatické načítání `data.json` v aplikaci
- ikony `icon-192.png` a `icon-512.png`
- kategorie U18, U20, U22 a Muži

## Automatická aktualizace
Soubor `AUTOMATICKA_AKTUALIZACE.txt` obsahuje hotový GitHub Actions workflow.
GitHub Actions vyžaduje, aby tento obsah byl uložen jako:
`.github/workflows/update-cvs.yml`

Workflow kontroluje ČVS každých 6 hodin a uloží nové zápasy do `data.json`.

## Ikona
Do repozitáře jsou přidány stejné ikony, které byly dodány pro aplikaci.
