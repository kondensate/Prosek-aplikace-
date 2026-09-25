# Prosek Volejbal – v2

PWA pro iPhone s kalendářem všech nalezených zápasů Proseku.

## Automatická aktualizace
GitHub Actions spouští `scripts/update_data.py` každých 6 hodin a aktualizuje `data/matches.json` podle stránek ČVS.

## Důležité
Parser je oddělený od UI. ČVS může změnit HTML, takže po změně struktury může být potřeba upravit parser.

## Web
Záložka „Prosek Web“ zobrazuje volejbalek.cz přímo v aplikaci pomocí iframe; pokud web vložení nepovolí, je k dispozici tlačítko pro otevření webu samostatně.
