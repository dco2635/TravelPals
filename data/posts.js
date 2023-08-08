import { posts,users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validate from "../validate.js";

let exportedMethods = {

    async getAllPosts() {
        const postsCollection = await posts();
        const postList = await postCollection.find({}).toArray();
        return postList; //we want to filter out the object id and other irrelevant information for our feed
      },


      async createPost(userId, title, body) {
        const userCollection = await users();
        const postsCollection = await posts();

        const newPost = {   //wouldn't we want to add a username to each post?? we can pass a name  with req.session.user like userid
            _id: new ObjectId(),
            userId: userId,
            body: body, 
            title: title,
            comments: [],
            likes: 0
    
          };
          
          const addedPost = await userCollection.updateOne( //talk to David about this
            { _id: new ObjectId(userId) },
            { $push: { posts: newPost } });

            const storedPost = await friendsCollection.insertOne(newPost); //talk to David about this. 

            const myPost = await userCollection.find({ newPost }).toArray();
        
            return myPost;

          
      

      }
      
    //deleting post
    //editing/ updating post
    //updating likes 



};

export default exportedMethods;
