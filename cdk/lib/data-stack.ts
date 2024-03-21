import * as cdk from 'aws-cdk-lib'
import { type Construct } from 'constructs'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as s3notifications from 'aws-cdk-lib/aws-s3-notifications';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { StageConfig } from './config-builder'

interface AdvertiseXStackProps extends cdk.StackProps {}

export class AdvertiseXDataStack extends cdk.Stack{

    public readonly advertiseXDataLakeBucket: s3.Bucket
    public readonly advertiseXAthenaResultsBucket: s3.Bucket
    public readonly glueTriggerLambda: lambda.Function;

    constructor (
        scope: Construct,
        id: string,
        stageConfig: StageConfig,
        props: AdvertiseXStackProps,
      ) {
        super(scope, id, props)

    const advertiseXDataLakeBucketName = `advertise-x-${stageConfig.stage}-data-lake`
    const advertiseXAthenaResultsBucketName = `advertise-x-${stageConfig.stage}-athena-results`

    this.advertiseXDataLakeBucket = new s3.Bucket(this, 'AdvertiseXDataLakeBucket', {
        bucketName: advertiseXDataLakeBucketName,
        versioned: true,
        encryption: s3.BucketEncryption.S3_MANAGED,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        enforceSSL: true,
        lifecycleRules: [
          {
            expiration: cdk.Duration.days(90),
            transitions: [
              {
                storageClass: s3.StorageClass.GLACIER,
                transitionAfter: cdk.Duration.days(60),
              },
            ],
          },
        ],
        objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_PREFERRED,
        removalPolicy:
          stageConfig.stage === 'dev'
            ? cdk.RemovalPolicy.DESTROY
            : cdk.RemovalPolicy.RETAIN,
        autoDeleteObjects: stageConfig.stage === 'dev',
        cors: [
          {
            allowedMethods: [s3.HttpMethods.GET],
            allowedOrigins: ['*'],
          },
        ],
      })

    this.advertiseXAthenaResultsBucket = new s3.Bucket(this, 'AdvertiseXAthenaResultsBucket', {
    bucketName: advertiseXAthenaResultsBucketName,
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
    })

    this.glueTriggerLambda = new lambda.Function(this, 'GlueTriggerLambda', {
      runtime: lambda.Runtime.PYTHON_3_8,
      handler: 'lambda_function.lambda_handler',
      code: lambda.Code.fromAsset('../lambda/glue-trigger-lambda'),
      environment: {
        GLUE_JOB_NAME: `AdvertiseX-${stageConfig.stage}-DataProcessing`,
      },
    });

}
}