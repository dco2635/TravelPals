import { Router } from "express";
const loginRoute = Router();
import userDataFunctions from "../data/users.js";
import validate from "../validate.js";

loginRoute.post("/login", async (req, res) => {

    let userInfo = req.body; 

    try {
    
        if (!userInfo.userName)throw "Email address is not specfied"; 
        if (!userInfo.password)throw "Password is not specfied"; 
  
       userInfo.userName= validate.checkString(userInfo.userName);
       userInfo.password= validate.checkString(userData.password);
  
      }
      catch(e) {
        return res.status(400).json({ error: e.message });
      }

      try {
        let authUser= await userDataFunctions.checkUser(userInfo.userName, userInfo.password);
        req.session.user = {_id: authUser.id, phoneNumber: authUser.phoneNumber, userName: authUser.userName};
        
      }
      catch(e){
        res.status(500).render('login', {error: e.message});
      }
      


});