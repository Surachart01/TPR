import csv
import urllib.request
import io
from datetime import datetime

with open("friend_data.csv", "r", encoding="utf-8") as f:
    friend_rows = list(csv.reader(f))[1:]

url = "https://docs.google.com/spreadsheets/d/1_E5EkSMvFu8_5teH8FisAHbxdjHkVoMxjtRZoWjhmzE/gviz/tq?tqx=out:csv&gid=0"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
content = urllib.request.urlopen(req).read().decode("utf-8")
surachart_rows = list(csv.reader(io.StringIO(content)))

s_dict = {r[0]: r for r in surachart_rows[1:] if len(r) > 0}

def get_day(date_str):
    try:
        d, m, y = map(int, date_str.split("/"))
        ce_year = y - 543
        dt = datetime(ce_year, m, d)
        return ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์", "อาทิตย์"][dt.weekday()]
    except:
        return "?"

# Analysis lists
cat_a_ready = []      # Perfect match: Non-teaching, Friend has photo, Sura can use photo
cat_b_schedule_diff = [] # Teaching days: Friend teaches UX/UI or Digital, Sura teaches C or Server OS
cat_c_shared_tasks = []  # Mon/Thu tasks, maintenance, prep, sports day
cat_d_special = []       # Weekend workshops, sick leave, etc.

for f in friend_rows:
    f_date, f_subj, f_detail, f_img, f_term, f_week = f[0], f[1], f[2], f[3], f[4], f[5]
    if not f_date or not f_detail:
        continue
    day_name = get_day(f_date)
    s = s_dict.get(f_date)
    s_subj = s[1] if s else "-"
    s_detail = s[2] if s else ""
    s_img = s[3] if s and len(s) > 3 else ""
    
    is_f_teaching = f_subj not in ["-", ""]
    is_s_teaching = s_subj not in ["-", "", "(ยังไม่มี)"]
    
    item = {
        "date": f_date,
        "day": day_name,
        "week": f_week,
        "friend_subj": f_subj,
        "friend_detail": f_detail,
        "friend_img": f_img,
        "sura_subj": s_subj,
        "sura_detail": s_detail,
        "sura_img": s_img
    }
    
    if day_name in ["เสาร์", "อาทิตย์"]:
        cat_d_special.append(item)
    elif not is_f_teaching:
        cat_a_ready.append(item)
    else:
        cat_b_schedule_diff.append(item)

print(f"Cat A (Non-teaching / Shared tasks): {len(cat_a_ready)}")
print(f"Cat B (Teaching days comparison): {len(cat_b_schedule_diff)}")
print(f"Cat D (Weekend/Special): {len(cat_d_special)}")

print("\n--- CAT A: Non-Teaching / Shared tasks ---")
for x in cat_a_ready:
    print(f"[{x['date']} ({x['day']}) W{x['week']}] Img: {bool(x['friend_img'])} | Sura has img: {bool(x['sura_img'])} | Detail: {x['friend_detail'][:50]}")

print("\n--- CAT B: Teaching Days ---")
for x in cat_b_schedule_diff:
    print(f"[{x['date']} ({x['day']}) W{x['week']}] Friend: {x['friend_subj']} | Sura: {x['sura_subj']} | Friend Img: {bool(x['friend_img'])}")

print("\n--- CAT D: Special ---")
for x in cat_d_special:
    print(f"[{x['date']} ({x['day']}) W{x['week']}] Friend: {x['friend_detail']} | Friend Img: {x['friend_img']}")
