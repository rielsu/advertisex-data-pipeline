from fastavro import writer, parse_schema
import random
from datetime import datetime

# Define Avro schema for bid requests
schema = {
    "type": "record",
    "name": "BidRequest",
    "fields": [
        {"name": "user_id", "type": "string"},
        {"name": "auction_id", "type": "string"},
        {"name": "timestamp", "type": "string"},
        {"name": "ad_targeting", "type": {"type": "map", "values": "string"}}
    ]
}

# Generate synthetic bid request data
bid_requests = [
    {
        "user_id": f"user_{random.randint(1, 100)}",
        "auction_id": f"auction_{random.randint(1, 50)}",
        "timestamp": datetime.now().isoformat(),
        "ad_targeting": {"age": str(random.randint(18, 54)), "gender": random.choice(["male", "female"])}
    }
    for _ in range(100)  # Generate 100 bid requests
]

# Save to an Avro file
parsed_schema = parse_schema(schema)
with open('bid_requests.avro', 'wb') as f:
    writer(f, parsed_schema, bid_requests)
