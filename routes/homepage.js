
import express from 'express';
import path from 'path';
const router = express.Router();
import userDataFunctions from "../data/users.js";
import {friendData,postData, commentData} from "../data/index.js";
import validate from "../validate.js";
import { ObjectId } from 'mongodb';
import { posts } from '../config/mongoCollections.js';


router.route('/').get(async (req, res) => {
  res.render('login',{pageTitle:'News Feed'});
});
router.route('/newsFeed').get(async (req, res) => {
 res.render('newsFeed',{pageTitle:'News Feed'});
});
router.route('/loadData').get(async (req, res) => {
  const post = await posts();
 const data = await post.find({}).toArray();
  res.send(data)
 });
 

router.route('/search/:text').get(async (req, res) => {
  const search = req.params.text;
  const post = await posts();
  const result = await post.find({}).toArray();
  const data = result.filter(p=>p.userName.toLowerCase().includes(search.trim().toLowerCase()));
  res.send(data)
});
router.route('/addpost').get(async (req, res) => {
   res.render('post',{pageTitle:'Add Post'});
});



router.route('/addNewPost').post(async (req, res) => {
  
   let userData= req.body;
   try {
 
    const newPost= await postData.createPost(userData.userId, userData.userName, userData.title, userData.body);
    res.json(newPost);
    console.log(newPost);
   }
   catch(e) {
    res.status(500).json({error: e});
   }
});

router.route('/addpost/id').get(async (req, res) => {
  res.json("Succesful");
});

router.route('/edit').put(async (req, res) => {
  let userData= req.body;
  console.log(userData);
   try {
 
    const newPost= await postData.updatePost(userData.postId,userData.userId, userData.userName, userData.title, userData.body);
    res.json(newPost);
    console.log(newPost);
   }
   catch(e) {
    res.status(500).json({error: e});
   }
  
});
router.route('/delete/:id').delete(async (req, res) => {
  const id = req.params.id;
  const post = await posts();
  const result = await post.deleteOne({_id:new ObjectId(id)})
  res.send(result)
  
});
router.route('/addpost/id').post(async (req, res) => {


  let userData= req.body;
  try {
   const newComment= await commentData.createComment(userData.userName,userData.userId, userData.postId, userData.text);
   res.json(newComment);
   
  }
  catch(e) {
   res.status(500).json({error: e});
  }
});



router.route('/profile').get(async (req, res) => {
   res.render('profile',{pageTitle:'Profile'});
 });

 router.route('/addfriends').post(async (req, res) => {
  

  let userData = req.body;
  try {
    const newUser = await friendData.createFriendUserName(userData.userName, userData.userId); //requires req.session.user
    
    //res.json(newUser);
  } catch (e) {
    res.status(500).json({error: e});
  }
 
});


 router.route('/logout').get(async (req, res) => {
   res.render('logout',{pageTitle:'Logout'});
});

router.route('/login').get(async (req, res) => {
   res.render('partials/login',{pageTitle:'Login'});
});

router.route('/login').post(async (req, res) => {
  let userInfo = req.body; 
  try {
    
    if (!userInfo.userName)throw "Username is not specfied"; 
    if (!userInfo.password)throw "Password is not specfied"; 

   userInfo.userName= validate.checkString(userInfo.userName);
   userInfo.password= validate.checkString(userInfo.password);

  }
  catch(e) {
    return res.status(400).json({ error: e });
  }

  try {
    let authUser= await userDataFunctions.checkUser(userInfo.userName, userInfo.password);
    res.json(authUser);
   let user = {_id: authUser._id, phoneNumber: authUser.phoneNumber, userName: authUser.userName}; //need to update req.session.user look at nader's code for reference
   console.log(user);
    
  }
  catch(e){
    res.status(500).json({error: e});
  }
  
});

router.route('/register').get(async (req, res) => {
   res.render('partials/register',{pageTitle:'Register'});
});

router.
route('/register').post(async (req, res) => {
   let userData = req.body;
   console.log(req.body);
 
   if (!userData || Object.keys(userData).length === 0) {
     return res
       .status(400)
       .json({ error: "There are no fields in the request body" });
   }
 
   try {   //validate input
     userData.firstName = validate.checkString(userData.firstName, "First Name");  
     userData.lastName = validate.checkString(userData.lastName, "Last Name");
 
     userData.email = validate.checkString(userData.email, "Email");
      userData.email = validate.checkEmail(userData.email);
     userData.phoneNumber= validate.checkPhoneNumber(userData.phoneNumber);
     userData.userName= validate.checkString(userData.userName);
     userData.password= validate.checkString(userData.password);
     
     
   } catch (e) {
     return res.status(400).json({ error: e.message });
   }
 
 
 try {
   let validUser = await userDataFunctions.lookupUser(userData.userName);
   
 }
 catch (e) {
   return res.status(400).json({ error: e });
 }
 
 try {
   let validEmail = await userDataFunctions.lookupEmail(userData.email);
 
 }
   
 catch (e) {
   return res.status(400).json({ error: e });
 }
 
 try {
   let validNumber = await userDataFunctions.lookupPhoneNumber(userData.phoneNumber);
 
 }
   
 catch (e) {
   return res.status(400).json({ error: e });
 }
 
 
 
 
   
 
 
   try {
     const newUser = await userDataFunctions.addUser(
       userData.firstName,
       userData.lastName,
       userData.userName,
       userData.email,
       userData.phoneNumber,
       userData.password
     );
     res.json(newUser);
   } catch (e) {
     res.status(500).json({error: e});
   }
   
});


export default router
