import Dexie from 'dexie'

const db = new Dexie("rainbow");
db.version(1).stores({
    user: "&id,&username",
    sessions:"&userId",
});

db.install = function(Vue){
       
    Vue.prototype.$user_db = {
        add : o => {
            return db.user.put(o);
        },
        
        // read: (sender,receiver,CALLBACK) => {
        //     rainbow.find({
        //         $or : [
        //             {$and:[{'sender':sender},{'receiver':receiver}]},
        //             {$and:[{'sender':receiver},{'receiver':sender}]},
        //         ],
        //     })
        //     .project({
        //         _id:0,
        //         date:'$_id.date'
        //     })
        //     .sort({date:-1})
        //     .skip(0)
        //     .limit(10)
        //     .toArray((error,docs) =>{
        //         if (error) { console.log(error); }
        //         CALLBACK(docs?docs.reverse():docs);
        //     })
        // }
    }

    Vue.prototype.$sessions_db = {
        add : o => {
            return db.sessions.put(o);
        },
        get : () => {
            return db.sessions.toArray();
        }
    }

}

export default db
