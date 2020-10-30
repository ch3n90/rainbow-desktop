import Dexie from 'dexie'

const db = new Dexie("rainbow");
db.version(1).stores({
    user: "&id,&username",
    sessions:"&userId",
    chat:"$id,receiver,sender,date",
});

db.install = function(Vue){
       
    Vue.prototype.$user_db = {
        add : o => {
            return db.user.put(o);
        },
        
        
    }

    Vue.prototype.$sessions_db = {
        add : o => {
            return db.sessions.put(o);
        },
        get : () => {
            return db.sessions.toArray();
        }
    }

    Vue.prototype.$chat_db = {
        add : o => {
            return db.chat.put(o);
        },
        get : (sender,receiver,CALLBACK) => {
            //TODO
            db.chat
            .where({'sender':sender,'receiver':receiver})
            .or({'sender':receiver,'receiver':sender})
            
            .project({
                _id:0,
                date:'$_id.date'
            })
            .sort({date:-1})
            .skip(0)
            .limit(10)
            .toArray((error,docs) =>{
                if (error) { console.log(error); }
                CALLBACK(docs?docs.reverse():docs);
            })
        }
    }

}

export default db
