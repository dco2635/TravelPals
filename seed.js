import {dbConnection, closeConnection} from "./config/mongoConnection.js";
import userDataFunctions from "./data/users.js";
import {friendData,postData, commentData} from "./data/index.js";

const db = await dbConnection();

const lucy = await userDataFunctions.addUser("Lucy", "Hale", "lucy23", "lhale@gmail.com", "6514344942", "jamesBond23!");

const lid = lucy._id.toString();



const taylor = await userDataFunctions.addUser("Taylor", "Swift", "taylor13", "taylorswift13@gmail.com", "4012346578", "speakNow89!");

const ryan = await userDataFunctions.addUser("Ryan", "Gosling", "youngGosling", "ryangosling@gmail.com", "8234563489", "lalaLand90!");
const rid = ryan._id.toString();

const friendship= await friendData.createFriendUserName( "taylor13", lid);
const post = await postData.createPost(lid, "lucy23", "Travel to Athens?", "I'd like to check out Athens sometime in the Spring");


const postId= post.insertedId.toString()

const comment1 = await commentData.createComment (rid, "youngGosling", postId, "Me too!");



console.log('Done seeding database');
await closeConnection();
