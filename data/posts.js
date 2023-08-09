import { posts, users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validate from "../validate.js";

let exportedMethods = {
  async getAllPosts() {
    const postsCollection = await posts();
    const postList = await postCollection.find({}).toArray();
    return postList; //we want to filter out the object id and other irrelevant information for our feed
  },

  async createPost(userId, userName, title, body) {
    const userCollection = await users();
    const postsCollection = await posts();

    userId = validate.checkId(userId);
    userName = validate.checkString(userName);
    title = validate.checkString(title);
    body = validate.checkString(body);

    const newPost = {
      //wouldn't we want to add a username to each post?? we can pass a name  with req.session.user like userid
      _id: new ObjectId(),
      userId: userId,
      userName: userName,
      body: body,
      title: title,
      comments: [],
      likes: 0,
    };

    const addedPost = await userCollection.updateOne(
      //talk to David about this
      { _id: ObjectId(userId) },
      { $push: { posts: newPost } }
    );

    const storedPost = await postsCollection.insertOne(newPost); //talk to David about this.

    const myPost = await userCollection.find({ newPost }).toArray();

    return myPost;
  },
  async deletePost(postId) {
    validate.checkId(postId);

    const postsCollection = await posts();
    const userCollection = await users();

    const foundPost = await postsCollection.findOne({
      "posts._id": new ObjectId(postId),
    });

    if (!foundPost) {
      // If product does not exist
      throw "Review does not exist!";
    } else {
      let foundPostId = foundPost._id;

      const removePost = await postsCollection.deleteOne({
        _id: new ObjectId(foundPostId),
      });

      console.log("This post was removed from post collections:", removePost);

      const removedPostAtUser = await userCollection.findOneAndUpdate(
        { "posts._id": new ObjectId(foundPostId) },
        { $pull: { posts: { _id: foundPostId } } }
      );
      console.log("this post was removed", removedPostAtUser);
    }
  },
  async updatePost(postId, userId, userName, title, body) {
    const userCollection = await users();
    const postsCollection = await posts();

    userId = validate.checkId(userId);
    userName = validate.checkString(userName);
    title = validate.checkString(title);
    body = validate.checkString(body);

    const foundPost = await postCollection.updateOne(
      { _id: new Object(postId) },
      { $set: { userId: userId, userName: userName, title: title, body: body } }
    );

    const updateUserPost = await userCollection.findOneAndUpdate(
      { "posts._id": new ObjectId(foundPost._id) },
      { $set: { posts: { _id: foundPost._id } } }
    );

    // const updatedPost = await postCollection.updateOne()
  },
  //deleting post
  //updating post
  //updating likes

  //getpost by username implementing a search function
};

export default exportedMethods;
