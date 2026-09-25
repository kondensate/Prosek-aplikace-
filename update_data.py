import json,re,datetime
from pathlib import Path
import requests
from bs4 import BeautifulSoup

SOURCES=[
 ("U18","Extraliga chlapci U18","https://www.cvf.cz/souteze/celostatni-souteze?competitionId=18670&mode=clubs&teamId=93471"),
 ("U20","Extraliga chlapci U20","https://www.cvf.cz/souteze/celostatni-souteze?competitionId=18666&mode=clubs&teamId=93392"),
 ("U22","Extraliga chlapci U22","https://www.cvf.cz/souteze/celostatni-souteze?competitionId=18662&mode=clubs&teamId=93313"),
 ("U18","1. liga chlapci U18","https://www.cvf.cz/souteze/celostatni-souteze?competitionId=18672&mode=clubs&teamId=93505"),
]
# ČVS mění HTML, proto parser hledá textové bloky kolem dat/časů a Proseku.
# Pokud ČVS změní strukturu, workflow zachová poslední platný JSON.
def parse_page(category,competition,url):
    r=requests.get(url,timeout=30,headers={"User-Agent":"ProsekVolejbal/1.0"})
    r.raise_for_status()
    soup=BeautifulSoup(r.text,"html.parser")
    text=soup.get_text(" ",strip=True)
    out=[]
    pat=re.compile(r"(Po|Út|St|Čt|Pá|So|Ne)\s+(\d{1,2})\.\s*(\d{1,2})\.\s*(\d{4}).{0,180}?(\d{1,2}:\d{2})",re.I)
    for m in pat.finditer(text):
        day,month,year,time=m.group(2),m.group(3),m.group(4),m.group(5)
        window=text[max(0,m.start()-100):m.end()+120]
        if "Prosek" not in window: continue
        teams=re.findall(r"(?:SK Prosek Praha(?: B)?|VK [A-Za-zÁ-ž0-9 .-]+|TJ [A-Za-zÁ-ž0-9 .-]+|VAM Olomouc|Kladno volejbal cz|AERO Odolena Voda)",window)
        if len(teams)>=2:
            home,away=teams[-2],teams[-1]
        else:
            home,away="SK Prosek Praha",""
        out.append({"date":f"{year}-{int(month):02d}-{int(day):02d}","time":time,"category":category,"competition":competition,"home":home,"away":away,"venue":"","score":None})
    return out

all_matches=[]
for category,competition,url in SOURCES:
    try: all_matches += parse_page(category,competition,url)
    except Exception as e: print("WARN",competition,e)

# Deduplicate; keep deterministic output.
uniq={}
for m in all_matches:
    uniq[(m["date"],m["time"],m["category"],m["home"],m["away"])]=m
out=sorted(uniq.values(),key=lambda x:(x["date"],x["time"],x["category"]))
path=Path("data/matches.json")
if out:
    path.write_text(json.dumps(out,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print("Wrote",len(out),"matches")
else:
    print("No matches parsed; keeping previous data.")
