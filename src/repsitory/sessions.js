const {db} = require('./db');

function insert(doc){
    return db.sessions.put(doc);
}

function query(ownership){
    return db.sessions.where('ownership').equals(ownership).reverse().sortBy('lastMsgTime',array => {
        return array;
    })
}

function updateLastMsgTimeAndLastMsgContentById(lastMsgTime,lastMsgContent,unread,userId){
    return db.sessions.where("userId")
        .equals(userId)
        .modify({"lastMsgTime":lastMsgTime,"lastMsg":lastMsgContent,"unread":unread});
}

function updateRemarkById(remark,userId){
    return db.sessions.where("userId")
        .equals(userId)
        .modify({"remark":remark});
}

export {insert as insertSessions,
    query as querySessions,
    updateLastMsgTimeAndLastMsgContentById,
    updateRemarkById}