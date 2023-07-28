import {MongoClient} from 'mongodb';
import {mongoConfig} from './settings.js';

let _connection = undefined;
let _db = undefined;

export const dbConnection = async () => {
 try{
  if (!_connection) {
    _connection = await MongoClient.connect(mongoConfig.serverUrl);
    _db = _connection.db(mongoConfig.database);
    console.log('connected to db')
  }

  return _db;
 }
 catch(err){
    console.log('unable connect to db')
 }
  
};

export const closeConnection = async () => {
  await _connection.close();
};