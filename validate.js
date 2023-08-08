import {ObjectId} from 'mongodb';

const exportedMethods = {
  checkId(id) {
    if (!id) throw 'Error: You must provide an id to search for';
    if (typeof id !== 'string') throw 'Error: id must be a string';
    id = id.trim();
    if (id.length === 0)
      throw 'Error: id cannot be an empty string or just spaces';
    if (!ObjectId.isValid(id)) throw 'Error: invalid object ID';
    return id;
  },

  checkString(strVal, varName) {
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    if (!isNaN(strVal))
      throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
    return strVal;
  },

  checkEmail(email) {
    if (!email) throw `Error: You must supply a email!`;
   if (typeof email !== 'string') throw `Error: email must be a string!`;
   email = email.trim();
      email= email.toLowerCase();
     if (email.includes(" ")) throw `Error: email cannot contain empty spaces`;
    
    if (!email.match(/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/)) throw "Email is not valid";

    return email;
  },
  checkPhoneNumber(phoneNumber) {
    if(!phoneNumber) throw 'Error: we need the phone numnber';
    phoneNumber = phoneNumber.trim();
    if (phoneNumber.length != 10) throw 'phoneNumber needs to be exactly 10 digits!'
 
    if(!phoneNumber.match(/^[0-9]+$/)) throw 'phoneNumber is not valid!'
    
    return phoneNumber;
  }


};
export default exportedMethods;