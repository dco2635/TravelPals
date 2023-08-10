
import {dbConnection} from './mongoConnection.js';

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
      console.log('Db connection successful')
    }

    return _col;
  };
};

//TODO: YOU WILL NEED TO CHANGE THE CODE BELOW TO HAVE THE COLLECTION(S) REQUIRED BY THE ASSIGNMENT
export const users = getCollectionFn('users');
export const friends = getCollectionFn('friends');
export const posts = getCollectionFn('posts');
export const comments = getCollectionFn('comments');

