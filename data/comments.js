import { posts,comments, users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validate from "../validate.js";


let exportedMethods = {

  async createComment(userName,userId, postId, text) {

    userId = validate.checkId(userId);
    postId = validate.checkId(postId);
    userName = validate.checkString(userName);
    text = validate.checkString(text);
    
    const userCollection = await users();
    const postsCollection = await posts();
    const commentCollection = await comments();

    const newComment = {  
        _id: new ObjectId(),
        userName: userName,
        userId: userId,
        postId: postId, // idk where this comes from
        text: text
      };

      
      
     
const addedComment = await postsCollection.updateOne( 
        { _id: new ObjectId(postId) },
        { $push: { comments: newComment } }
      );

        //How will we update the user collection? 

        

        const updateUserPost = await userCollection.findOneAndUpdate(
          { "posts._id": new ObjectId(postId) },
          { $set: { posts: { _id: postId} } },
          {returnDocument: 'after'}
        );
        //if this fails put "postId"
        
        const storedComment = commentCollection.insertOne(newComment); 

  
        const myComment = await postsCollection.find({ newComment }).toArray();
    
        return myComment;

      
  }
};



export default exportedMethods;
