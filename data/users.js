import {users} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';


let exportedMethods = {

    async getAllUsers() {
        const userCollection = await users();
        const userList = await userCollection.find({}).toArray();
        return userList;
      },


    async getUserById(id) {

        const userCollection = await users();
        const user = await userCollection.findOne({_id: ObjectId(id)});
        if (!user) throw 'Error: User not found';
        return user;
      },

    async addUser(firstName, lastName, email, phoneNumber, password ) {

    
        let newUser = {
          firstName: firstName,
          lastName: lastName,
          email: email,
          phonenumber: phoneNumber, 
          password: password,
          friends: []
        };
    const userCollection = await users();
    const newInsertInformation = await userCollection.insertOne(newUser);
    if (!newInsertInformation.insertedId) throw 'Insert failed!';
    return await this.getUserById(newInsertInformation.insertedId.toString());
        
    },

   
    };
    
    
  
   

   
   


export default exportedMethods;