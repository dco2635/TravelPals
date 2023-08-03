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
    email = validate.checkEmail(email); // not sure about this validation
    // email = validate.checkEmail(email); // not sure
    phoneNumber = validate.checkString(phoneNumber);
    //validate phone
    //validate password ---> NEED TO HASH PASSWORD
    const hash = await bcrypt.hash(password,saltRounds)

    let newUser = {
      // _id: new ObjectId(),
      firstName: firstName,
      lastName: lastName,
      userName: userName,
      email: email,
      phonenumber: phoneNumber,
      password: hash,
      friends: [],
      post: [],
      comments: [],
      likes: []
    };
    const userCollection = await users();
    const newInsertInformation = await userCollection.insertOne(newUser);
    
    if (!newInsertInformation.insertedId) throw "Insert failed!";
    return await this.getUserById(newInsertInformation.insertedId.toString());
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
  // Authentication of the User! 
  async getUserByUserName(userName, password){

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
