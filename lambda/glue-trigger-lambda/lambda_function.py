import os
import boto3
import json

def lambda_handler(event, context):
    # Get the Glue job name from environment variables
    glue_job_name = os.environ.get('GLUE_JOB_NAME')
    if not glue_job_name:
        raise ValueError("GLUE_JOB_NAME environment variable is not set")

    # Initialize the Glue client
    glue_client = boto3.client('glue')

    # Start the Glue job
    try:
        response = glue_client.start_job_run(JobName=glue_job_name)
        print(f"Started Glue job: {glue_job_name} with JobRunId: {response['JobRunId']}")
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': f"Successfully started Glue job: {glue_job_name}",
                'JobRunId': response['JobRunId']
            })
        }
    except Exception as e:
        print(f"Error starting Glue job: {glue_job_name} - {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({
                'message': f"Failed to start Glue job: {glue_job_name}",
                'error': str(e)
            })
        }
