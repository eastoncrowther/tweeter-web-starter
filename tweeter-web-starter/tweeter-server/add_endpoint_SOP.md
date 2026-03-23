Step 1: The Contract (tweeter-shared)
Always start by defining how the front end and back end will talk to each other.

Create your new Request and Response interfaces (e.g., LoginRequest.ts, LoginResponse.ts).

Make sure to export them in your tweeter-shared/src/index.ts file so the other projects can see them.

Step 2: The Logic (tweeter-server)
Write the code that actually does the work.

Update or create the necessary Service class (e.g., UserService.ts).

Create a new Lambda handler file in src/lambda/ (e.g., LoginHandler.ts).

Crucial: Remember to use the event: any signature, parse event.body, and return the strict API Gateway JSON object (statusCode, headers, body) just like we did for GetFollowerCount.

Step 3: The Infrastructure (template.yaml)
Tell AWS about your new Lambda function and what URL should trigger it.

Copy your existing GetFollowerCountFunction block under Resources.

Paste it right below and rename the resource (e.g., LoginFunction).

Update the Handler path to point to the new file in your dist/ folder (e.g., LoginHandler.handler).

Update the Path and Method in the Events section (e.g., /login, post).

Step 4: The Build & Deploy
This is where we upgrade your esbuild command so it can handle multiple files at once.

Instead of targeting a single --outfile, you will pass all your handler files to esbuild and tell it to dump them into an --outdir. Run this from your tweeter-server directory:

1. Bundle all handlers:

Bash
npx esbuild src/lambda/GetFollowerCountHandler.ts src/lambda/LoginHandler.ts --bundle --platform=node --target=node18 --outdir=dist
(Pro-tip: You can keep adding as many src/lambda/... files to that command as you want as you build out your 14 features. I highly recommend copying that command into the "scripts" section of your package.json as "build": "npx esbuild..." so you only ever have to type npm run build.)

2. Package and Deploy:

// in all the previous steps all you have to do now is npm run build in the server. After that the commands with sam should work!


Bash
sam build
sam deploy
Step 5: The Frontend (tweeter-web)
Create the new request object in your UI code.

Pass it to your ClientCommunicator.doPost() method, pointing to your new endpoint (/login).

Once you get into the rhythm of this 5-step process, knocking out the remaining features becomes incredibly fast.

What is the next feature on your milestone list that you are going to tackle?