import { Router } from "express";
const loginRoute = Router();
import userDataFunctions from "../data/users.js";
import validate from "../validate.js";

loginRoute.post("/login", async (req, res) => {

    let userInfo = req.body; 

    try {
    
        if (!userInfo.userName)throw "Email address is not specfied"; 
        if (!userInfo.password)throw "Password is not specfied"; 
        userInfo.email = validate.checkString(userInfo.email, "Email");
        userInfo.email = validate.checkEmail(userInfo.email);
       //userData.phoneNumber= validate.checkString(userData.phoneNumber);
       userInfo.userName= validate.checkString(userInfo.userName);
  
      }
      catch(e) {
        return res.status(400).json({ error: e.message });
      }

      try {
        let authUser= await userDataFunctions.checkUser(userInfo.emailAddressInput, userInfo.passwordInput)
        
      }
      catch(e){
        res.status(500).render('register', {error: e.message});
  
      }
      


});