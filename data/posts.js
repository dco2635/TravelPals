import { posts, users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validate from "../validate.js";

let exportedMethods = {
  async getAllPosts() {
    const postsCollection = await posts();
    const postList = await postsCollection.find({}).toArray();
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
      likedBy:[]
    };
    const storedPost = await postsCollection.insertOne(newPost);

    const addedPost = await userCollection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $push: { posts: newPost } },
      {returnDocument: 'after'}
    );


  
    console.log(addedPost.value);


    return storedPost;
  },
  async getPostById(postId) {
    const postsCollection = await posts();

    validate.checkId(id);
    const posts = await postsCollection.findOne({ _id: ObjectId(postId) });
    if (!posts) throw "Error: Post not found";
    return posts;
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

    let newPostId= new ObjectId(postId)

   
    const foundPost = await postsCollection.findOneAndUpdate(
      { _id: newPostId },
      { $set: { userId: userId, userName: userName, title: title, body: body }}
      ,{returnDocument: 'after'}
    );
 
    const updateUserPost = await userCollection.findOneAndUpdate(
      { "posts._id": new ObjectId(foundPost.value._id) },
      { $set: { posts: { _id: foundPost.value._id } }} ,
      {returnDocument: 'after'}
    );
    return updateUserPost.value;
  },
  async getUserByUserName(userName){
    userName = validate.checkString(userName);

    const postsCollection = await posts();
    
    const user = await postsCollection.findOne({ userName: userName });

    if (!user) throw "Error: User not found";
    return user;
  },
  async likePost(postId, userName) {
    const userCollection = await users();
    const postsCollection = await posts();
    const findPost = await postsCollection.findOne({_id:new ObjectId(postId)})
    let updateUserPost,updateLikedBy;
    if(findPost.likedBy.length > 0){
     let result = findPost.likedBy.filter(p=>p===userName).length
     if(result > 0){
      let currentLikes = findPost.likes;
      let updateLikes = currentLikes -1;
      updateUserPost = await postsCollection.findOneAndUpdate(
        { _id: new ObjectId(postId) },
        { $set: { likes: updateLikes }},
        {returnDocument: 'after'}
      );
      updateLikedBy = await postsCollection.findOneAndUpdate(
        { _id: new ObjectId(postId) },
        { $pull: { likedBy: userName } },
        {returnDocument: 'after'}
      );
     }
    }else{
      let currentLikes = findPost.likes;
      let updateLikes = currentLikes +1;
      updateUserPost = await postsCollection.findOneAndUpdate(
        { _id: new ObjectId(postId) },
        { $set: { likes: updateLikes }},
        {returnDocument: 'after'}
      );

      updateLikedBy = await postsCollection.findOneAndUpdate(
        { _id: new ObjectId(postId) },
        { $push: { likedBy: userName } },
        {returnDocument: 'after'}
      );
    }
    
return updateUserPost.value;
  },
};

export default exportedMethods;
