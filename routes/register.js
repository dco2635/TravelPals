import { Router } from "express";
const router = Router();
import userDataFunctions from "../data/users.js";
import validate from "../validate.js";

router.post("/", async (req, res) => {
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
    //  userData.email = validate.checkEmail(userData.email);
    //userData.phoneNumber= validate.checkString(userData.phoneNumber);
    userData.userName= validate.checkString(userData.userName);
    userData.password= validate.checkString(userData.password);
    
    
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }


try {
  let validUser = await userDataFunctions.lookupUser(userData.userName);
  
}
catch (e) {
  return res.status(400).json({ error: 'Username already exists' });
}

try {
  let validEmail = await userDataFunctions.lookupEmail(userData.email);

}
  
catch (e) {
  return res.status(400).json({ error: 'Email already exists' });
}

try {
  let validNumber = await userDataFunctions.lookupPhoneNumber(userData.phoneNumber);

}
  
catch (e) {
  return res.status(400).json({ error: 'Phone number already exists' });
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
    res.status(500).json({error: e.message});
  }
  
});

export default router;
