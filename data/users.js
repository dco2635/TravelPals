import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validate from "../validate.js";
import bcrypt from 'bcrypt';
const saltRounds = 16;

let exportedMethods = {
  async getAllUsers() {
    const userCollection = await users();
    const userList = await userCollection.find({}).toArray();
    return userList;
  },

  async getUserById(id) {
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: ObjectId(id) });
    if (!user) throw "Error: User not found";
    return user;
  },

  async addUser(firstName, lastName, userName, email, phoneNumber, password) {
    firstName = validate.checkString(firstName);
    lastName = validate.checkString(lastName);
    email = validate.checkString(email); 
     email = validate.checkEmail(email); 
    //phoneNumber = validate.checkString(phoneNumber);
    userName = validate.checkString(userName);
    //validate phone
   
    const hash = await bcrypt.hash(password,saltRounds)

    



    let newUser = {
      // _id: new ObjectId(),
      firstName: firstName,
      lastName: lastName,
      userName: userName,
      email: email,
      phoneNumber: phoneNumber,
      password: hash,
      friends: [],
      post: [],
      comments: [],
      likes: []
    };
    const userCollection = await users();
    const insertInfo = await userCollection.insertOne(newUser);
    
    if (!insertInfo.insertedId) throw "Insert failed!";
    const user = await userCollection.findOne({_id: new ObjectId(insertInfo.insertedId)});

    return user;
  },
  async getUserByEmail(){
    email = validate.checkString(email);

    const userCollection = await users();
    
    const user = await userCollection.findOne({ email: email });

    if (!user) throw "Error: User not found";
    return user;
  },
  async getUserByPhoneNumber(phoneNumber){
    phoneNumber = validate.checkString(phoneNumber);

    const userCollection = await users();

    const user = await userCollection.findOne({ phonenumber: phoneNumber });

    if (!user) throw "Error: User not found";
    return user;
  },

  async lookupUser(userName){
    userName = validate.checkString(userName);

    const userCollection = await users();

    const user = await userCollection.findOne({ userName: userName});

    let flag = false;
    if (user) {
      flag = true;
    }

    if(flag == true) throw "Username already exists";

    return user
    
  },

  async lookupEmail(email){
    email = validate.checkString(email);
    //email = validate.checkEmail(email); // not sure about this validation
  

    const userCollection = await users();

    const user = await userCollection.findOne({ email: email});

    let flag = false;
    if (user) {
      flag = true;
    }

    if(flag == true) throw "Email already exists";

    return user
    
  },

  async lookupPhoneNumber(phoneNumber){
   // phoneNumber = validate.checkString(phoneNumber);

    const userCollection = await users();

    const user = await userCollection.findOne({ phoneNumber: phoneNumber});

    let flag = false;
    if (user) {
      flag = true;
    }

    if(flag == true) throw "Number already exists";

    return user
    
  },

  // Authentication of the User! 
  async checkUser(userName, password){

    const userCollection = await users();

    const user = await userCollection.findOne({ userName: userName });

    let comparePassword = await bcrypt.compare(password, user.password );
    
    if (comparePassword === false){
      throw "Invalid User Input!";
    } 
      return user;
  },
  
};

export default exportedMethods;
