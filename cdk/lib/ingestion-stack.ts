import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as kinesisfirehose from 'aws-cdk-lib/aws-kinesisfirehose';
import * as iam from 'aws-cdk-lib/aws-iam';
import { AdvertiseXDataStack } from './data-stack';
import { StageConfig } from './config-builder';

interface AdvertiseXIngestionStackProps extends cdk.StackProps {
    dataStack: AdvertiseXDataStack;
    stageConfig: StageConfig;
}

export class AdvertiseXIngestionStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: AdvertiseXIngestionStackProps) {
        super(scope, id, props);

        const dataLakeBucket = props.dataStack.advertiseXDataLakeBucket;

        // Create a role for Firehose with permissions to put data into S3
        const firehoseRole = new iam.Role(this, 'FirehoseRole', {
            assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
        });

        dataLakeBucket.grantWrite(firehoseRole);

        // Define prefixes for different data sources
        const dataSources = ['impressions', 'clicks', 'bid_requests'];

        dataSources.forEach((source) => {
            // Create a Kinesis Firehose delivery stream for each data source
            const stream = new kinesisfirehose.CfnDeliveryStream(this, `${source}Stream`, {
                deliveryStreamName: `AdvertiseX-${props.stageConfig.stage}-${source}`,
                deliveryStreamType: 'DirectPut',
                s3DestinationConfiguration: {
                    bucketArn: dataLakeBucket.bucketArn,
                    prefix: `raw/${source}/`,
                    roleArn: firehoseRole.roleArn,
                },
            });
        });
    }
}
