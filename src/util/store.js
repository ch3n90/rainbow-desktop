import zango from 'zangodb'


const DB = new zango.Db('rainbow', { rainbow: ['sender','receiver','date'] });
const rainbow = DB.collection('rainbow');

DB.install = function(Vue){
       
    Vue.prototype.$db = {
        add : o => {
            rainbow.insert(o);
        },
        close :()=>{
            DB.close();
        },
        read: (sender,receiver,CALLBACK) => {
            rainbow.find({
                $or : [
                    {$and:[{'sender':sender},{'receiver':receiver}]},
                    {$and:[{'sender':receiver},{'receiver':sender}]},
                ],
            })
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

export default DB
