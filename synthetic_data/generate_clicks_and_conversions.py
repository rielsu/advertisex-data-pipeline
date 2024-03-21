import csv
from datetime import datetime
import random
# Generate synthetic clicks and conversions data
clicks_conversions = [
    [
        datetime.now().isoformat(),
        f"user_{random.randint(1, 100)}",
        f"campaign_{random.randint(1, 20)}",
        random.choice(["click", "conversion"])
    ]
    for _ in range(100)  # Generate 100 events
]

# Save to a CSV file
with open('clicks_conversions.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(["timestamp", "user_id", "campaign_id", "event_type"])
    writer.writerows(clicks_conversions)