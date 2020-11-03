const {db} = require('./db');

function insert(doc){
    return db.users.put(doc);
}

function query(){
    return db.users.toArray();
}

export {insert as insertUser,query as queryUser}