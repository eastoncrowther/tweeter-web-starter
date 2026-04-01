#!/bin/bash
# Deletes all DynamoDB tables for Tweeter Milestone 4A

REGION="us-east-1"

echo "Deleting 'users' table..."
aws dynamodb delete-table --table-name users --region $REGION

echo "Deleting 'follows' table..."
aws dynamodb delete-table --table-name follows --region $REGION

echo "Deleting 'story' table..."
aws dynamodb delete-table --table-name story --region $REGION

echo "Deleting 'feed' table..."
aws dynamodb delete-table --table-name feed --region $REGION

echo "Deleting 'authtokens' table..."
aws dynamodb delete-table --table-name authtokens --region $REGION

echo ""
echo "Waiting for tables to be deleted..."
aws dynamodb wait table-not-exists --table-name users --region $REGION
aws dynamodb wait table-not-exists --table-name follows --region $REGION
aws dynamodb wait table-not-exists --table-name story --region $REGION
aws dynamodb wait table-not-exists --table-name feed --region $REGION
aws dynamodb wait table-not-exists --table-name authtokens --region $REGION

echo "All tables deleted!"
