import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { type StageConfig, getConfig } from '../lib/config-builder'
import { AdvertiseXDataStack } from '../lib/data-stack'
import { AdvertiseXIngestionStack } from '../lib/ingestion-stack'
import { AdvertiseXProcessingStack } from '../lib/processing-stack'

const app = new cdk.App();

const stageConfig: StageConfig = getConfig(app)

const dataLakeStack: AdvertiseXDataStack = new AdvertiseXDataStack(app, 'AdvertiseXDataStack', stageConfig, {

  env: {
    account: stageConfig.awsAccountId,
    region: stageConfig.awsRegion,
  },
});

const processingStack = new AdvertiseXProcessingStack(app, 'AdvertiseXProcessingStack', {
  dataStack: dataLakeStack,
  stageConfig,
  env: {
    account: stageConfig.awsAccountId,
    region: stageConfig.awsRegion,
  },
});

const ingestionStack = new AdvertiseXIngestionStack(app, 'AdvertiseXIngestionStack', {
  dataStack: dataLakeStack,
  stageConfig,
  env: {
    account: stageConfig.awsAccountId,
    region: stageConfig.awsRegion,
  },
});

ingestionStack.addDependency(dataLakeStack);
processingStack.addDependency(dataLakeStack);