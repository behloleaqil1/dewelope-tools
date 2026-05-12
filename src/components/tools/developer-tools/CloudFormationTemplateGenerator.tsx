'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CloudFormationTemplateGenerator - Generate AWS CloudFormation template snippets
 * for common resource types like S3, Lambda, DynamoDB, EC2, etc.
 */
export default function CloudFormationTemplateGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [resourceType, setResourceType] = useState('s3-bucket');
  const [resourceName, setResourceName] = useState('');
  const [output, setOutput] = useState('');

  const templates: Record<string, (name: string) => string> = {
    's3-bucket': (name) => `AWSTemplateFormatVersion: '2010-09-09'
Description: S3 Bucket - ${name}

Resources:
  ${name}:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub '\${AWS::StackName}-${name.toLowerCase()}'
      AccessControl: Private
      VersioningConfiguration:
        Status: Enabled
      BucketEncryption:
        ServerSideEncryptionConfiguration:
          - ServerSideEncryptionByDefault:
              SSEAlgorithm: AES256
      PublicAccessBlockConfiguration:
        BlockPublicAcls: true
        BlockPublicPolicy: true
        IgnorePublicAcls: true
        RestrictPublicBuckets: true

Outputs:
  ${name}Arn:
    Value: !GetAtt ${name}.Arn
    Description: ARN of the S3 bucket`,
    'lambda-function': (name) => `AWSTemplateFormatVersion: '2010-09-09'
Description: Lambda Function - ${name}

Resources:
  ${name}Role:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              Service: lambda.amazonaws.com
            Action: sts:AssumeRole
      ManagedPolicyArns:
        - arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

  ${name}:
    Type: AWS::Lambda::Function
    Properties:
      FunctionName: !Sub '\${AWS::StackName}-${name.toLowerCase()}'
      Runtime: nodejs20.x
      Handler: index.handler
      Role: !GetAtt ${name}Role.Arn
      Timeout: 30
      MemorySize: 128
      Code:
        ZipFile: |
          exports.handler = async (event) => {
            return { statusCode: 200, body: 'Hello from ${name}' };
          };

Outputs:
  ${name}Arn:
    Value: !GetAtt ${name}.Arn`,
    'dynamodb-table': (name) => `AWSTemplateFormatVersion: '2010-09-09'
Description: DynamoDB Table - ${name}

Resources:
  ${name}:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: !Sub '\${AWS::StackName}-${name.toLowerCase()}'
      BillingMode: PAY_PER_REQUEST
      AttributeDefinitions:
        - AttributeName: id
          AttributeType: S
        - AttributeName: sortKey
          AttributeType: S
      KeySchema:
        - AttributeName: id
          KeyType: HASH
        - AttributeName: sortKey
          KeyType: RANGE
      PointInTimeRecoverySpecification:
        PointInTimeRecoveryEnabled: true

Outputs:
  ${name}Arn:
    Value: !GetAtt ${name}.Arn
  ${name}Name:
    Value: !Ref ${name}`,
    'ec2-instance': (name) => `AWSTemplateFormatVersion: '2010-09-09'
Description: EC2 Instance - ${name}

Parameters:
  InstanceType:
    Type: String
    Default: t3.micro
    AllowedValues: [t3.micro, t3.small, t3.medium]
  AmiId:
    Type: AWS::SSM::Parameter::Value<AWS::EC2::Image::Id>
    Default: /aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64

Resources:
  ${name}:
    Type: AWS::EC2::Instance
    Properties:
      InstanceType: !Ref InstanceType
      ImageId: !Ref AmiId
      Tags:
        - Key: Name
          Value: !Sub '\${AWS::StackName}-${name.toLowerCase()}'

Outputs:
  InstanceId:
    Value: !Ref ${name}
  PublicIp:
    Value: !GetAtt ${name}.PublicIp`,
    'sqs-queue': (name) => `AWSTemplateFormatVersion: '2010-09-09'
Description: SQS Queue - ${name}

Resources:
  ${name}:
    Type: AWS::SQS::Queue
    Properties:
      QueueName: !Sub '\${AWS::StackName}-${name.toLowerCase()}'
      VisibilityTimeout: 30
      MessageRetentionPeriod: 345600
      ReceiveMessageWaitTimeSeconds: 20

  ${name}DLQ:
    Type: AWS::SQS::Queue
    Properties:
      QueueName: !Sub '\${AWS::StackName}-${name.toLowerCase()}-dlq'
      MessageRetentionPeriod: 1209600

Outputs:
  ${name}Url:
    Value: !Ref ${name}
  ${name}Arn:
    Value: !GetAtt ${name}.Arn`,
    'sns-topic': (name) => `AWSTemplateFormatVersion: '2010-09-09'
Description: SNS Topic - ${name}

Resources:
  ${name}:
    Type: AWS::SNS::Topic
    Properties:
      TopicName: !Sub '\${AWS::StackName}-${name.toLowerCase()}'
      DisplayName: ${name}

Outputs:
  ${name}Arn:
    Value: !Ref ${name}`,
  };

  const generate = () => {
    const name = resourceName.trim() || 'MyResource';
    const templateFn = templates[resourceType];
    if (templateFn) {
      setOutput(templateFn(name));
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">
          Resource Type
        </label>
        <select
          id={`${toolId}-type`}
          value={resourceType}
          onChange={(e) => setResourceType(e.target.value)}
          aria-label={`Resource type for ${toolName}`}
          className="input-field"
        >
          <option value="s3-bucket">S3 Bucket</option>
          <option value="lambda-function">Lambda Function</option>
          <option value="dynamodb-table">DynamoDB Table</option>
          <option value="ec2-instance">EC2 Instance</option>
          <option value="sqs-queue">SQS Queue</option>
          <option value="sns-topic">SNS Topic</option>
        </select>
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">
          Resource Logical Name
        </label>
        <input
          id={`${toolId}-name`}
          type="text"
          value={resourceName}
          onChange={(e) => setResourceName(e.target.value)}
          placeholder="e.g. MyAppBucket"
          aria-label={`Resource name for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <button onClick={generate} aria-label="Generate template" className="btn-primary">
        Generate Template
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">CloudFormation Template (YAML)</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
