import sqlite3
import json
from collections import defaultdict

# Connect to the database
conn = sqlite3.connect("sustainability.db")
cursor = conn.cursor()

# Get leaderboard data
cursor.execute("SELECT user_id, total_score FROM leaderboard ORDER BY total_score DESC")
leaderboard_rows = cursor.fetchall()

leaderboard = [
    {"user_id": user_id, "score": score}
    for user_id, score in leaderboard_rows
]

# Get distinct users from purchases
cursor.execute("SELECT DISTINCT user_id FROM purchases")
users = [row[0] for row in cursor.fetchall()]

# Track most harmful (lowest scoring) products for user_001
harmful_products_user_001 = []

for user_id in ["user_001"]:  # Only get for user_001
    cursor.execute("""
        SELECT store, brand, product_name FROM purchases
        WHERE user_id = ?
    """, (user_id,))
    purchases = cursor.fetchall()

    product_scores = []

    for store, brand, product_name in purchases:
        # Get store sustainability score
        cursor.execute("SELECT sustainability_score FROM store_emissions WHERE name = ?", (store,))
        store_score_row = cursor.fetchone()
        store_score = store_score_row[0] if store_score_row else 0

        # Get brand sustainability score
        cursor.execute("SELECT sustainability_score FROM brand_emissions WHERE name = ?", (brand,))
        brand_score_row = cursor.fetchone()
        brand_score = brand_score_row[0] if brand_score_row else 0

        combined_score = store_score + brand_score

        product_scores.append({
            "product_name": product_name,
            "store": store,
            "brand": brand,
            "score": round(combined_score, 2)
        })

    # Sort by lowest scoring products
    product_scores.sort(key=lambda x: x["score"])
    harmful_products_user_001 = product_scores[:5]

# Create the final JSON structure
output = {
    "leaderboard": leaderboard,
    "harmful_products_user_001": harmful_products_user_001
}

# Write to file
with open("public/data/leaderboard.json", "w") as f:
    json.dump(output, f, indent=2)

print("✅ Leaderboard data exported to public/data/leaderboard.json")

conn.close()