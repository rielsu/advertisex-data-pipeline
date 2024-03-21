import { type App } from 'aws-cdk-lib'

export interface StageConfig {
  readonly stage: string
  readonly awsAccountId: string
  readonly awsRegion: string
}

function ensureString (object: Record<string, any>, propName: string): string {
  if (object[propName] === undefined || object[propName] === '') {
    throw new Error(`Missing required property ${propName}`)
  }

  return object[propName]
}

export function getConfig (app: App): StageConfig {
  const stage: string = app.node.tryGetContext('stage')
  if (stage === undefined || stage === '') {
    throw new Error(
      'Context variable missing on CDK command. Pass in as `-c stage=XXX`',
    )
  }

  const unparsedConfig = app.node.tryGetContext('config')
  if (unparsedConfig === undefined) {
    throw new Error('Missing required property config')
  }

  const unparsedCommon = unparsedConfig.common
  if (unparsedCommon === undefined) {
    throw new Error('Missing required property in stage config `common`')
  }
  const unparsedStage = unparsedConfig[stage]
  if (unparsedStage === undefined) {
    throw new Error(
      `Missing required property in stage config for stage ${stage}`,
    )
  }

  const stageConfig: StageConfig = {
    stage,
    awsAccountId: ensureString(unparsedStage, 'awsAccountId'),
    awsRegion: ensureString(unparsedCommon, 'awsRegion'),
  }

  console.log('*** Stage Config ***')
  console.log(stageConfig)
  console.log('********************')

  return stageConfig
}
