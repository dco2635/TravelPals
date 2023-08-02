import { friends, users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validate from "../validate.js";

let exportedMethods = {
  async createFriend(userId, friendId) {
    let userIdforFriend = new ObjectId(userId);

    const newFriend = {
      _id: new ObjectId(),
      friendId: friendId,
      userId: userId,
    };
    const userCollection = await users();

    const friendsCollection = await friends();

    const addedFriend = await userCollection.updateOne(
      { _id: userIdforFriend },
      { $push: { friends: newFriend } }
    );

    const storedFriend = await friendsCollection.insertOne(newFriend);

    const myFriend = await userCollection.find({ newFriend }).toArray();

    return myFriend;
  },
  // we need _id that represents the relationship | friend _id | user_id
  // think about how the phone number would be used to search and then once it is found the id attached to the phone number will be placed into the array!
};
