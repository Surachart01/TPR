import csv

# Surachart original photo map
# These are the exact photos Surachart originally had before any merge:
original_surachart_photos = {
    "5/5/2569": "1tJRWK6FdGF17MJhR4iu-seGfMZ5Vgql_",
    "6/5/2569": "1mQ9ekAacA3hJ81ZzXjTiXklG0w6tSPra",
    "7/5/2569": "1NOjgfI058TagtFZyVr17r9sjvyaiGHmc",
    "8/5/2569": "1_7bh-XVNthmPqeJ57mR_N8dmao5nNtWJ",
    "11/5/2569": "13B5EGKQCrmbzTYY2RdaaFBpWqpUfe1CY",
    "12/5/2569": "1IZq-y8tc6KcDBu_LYyEFvqXn-Dvc44rn",
    "13/5/2569": "1obuSKK9xJ864-cCkRLSNvcmH1grKhN61",
    "14/5/2569": "1IYqAKRXyMBS46udtGpHoR89oxoPMFLBP",
    "15/5/2569": "1wru_nQybIQEDkXii1uJfip-pX5POqSIQ",
    "18/5/2569": "1FYr0Wekp2CgnLhzW3O4EuYqb-vGcyoqf",
    "19/5/2569": "1WxQEjiF7REzMOyPth5BFRkM0IbKOdhrS",
    "20/5/2569": "",
    "21/5/2569": "1mQvScComMryUYeXlDgcvSGSaq_bxwN0v",
    "22/5/2569": "1s71J3rkC_uOn9OOwXs2IRQy-SsUarsfV",
    "25/5/2569": "1ODiuXjaBgpKnNlx62uYDdghTU09NYfHQ",
    "26/5/2569": "1OR3nMbhaOk8eb7ICwkob-o6Iixu-q2o5",
    "27/5/2569": "",
    "28/5/2569": "1jOUNGIU9GqpEXQYsnxyraai-jUD0OBFx",
    "29/5/2569": "1-LzLlXIGT4cN5wd2kfhKe1vqy5JC3lZL",
    "1/6/2569": "1ZcVBQJH_lnXhbW8gpLaNcxmd-oNXQsqr",
    "2/6/2569": "1FBHKFIHerIRb3kG4seSBJy6QY8_LjrkW",
    "3/6/2569": "1J9X2F1cOfA1igA4otccYXX4Fenf4tkB2",
    # All dates from 4/6/2569 onwards were empty "" in Surachart sheet!
}

# Read current merged record
with open("surachart_merged_record.tsv", "r", encoding="utf-8") as f:
    rows = list(csv.reader(f, delimiter="\t"))

header = rows[0]
clean_rows = []

for r in rows[1:]:
    date = r[0]
    subj = r[1]
    detail = r[2]
    term = r[4]
    week = r[5]
    
    # Restore only Surachart original photo (empty string if not in original)
    orig_img = original_surachart_photos.get(date, "")
    clean_rows.append([date, subj, detail, orig_img, term, week])

with open("surachart_original_clean.tsv", "w", encoding="utf-8", newline="") as out_tsv:
    writer = csv.writer(out_tsv, delimiter="\t")
    writer.writerow(header)
    writer.writerows(clean_rows)

with open("surachart_original_clean.csv", "w", encoding="utf-8", newline="") as out_csv:
    writer = csv.writer(out_csv)
    writer.writerow(header)
    writer.writerows(clean_rows)

print(f"Created clean dataset with {len(clean_rows)} rows. Friend photos removed.")
