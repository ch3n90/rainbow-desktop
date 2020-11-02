import Dexie from 'dexie'

const db = new Dexie("rainbow");
db.version(1).stores({
    users: "&id,&username",
    sessions:"&userId",
    chats:"id,receiver,sender,date",
});

export {db}