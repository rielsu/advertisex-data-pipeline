import json
import random
from datetime import datetime

# Generate synthetic ad impressions data
ad_impressions = [
    {
        "ad_creative_id": f"creative_{i}",
        "user_id": f"user_{random.randint(1, 100)}",
        "timestamp": datetime.now().isoformat(),
        "website": f"website_{random.randint(1, 10)}"
    }
    for i in range(100)  # Generate 100 ad impressions
]

# Save to a JSON file as a single JSON array
with open('ad_impressions.json', 'w') as f:
    json.dump(ad_impressions, f, indent=4)