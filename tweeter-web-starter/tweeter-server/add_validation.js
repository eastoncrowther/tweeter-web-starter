const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'lambda');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

const requiredFields = {
  'LoginHandler.ts': ['alias', 'password'],
  'RegisterHandler.ts': ['alias', 'password', 'firstName', 'lastName', 'userImageBytes', 'imageFileExtension'],
  'LogoutHandler.ts': ['token'],
  'FollowHandler.ts': ['token', 'user'],
  'UnfollowHandler.ts': ['token', 'user'],
  'IsFollowerHandler.ts': ['token', 'user', 'selectedUser'],
  'GetFollowersHandler.ts': ['token', 'userAlias', 'pageSize'],
  'GetFolloweesHandler.ts': ['token', 'userAlias', 'pageSize'],
  'GetFollowerCountHandler.ts': ['token', 'user'],
  'GetFolloweeCountHandler.ts': ['token', 'user'],
  'GetUserHandler.ts': ['token', 'alias'],
  'PostStatusHandler.ts': ['token', 'post', 'userAlias', 'timestamp'],
  'GetFeedHandler.ts': ['token', 'userAlias', 'pageSize'],
  'GetStoryHandler.ts': ['token', 'userAlias', 'pageSize']
};

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 1. Inject validation right after "const request = body as ...;"
  const reqMatch = content.match(/const request = body as [a-zA-Z]+;/);
  if (reqMatch && requiredFields[file]) {
    const fields = requiredFields[file];
    const condition = fields.map(f => `!request.${f}`).join(' || ');
    const validationCode = `\n    if (${condition}) {\n      throw new Error("[Bad Request] Missing required fields");\n    }\n`;
    
    // Check if we already injected it
    if (!content.includes('[Bad Request]')) {
      content = content.replace(reqMatch[0], reqMatch[0] + validationCode);
    }
  }
  
  // 2. Modify catch block to return 400 for [Bad Request]
  const catchBlockRegex = /catch \([a-zA-Z]+\) \{\n\s*console\.error\("Handler failed:", [a-zA-Z]+\);/;
  if (catchBlockRegex.test(content) && !content.includes('statusCode: 400')) {
    const replacement = `catch (error) {
    console.error("Handler failed:", error);

    if (error instanceof Error && error.message.includes("[Bad Request]")) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          success: false,
          message: error.message,
        }),
      };
    }`;
    content = content.replace(catchBlockRegex, replacement);
  }
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file}`);
});
