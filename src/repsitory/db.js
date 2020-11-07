import Dexie from 'dexie'

const db = new Dexie("rainbow");
db.version(1).stores({
    users: "&id,&username,lastLoginTime",
    sessions:"&userId,ownership",
    chats:"id,receiver,sender,date",
});

export {db}