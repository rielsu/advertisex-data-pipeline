import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as events from 'aws-cdk-lib/aws-lambda-event-sources';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as glue from 'aws-cdk-lib/aws-glue';
import * as iam from 'aws-cdk-lib/aws-iam';
import { AdvertiseXDataStack } from './data-stack';
import { StageConfig } from './config-builder';
import * as s3 from 'aws-cdk-lib/aws-s3';

interface AdvertiseXProcessingStackProps extends cdk.StackProps {
  dataStack: AdvertiseXDataStack;
  stageConfig: StageConfig;
}


export class AdvertiseXProcessingStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AdvertiseXProcessingStackProps) {
    super(scope, id, props);

    const dataLakeBucket = props.dataStack.advertiseXDataLakeBucket;
    const glueTriggerLambda = props.dataStack.glueTriggerLambda;

    // Create a Glue IAM role
    const glueRole = new iam.Role(this, 'GlueRole', {
      assumedBy: new iam.ServicePrincipal('glue.amazonaws.com'),
    });

    // Grant Glue access to the data lake bucket
    dataLakeBucket.grantReadWrite(glueRole);

    // Define a Glue job for data processing
    const glueJob = new glue.CfnJob(this, 'DataProcessingJob', {
      name: `AdvertiseX-${props.stageConfig.stage}-DataProcessing`,
      role: glueRole.roleArn,
      command: {
        name: 'glueetl',
        scriptLocation: `s3://${dataLakeBucket.bucketName}/scripts/data_processing_script.py`,
        pythonVersion: '3',
      },
      defaultArguments: {
        '--TempDir': `s3://${dataLakeBucket.bucketName}/temp`,
        '--job-bookmark-option': 'job-bookmark-enable',
      },
      glueVersion: '4.0',
      workerType: 'Standard',
      numberOfWorkers: 2,
    });



    glueTriggerLambda.addEventSource(new events.S3EventSource(dataLakeBucket, {
      events: [s3.EventType.OBJECT_CREATED],
      filters: [{ prefix: 'raw/' }] // Adjust the prefix based on your S3 folder structure
    }));
  }
}
