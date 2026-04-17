import json
import os

capitals_json = "public/capitals/country_capitals.json"

with open(capitals_json, "r", encoding="utf-8") as f:
    country_capitals = list(json.load(f).items())

countries = []
matched = 0

for c in os.listdir("public/flags"):
    country = c.split(".")[0]
    capital = ""

    for cap in country_capitals:
        if cap[0] == country:
            capital = cap[1]
            matched += 1
            break

    countries.append(
        {"country": country, "image_path": f"public/flags/{c}", "capital": capital}
    )


with open("utils/countries.txt", "w", encoding="utf-8") as f:
    for country in countries:
        f.write(str(country) + ",\n")
