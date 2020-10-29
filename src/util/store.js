import Dexie from 'dexie'

const user_db = new Dexie("rainbow");
user_db.version(1).stores({
    user: "&id,&username"
});

user_db.install = function(Vue){
       
    Vue.prototype.$user_db = {
        add : o => {
            return user_db.user.add(o)
        },
        update: o=>{

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


}

export default user_db
