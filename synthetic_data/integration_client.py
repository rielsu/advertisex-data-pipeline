import boto3
import json
import csv
from avro.datafile import DataFileReader
from avro.io import DatumReader
from botocore.exceptions import ClientError

class AdvertiseXClient:
    def __init__(self, streams):
        self.firehose_client = boto3.client('firehose')
        self.streams = streams

    def send_to_firehose(self, stream_name, records):
        try:
            response = self.firehose_client.put_record_batch(
                DeliveryStreamName=stream_name,
                Records=[{'Data': json.dumps(record)} for record in records]
            )
            print(f"Successfully sent {len(records)} records to stream {stream_name}.")
            return response
        except ClientError as e:
            print(f"Error sending records to Firehose: {e}")
            return None

    def process_file(self, file_path):
        file_type = file_path.split('.')[-1]
        stream_name = self.streams.get(file_type)

        if not stream_name:
            print(f"Unsupported file type: {file_type}")
            return

        records = []
        if file_type == 'json':
            with open(file_path, 'r') as f:
                records = json.load(f)
        elif file_type == 'csv':
            with open(file_path, 'r') as f:
                csv_reader = csv.DictReader(f)
                records = [row for row in csv_reader]
        elif file_type == 'avro':
            with open(file_path, 'rb') as f:
                reader = DataFileReader(f, DatumReader())
                records = [record for record in reader]

        # Check if records need to be sent in batches
        batch_size = 500  # Adjust based on your needs
        if len(records) > batch_size:
            for i in range(0, len(records), batch_size):
                batch = records[i:i + batch_size]
                self.send_to_firehose(stream_name, batch)
        else:
            self.send_to_firehose(stream_name, records)

# Example usage
streams = {
    'json': 'AdvertiseX-dev-impressions',
    'csv': 'AdvertiseX-dev-clicks',
    'avro': 'AdvertiseX-dev-bid_requests'
}

advertise_x_client = AdvertiseXClient(streams)
advertise_x_client.process_file('ad_impressions.json')
advertise_x_client.process_file('clicks_conversions.csv')
advertise_x_client.process_file('bid_requests.avro')