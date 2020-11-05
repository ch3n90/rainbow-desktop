const {db} = require('./db');

function insert(doc){
    return db.users.put(doc);
}

function remove(id){
    return db.users
        .where("id")
        .equals(id)
        .delete();
}

function query(){
    return db.users.orderBy("lastLoginTime").reverse().toArray();
}

export {insert as insertUser,query as queryUser,remove as removeById}