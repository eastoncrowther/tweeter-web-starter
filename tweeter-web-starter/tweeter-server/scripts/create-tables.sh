#!/bin/bash
# Creates all DynamoDB tables required for Tweeter Milestone 4A
# Run this script once to set up your tables.

REGION="us-east-1"

echo "Creating 'users' table..."
aws dynamodb create-table \
  --table-name users \
  --attribute-definitions \
    AttributeName=alias,AttributeType=S \
  --key-schema \
    AttributeName=alias,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --region $REGION

echo "Creating 'follows' table with GSI..."
aws dynamodb create-table \
  --table-name follows \
  --attribute-definitions \
    AttributeName=follower_handle,AttributeType=S \
    AttributeName=followee_handle,AttributeType=S \
  --key-schema \
    AttributeName=follower_handle,KeyType=HASH \
    AttributeName=followee_handle,KeyType=RANGE \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --global-secondary-indexes \
    '[{
      "IndexName": "follows_index",
      "KeySchema": [
        {"AttributeName": "followee_handle", "KeyType": "HASH"},
        {"AttributeName": "follower_handle", "KeyType": "RANGE"}
      ],
      "Projection": {"ProjectionType": "ALL"},
      "ProvisionedThroughput": {"ReadCapacityUnits": 5, "WriteCapacityUnits": 5}
    }]' \
  --region $REGION

echo "Creating 'story' table..."
aws dynamodb create-table \
  --table-name story \
  --attribute-definitions \
    AttributeName=sender_alias,AttributeType=S \
    AttributeName=timestamp,AttributeType=N \
  --key-schema \
    AttributeName=sender_alias,KeyType=HASH \
    AttributeName=timestamp,KeyType=RANGE \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --region $REGION

echo "Creating 'feed' table..."
aws dynamodb create-table \
  --table-name feed \
  --attribute-definitions \
    AttributeName=receiver_alias,AttributeType=S \
    AttributeName=timestamp,AttributeType=N \
  --key-schema \
    AttributeName=receiver_alias,KeyType=HASH \
    AttributeName=timestamp,KeyType=RANGE \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --region $REGION

echo "Creating 'authtokens' table..."
aws dynamodb create-table \
  --table-name authtokens \
  --attribute-definitions \
    AttributeName=token,AttributeType=S \
  --key-schema \
    AttributeName=token,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --region $REGION

echo ""
echo "All tables created! Waiting for them to become ACTIVE..."
aws dynamodb wait table-exists --table-name users --region $REGION
aws dynamodb wait table-exists --table-name follows --region $REGION
aws dynamodb wait table-exists --table-name story --region $REGION
aws dynamodb wait table-exists --table-name feed --region $REGION
aws dynamodb wait table-exists --table-name authtokens --region $REGION

echo "All tables are ACTIVE!"
echo ""
echo "Table list:"
aws dynamodb list-tables --region $REGION
