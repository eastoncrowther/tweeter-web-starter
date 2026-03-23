#!/bin/bash
API_ID="1luhyw26n8"
STAGE_NAME="Prod" 

declare -A resMap=(
  ["2cia2l"]="Returns a paginated list of a user's followers."
  ["2qpzy0"]="Logs out a user and invalidates their auth token."
  ["ejnwz2"]="Returns a paginated list of statuses from users the current user follows."
  ["foxu83"]="Returns a paginated list of a user's followees."
  ["gc5ty3"]="Returns details of a specified user."
  ["iyso4b"]="Logs in a user and returns an auth token."
  ["m8kcwi"]="Returns a paginated list of statuses posted by the specified user."
  ["oadmcb"]="Makes the current user unfollow the specified user."
  ["qhj5hn"]="Checks if a user is a follower of another specified user."
  ["s988k8"]="Returns the number of followers for a given user."
  ["uuii2y"]="Registers a new user and returns an auth token."
  ["wfw2tf"]="Posts a new status (tweet) for the current user."
  ["z2f7uj"]="Makes the current user follow the specified user."
  ["zxatd0"]="Returns the number of followees for a given user."
)

for res in "${!resMap[@]}"; do
  desc="${resMap[$res]}"
  path=$(aws apigateway get-resource --rest-api-id $API_ID --resource-id $res --query 'path' --output text)
  echo "Processing resource $res (path: $path)..."
  
  # Add description via documentation part
  aws apigateway create-documentation-part \
    --rest-api-id $API_ID \
    --location type=METHOD,method=POST,path="$path" \
    --properties "{\"description\":\"$desc\"}" \
    || echo "Documentation part may already exist or error occurred."

  # Add Method Responses for 200, 400, 500
  aws apigateway put-method-response --rest-api-id $API_ID --resource-id $res --http-method POST --status-code 200 >/dev/null 2>&1 || true
  aws apigateway put-method-response --rest-api-id $API_ID --resource-id $res --http-method POST --status-code 400 >/dev/null 2>&1 || true
  aws apigateway put-method-response --rest-api-id $API_ID --resource-id $res --http-method POST --status-code 500 >/dev/null 2>&1 || true

  # Add Integration Responses for 200, 400, 500
  aws apigateway put-integration-response --rest-api-id $API_ID --resource-id $res --http-method POST --status-code 200 --selection-pattern "" >/dev/null 2>&1 || true
  aws apigateway put-integration-response --rest-api-id $API_ID --resource-id $res --http-method POST --status-code 400 --selection-pattern ".*\[Bad Request\].*" >/dev/null 2>&1 || true
  aws apigateway put-integration-response --rest-api-id $API_ID --resource-id $res --http-method POST --status-code 500 --selection-pattern ".*" >/dev/null 2>&1 || true
done

echo "Publishing documentation to Stage..."
aws apigateway create-documentation-version \
  --rest-api-id $API_ID \
  --documentation-version "v1.0" \
  --stage-name "$STAGE_NAME" \
  --description "Milestone 3 Documentation" \
  || echo "Documentation version might already exist."

echo "Done!"
