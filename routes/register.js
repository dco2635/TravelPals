import { Router } from "express";
const router = Router();
import userDataFunctions from "../data/users.js";
import validate from "../validate.js";

router.post("/", async (req, res) => {
  const userData = req.body;

  if (!userData || Object.keys(userInfo).length === 0) {
    return res
      .status(400)
      .json({ error: "There are no fields in the request body" });
  }

  try {   //validate input
    userData.firstName = validate.checkString(userInfo.firstName, "First Name");  
    userData.lastName = validate.checkString(userInfo.lastName, "Last Name");

    userData.email = validate.checkString(userInfo.email, "Email");
    userData.email = validate.checkEmail(userInfo.email);
    userData.phoneNumber= validate.checkString(userInfo.phoneNumber);
    userData.userName= validate.checkString(userInfo.userName);
    userData.password= validate.checkString(userInfo.password);
    
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }

  try {
    validUserName =userDataFunctions.lookupUser(); //check if userName already exists in db. To ensure, duplicate user
    if(validUserName === true) throw "User already exists"; 
  }
  catch(e) {
    return res.status(400).json({ error: e });
  }

  try {
    validEmail =userDataFunctions.lookupEmail(); //check if email already exists in db. To ensure, duplicate user
    if(validEmail === true) throw "User already exists"; 
  }
  catch(e) {
    return res.status(400).json({ error: e });
  }

  try {
    validPhoneNumber =userDataFunctions.lookupPhoneNumber(); //check if phone number already exists in db. To ensure, duplicate user
    if(validPhoneNumber === true) throw "User already exists"; 
  }
  catch(e) {
    return res.status(400).json({ error: e });
  }



  try {
    validphoneNumber =userDataFunctions.getUserByPhoneNumber(); //check if userName already exists in db. To ensure, duplicate user
  }
  catch(e) {
    return res.status(400).json({ error: e.message });
  }
 

  try {
    const newUser = await userDataFunctions.addUser(
      userData.firstName,
      userData.lastName,
      userData.email,
      userData.phoneNumber,
      userData.password
    );
    res.json(newUser);
  } catch (e) {
    res.sendStatus(500);
  }
  
});

export default router;
