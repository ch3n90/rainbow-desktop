const {db} = require('./db');

function insert(doc){
    return db.sessions.put(doc);
}

function query(ownership){
    return db.sessions.where('ownership').equals(ownership).toArray();
}

export {insert as insertSessions,query as querySessions}