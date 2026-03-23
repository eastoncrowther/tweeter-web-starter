const { execSync } = require('child_process');

const API_ID = "1luhyw26n8";
const STAGE_NAME = "Prod";

const resMap = {
  "2cia2l": "Returns a paginated list of a users followers.",
  "2qpzy0": "Logs out a user and invalidates their auth token.",
  "ejnwz2": "Returns a paginated list of statuses from users the current user follows.",
  "foxu83": "Returns a paginated list of a users followees.",
  "gc5ty3": "Returns details of a specified user.",
  "iyso4b": "Logs in a user and returns an auth token.",
  "m8kcwi": "Returns a paginated list of statuses posted by the specified user.",
  "oadmcb": "Makes the current user unfollow the specified user.",
  "qhj5hn": "Checks if a user is a follower of another specified user.",
  "s988k8": "Returns the number of followers for a given user.",
  "uuii2y": "Registers a new user and returns an auth token.",
  "wfw2tf": "Posts a new status (tweet) for the current user.",
  "z2f7uj": "Makes the current user follow the specified user.",
  "zxatd0": "Returns the number of followees for a given user."
};

for (const [res, desc] of Object.entries(resMap)) {
  try {
    const pathOutput = execSync(`aws apigateway get-resource --rest-api-id ${API_ID} --resource-id ${res} --query 'path' --output text`);
    const path = pathOutput.toString().trim();
    console.log(`Processing resource ${res} (path: ${path})...`);
    
    try {
      execSync(`aws apigateway create-documentation-part --rest-api-id ${API_ID} --location type=METHOD,method=POST,path="${path}" --properties '{"description":"${desc}"}'`);
    } catch (e) {
      console.log("Documentation part exists or failed.");
    }

    try { execSync(`aws apigateway put-method-response --rest-api-id ${API_ID} --resource-id ${res} --http-method POST --status-code 200`); } catch (e) {}
    try { execSync(`aws apigateway put-method-response --rest-api-id ${API_ID} --resource-id ${res} --http-method POST --status-code 400`); } catch (e) {}
    try { execSync(`aws apigateway put-method-response --rest-api-id ${API_ID} --resource-id ${res} --http-method POST --status-code 500`); } catch (e) {}

    try { execSync(`aws apigateway put-integration-response --rest-api-id ${API_ID} --resource-id ${res} --http-method POST --status-code 200 --selection-pattern ""`); } catch (e) {}
    try { execSync(`aws apigateway put-integration-response --rest-api-id ${API_ID} --resource-id ${res} --http-method POST --status-code 400 --selection-pattern ".*\\[Bad Request\\].*"`); } catch (e) {}
    try { execSync(`aws apigateway put-integration-response --rest-api-id ${API_ID} --resource-id ${res} --http-method POST --status-code 500 --selection-pattern ".*"`); } catch (e) {}
  } catch(e) {
    console.error(`Error processing resource ${res}:`, e.message);
  }
}

try {
  console.log("Publishing documentation to Stage...");
  execSync(`aws apigateway create-documentation-version --rest-api-id ${API_ID} --documentation-version "v1.0.1" --stage-name "${STAGE_NAME}" --description "Milestone 3 Documentation"`);
} catch (e) {
  console.log("Documentation publish failed or version already exists.");
}

console.log("Done!");
