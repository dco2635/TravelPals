import { posts,comments, users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validate from "../validate.js";

let exportedMethods = {

  async createComment(userId, postId, text) {
    const userCollection = await users();
    const postsCollection = await posts();
    const commentCollection = await comments();
    const newComment = {  
        _id: new ObjectId(),
        userId: userId,
        postId: postId, // idk where this comes from
        text: text
      };

      
      
      const addedComment = postsCollection.updateOne( 
        { _id: new ObjectId(postId) },
        { $push: { comments: newComment } });

        //How will we update the user collection? 

        const storedComment = commentCollection.insertOne(newComment); 

        const myComment = await postCollection.find({ newComment }).toArray();
    
        return myComment;

      
  }
};

//get comment by post id 

export default exportedMethods;
