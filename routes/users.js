import {Router} from 'express';
const router = Router();
import userDataFunctions from '../data/users.js';
import validate from '../validate.js';


router.post('/register', async (req, res) => {
   const userData = requ.body; 

   if (!userData || Object.keys(userInfo).length === 0) {
    return res
      .status(400)
      .json({error: 'There are no fields in the request body'});
  }

  try {
    userData.firstName = validate.checkString(
      userInfo.firstName,
      'First Name'
    );
    userData.lastName = validate.checkString(
      userInfo.lastName,
      'Last Name'
    );
    
    userData.email= validate.checkString(
        userInfo.email,
        'Email'
    );
    userData.email= validate.checkEmail; 
    
    //validate phone
    //valida password
  } catch (e) {
    return res.status(400).json({error: e});
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