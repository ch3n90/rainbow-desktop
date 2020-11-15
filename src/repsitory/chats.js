const {db} = require('./db');


function insert(doc){
    return db.chats.put(doc);
}

function query(user,pageNum,CALLBACK){
    const table = db.chats;
    const collection = table
    .where('sender').equals(user)
    .or('receiver').equals(user);


    const ORDER_BY = "id";

    collection.primaryKeys(keys => {
        const primaryKeySet = new Set(keys);
        let totalCount = primaryKeySet.size;
        let offset,pageSize = 20;
        if(totalCount - pageSize * pageNum < 0){
            offset = totalCount;
            pageSize = totalCount % pageSize;
        }else{
            offset =  pageSize * pageNum;
        }
        let pageKeys = [];
        table
        .orderBy(ORDER_BY)
        .offset(totalCount - offset)
        .until(() => pageKeys.length === pageSize)
        .eachPrimaryKey(id => {
            if (primaryKeySet.has(id)) {
                pageKeys.push(id);
            }
        })
        .then(() => {
            return Promise.all(pageKeys.map(id => table.get(id)));
        })
        .then(docs => {
            CALLBACK(docs);
        });
    })
    
}

export {insert as insertChat,query as queryChats}