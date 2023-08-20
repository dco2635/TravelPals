import { friends, users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { userData } from "./index.js";
import validate from "../validate.js";

let exportedMethods = {
  async createFriendByPhoneNumber(phoneNumber, userId) {
    //how to get the userID!?
    phoneNumber = validate.checkPhoneNumber(phoneNumber);

    userId = validate.checkId(userId);

    const yourFriend = await userData.getUserByPhoneNumber(phoneNumber);
    const userCollection = await users();
    
    
   

    const friendsCollection = await friends();

    const newFriend = {
      _id: new ObjectId(),
      friendId: yourFriend._id,
      userId: userId,
    };

    const addedFriend = await userCollection.updateOne(
      //talk to David about this
      { _id: ObjectId(userId) },
      { $push: { friends: newFriend } }
    );

    const storedFriend = await friendsCollection.insertOne(newFriend); //talk to David about this.

    const myFriend = await userCollection.find({ newFriend }).toArray();

    return storedFriend;
  },
  async createFriendUserName(userName, userId) {
    //how to get the userID!?
    userName = validate.checkString(userName);
    userId = validate.checkId(userId);

 
    const yourFriend = await userData.getUserByUserName(userName);
    const person = await userData.getUserById(userId);
    const userCollection = await users();

    let friendName= yourFriend.firstName + " " + yourFriend.lastName; 
    let result = person.friends.filter(p=>p===friendName).length

    console.log(result);

    if(result > 0) throw "Friendship already exists";

    const friendsCollection = await friends();

    const newFriend = {
      _id: new ObjectId(),
      friendId: yourFriend._id,
      friendUsername: yourFriend.userName,
      friendFirstname: yourFriend.firstName,
      friendLastname: yourFriend.lastName,
      userId: userId,
    };

    
    console.log(userId);

    let addedFriend = await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $push: { friends: newFriend.friendFirstname + " " + newFriend.friendLastname} }
    );

    let addedFriend2 = await userCollection.updateOne(
      { _id: new ObjectId(yourFriend._id) },
      { $push: { friends: person.firstName + " " + person.lastName} }
    );


    const storedFriend = await friendsCollection.insertOne(newFriend);

    const myFriend = await userCollection.find({ newFriend }).toArray();

    return storedFriend;
  },

  

  // we need _id that represents the relationship | friend _id | user_id
  // think about how the phone number would be used to search and then once it is found the id attached to the phone number will be placed into the array!
};

export default exportedMethods;
