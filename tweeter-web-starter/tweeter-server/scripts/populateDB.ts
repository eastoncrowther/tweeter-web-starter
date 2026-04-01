import { DynamoUserDAO } from "../src/model/dao/dynamo/DynamoUserDAO";
import { DynamoFollowDAO } from "../src/model/dao/dynamo/DynamoFollowDAO";
import { DynamoStoryDAO } from "../src/model/dao/dynamo/DynamoStoryDAO";
import { DynamoFeedDAO } from "../src/model/dao/dynamo/DynamoFeedDAO";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;
const FAKE_USERS_COUNT = 25;
const MAIN_USER_ALIAS = "@test_main";
const DEFAULT_IMAGE_URL = "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png";

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function populateDB() {
    console.log("Starting DB population script...");
    
    const userDAO = new DynamoUserDAO();
    const followDAO = new DynamoFollowDAO();
    const storyDAO = new DynamoStoryDAO();
    const feedDAO = new DynamoFeedDAO();

    console.log("Hashing password...");
    const passwordHash = await bcrypt.hash("password", SALT_ROUNDS);

    console.log("Creating main user...");
    await userDAO.putUser({
        alias: MAIN_USER_ALIAS,
        firstName: "Test",
        lastName: "Main",
        imageUrl: DEFAULT_IMAGE_URL,
        passwordHash,
    });
    
    console.log(`Creating ${FAKE_USERS_COUNT} fake users...`);
    for (let i = 1; i <= FAKE_USERS_COUNT; i++) {
        const fakeAlias = `@fake_${i}`;
        await userDAO.putUser({
            alias: fakeAlias,
            firstName: "Fake",
            lastName: `User${i}`,
            imageUrl: DEFAULT_IMAGE_URL,
            passwordHash,
        });
        
        // Stagger to avoid throughput limits
        await delay(1000);

        // Have fake user follow main user
        await followDAO.putFollow(fakeAlias, MAIN_USER_ALIAS);
        await delay(1000);

        // Have main user follow fake user
        await followDAO.putFollow(MAIN_USER_ALIAS, fakeAlias);
        await delay(1000);
        
        console.log(`Populated fake user ${i}`);
    }

    console.log("Creating 25 story posts for the main user...");
    for (let i = 1; i <= 25; i++) {
        const timestamp = Date.now() + i; // ensuring unique timestamps
        const post = `This is post number ${i} from ${MAIN_USER_ALIAS}`;

        // Insert into story
        await storyDAO.putStory({
            senderAlias: MAIN_USER_ALIAS,
            timestamp,
            post,
        });
        await delay(1000);

        console.log(`Created story post ${i}, now populating feeds...`);

        // Insert into feeds of followers
        const records = [];
        for (let j = 1; j <= FAKE_USERS_COUNT; j++) {
            records.push({
                receiverAlias: `@fake_${j}`,
                timestamp,
                senderAlias: MAIN_USER_ALIAS,
                post
            });
        }
        
        // Wait 2.5 seconds between batches to let the provisioned throughput recover.
        // We will break the feed insertions into smaller chunks to avoid exceeding limits
        // if the provisioned capacity is set to something low like 5 WCU.
        const chunkSize = 5;
        for (let j = 0; j < records.length; j += chunkSize) {
            const chunk = records.slice(j, j + chunkSize);
            await feedDAO.putFeedBatch(chunk);
            await delay(1500);
        }
    }

    console.log("DB population script completed successfully.");
}

populateDB().catch(console.error);
