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

print(f"{'วันที่':10} | {'วัน':8} | {'สัปดาห์':7} | {'งานของเพื่อน (รุ่งนภา)':45} | {'วิชาเพื่อน':22} | {'รูปภาพเพื่อน':10} | {'วิชา/งานของสุรชาติ (ปัจจุบัน)':45} | {'รูปสุรชาติ':10}")
print("="*165)

for f in friend_rows:
    f_date, f_subj, f_detail, f_img, f_term, f_week = f[0], f[1], f[2], f[3], f[4], f[5]
    day_name = get_day(f_date)
    s = s_dict.get(f_date)
    s_subj = s[1] if s else "(ยังไม่มี)"
    s_detail = s[2] if s else ""
    s_img = s[3] if s and len(s) > 3 else ""
    
    s_disp = s_subj if (s_subj != "-" and s_subj != "(ยังไม่มี)") else s_detail
    
    print(f"{f_date:10} | {day_name:8} | W{f_week:6} | {f_detail[:42]:45} | {f_subj[:20]:22} | {f_img[:8] if f_img else '-':10} | {s_disp[:42]:45} | {s_img[:8] if s_img else '-':10}")
