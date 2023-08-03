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
    if (emailincludes(".")!== true) throw "error: string does contain dot operator ";
    var sub=email.substring(emailDomain.lastIndexOf('.')+1);
     if (sub < 2) throw "error: less than 2 letters after dot";
    if(email.charAt(0) === ".") throw "missing domain"
    return email }
};

// function validateEmail(email) {
//   const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
//   return regex.test(String(email).toLowerCase());
// }

export default exportedMethods;