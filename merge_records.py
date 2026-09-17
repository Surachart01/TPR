import csv
import urllib.request
import io

# Load friend data
with open("friend_data.csv", "r", encoding="utf-8") as f:
    friend_rows = list(csv.reader(f))[1:]

# Fetch current Surachart sheet
url = "https://docs.google.com/spreadsheets/d/1_E5EkSMvFu8_5teH8FisAHbxdjHkVoMxjtRZoWjhmzE/gviz/tq?tqx=out:csv&gid=0"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
content = urllib.request.urlopen(req).read().decode("utf-8")
surachart_rows = list(csv.reader(io.StringIO(content)))

header = surachart_rows[0]
s_data = surachart_rows[1:]

friend_dict = {r[0]: r for r in friend_rows}

merged_rows = []
for s in s_data:
    if not s or len(s) == 0:
        continue
    date = s[0]
    subj = s[1] if len(s) > 1 else "-"
    detail = s[2] if len(s) > 2 else ""
    img = s[3] if len(s) > 3 else ""
    term = s[4] if len(s) > 4 else "1"
    week = s[5] if len(s) > 5 else "1"
    
    f = friend_dict.get(date)
    if f:
        f_subj, f_detail, f_img = f[1], f[2], f[3]
        
        # If Surachart has no image, but friend has an image and it is a shared task or holiday
        if not img and f_img:
            # Check if Surachart is not teaching a primary course on that day or if it is a holiday/sports day
            if subj == "-" or "วันหยุด" in detail or "กีฬาสี" in detail or "วิชาการ" in detail:
                img = f_img
                # Optionally update detail if Surachart had a generic placeholder
                if subj == "-" and ("จัดเตรียม" in detail or "ประชุม" in detail or "ควบคุม" in detail or "ซ้อม" in detail):
                    detail = f_detail
            elif subj != "-" and ("วันหยุด" in f_detail or "กีฬาสี" in f_detail or "สามัญสัมพันธ์" in f_detail):
                img = f_img
    
    merged_rows.append([date, subj, detail, img, term, week])

# Write merged CSV
with open("surachart_merged_record.csv", "w", encoding="utf-8", newline="") as out_csv:
    writer = csv.writer(out_csv)
    writer.writerow(header)
    writer.writerows(merged_rows)

# Write merged TSV (for easy copy-paste into Google Sheet)
with open("surachart_merged_record.tsv", "w", encoding="utf-8", newline="") as out_tsv:
    writer = csv.writer(out_tsv, delimiter="\t")
    writer.writerow(header)
    writer.writerows(merged_rows)

print(f"Merged successfully: {len(merged_rows)} rows.")
