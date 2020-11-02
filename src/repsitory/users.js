const {db} = require('./db');

function insert(doc){
    return db.users.put(doc);
}

export {insert as insertUser}