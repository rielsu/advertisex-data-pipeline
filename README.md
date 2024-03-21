# AdvertiseX Data Engineering Solution

## Overview
This project provides a data engineering solution for AdvertiseX, a digital advertising technology company specializing in programmatic advertising. The solution is designed to handle data ingestion, processing, storage, and monitoring for ad impressions, clicks, conversions, and bid requests.

## Architecture
The solution utilizes AWS services to create a scalable and efficient data pipeline:

- **Data Ingestion:** Amazon Kinesis Data Firehose and Amazon S3
- **Data Processing:** AWS Glue, AWS Lambda, and Amazon Athena
- **Data Storage:** Amazon Redshift and Amazon S3
- **Monitoring:** Amazon CloudWatch and Amazon SNS

## Deployment
The infrastructure is defined and deployed using the AWS Cloud Development Kit (CDK).

### Prerequisites
- AWS CLI
- AWS CDK
- Node.js and npm
- Python and pip

### Steps
1. Clone the repository:

```bash
git clone https://github.com/your-username/advertisex-data-engineering.git
cd advertisex-data-engineering

```

2. Install dependencies cdk:


```bash
cd cdk
npm install
cd synthetic-data
pip install -r requirements.txt

```
2. Install dependencies Integration Client:

```bash
cd synthetic-data
pip install -r requirements.txt

```

3. Deploy the stacks for development stack:

```bash
cdk deploy -c stage=dev  --all

```


## Data Ingestion
Data is ingested in real-time and batch modes using Amazon Kinesis Data Firehose, which delivers the data to Amazon S3 buckets. Separate buckets or prefixes are used for each data source (ad impressions, clicks, conversions, and bid requests).

## Data Processing
AWS Glue is used to transform and standardize data, converting JSON and Avro data to Parquet format for efficient querying. AWS Lambda functions handle lightweight processing tasks, such as data validation and deduplication. Amazon Athena is used for ad-hoc queries to correlate ad impressions with clicks and conversions.

## Data Storage and Query Performance
Amazon Redshift is used as the data warehouse to store processed data. The table design is optimized for query performance. Redshift Spectrum is used to query data directly in S3 when needed.

## Error Handling and Monitoring
Amazon CloudWatch is used to monitor data pipelines, setting up alarms for anomalies or delays in data ingestion and processing. AWS Lambda functions automatically handle common errors. Amazon SNS is used to notify the operations team of any critical issues that require manual intervention.

## Conclusion
This solution provides a robust and scalable data engineering platform for AdvertiseX, enabling the company to analyze and optimize its advertising campaigns effectively.


# AdvertiseXClient

AdvertiseXClient is a Python client for sending data to AWS Kinesis Firehose streams. It supports processing and sending JSON, CSV, and Avro files.

## Installation

Ensure that you have Python and `boto3` installed. You can install `boto3` using pip:

```bash
pip install boto3
```

## Usage

Import the AdvertiseXClient class from the module.

```bash
from advertise_x_client import AdvertiseXClient
```

Define your Firehose stream mappings. The keys should be the file types ('json', 'csv', 'avro'), and the values should be the corresponding Firehose stream names.

```bash
streams = {
    'json': 'AdvertiseX-dev-impressions',
    'csv': 'AdvertiseX-dev-clicks',
    'avro': 'AdvertiseX-dev-bid_requests'
}
```

Create an instance of AdvertiseXClient with the stream mappings.

```bash
advertise_x_client = AdvertiseXClient(streams)
```
Use the process_file method to send data from a file to the appropriate Firehose stream. The method automatically detects the file type and sends the data in batches to the corresponding stream.

```bash
advertise_x_client.process_file('path/to/ad_impressions.json')
advertise_x_client.process_file('path/to/clicks_conversions.csv')
advertise_x_client.process_file('path/to/bid_requests.avro')
```

## Notes

Ensure that the AWS credentials are correctly configured in your environment to allow access to the Kinesis Firehose service.
The batch size for sending records to Firehose is set to 500. You can adjust this based on your needs.