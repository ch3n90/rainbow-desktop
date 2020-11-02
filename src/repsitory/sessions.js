const {db} = require('./db');

function insert(doc){
    return db.sessions.put(doc);
}

function query(){
    return db.sessions.toArray();
}

export {insert as insertSessions,query as querySessions}