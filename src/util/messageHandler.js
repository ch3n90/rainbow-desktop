const {insertSessions} = require('../repsitory/sessions')
const {insertChat} = require('../repsitory/chats')
const remote = require('electron').remote
const {ipcRenderer} = require('electron')

let handler = {

    msgChain:(body,vue) => {
        let sessions = vue.$store.getters.getSessions;
        handler[body['msgType']](body,vue,sessions);
        //sort sessions
        sessions.sort((a,b) => {
            return b.lastMsgTime - a.lastMsgTime;
        });
        vue.$store.commit("setSessions",sessions);
        //cache chat mssage to db
        insertChat(body);
        // window is focus
        if(remote.getCurrentWindow().isFocused){
            ipcRenderer.send("msg");
        }
    },
    /**
     * 文本消息
     */
    1:(body,vue,sessions) => {
        let curReceiver =  vue.$store.getters.getReceiver;
        //当前消息的接收者是否是当前选择的接收者
        if(curReceiver){
            if(body.sender === curReceiver.userId){
                vue.$store.commit('addMessage',body);
            }
        }
        let i ;
        let session = sessions.find((session,index) => {
            i = index;
            return session.userId === body.sender;
        })
        if(!session){
            let contacts = vue.$store.getters.getContacts;
            session = contacts.find(session => {
                return session.userId === body.sender;
            })
            session.unread = true;
            session.lastMsg = body.content.txt;
            session.ownership = vue.$store.getters.getUser.id;
            session.lastMsgTime = body.date;

            sessions.unshift(session);
            insertSessions(session);
        }else{
            session.lastMsg = body.content.txt;
            session.lastMsgTime = body.date;
            if(curReceiver && session.userId != curReceiver.userId){
                session.unread = true;
            }
            vue.$set(sessions,i,session);
        }
    },
    /**
     * 图片消息
     */
    2:(body,vue,sessions) => {
        let curReceiver =  vue.$store.getters.getReceiver;
        //当前消息的接收者是否是当前选择的接收者
        if(curReceiver){
            if(body.sender === curReceiver.userId){
                vue.$store.commit('addMessage',body);
            }
        }

        let i ;
        let session = sessions.find((session,index) => {
            i = index;
            return session.userId === body.sender;
        })
        if(!session){
            let contacts = vue.$store.getters.getContacts;
            session = contacts.find(session => {
                return session.userId === body.sender;
            })
            session.unread = true;
            session.lastMsg = '[图片]';
            session.ownership = vue.$store.getters.getUser.id;
            session.lastMsgTime = body.date;

            sessions.unshift(session);
            insertSessions(session);
        }else{
            session.lastMsg = '[图片]';
            session.lastMsgTime = body.date;
            if(curReceiver && session.userId != curReceiver.userId){
                session.unread = true;
            }
            vue.$set(sessions,i,session);
        }
    },
    /**
     * 添加好友消息
     */
    10: (body,vue) =>{
        let myNotification = new Notification('新消息',{
            body: "添加好友请求",
            silent: true,
        });
        vue.$store.commit("setContactUnread",true);
    },
    /**
     * 同意添加好友请求
     */
    11: (body,vue) => {
        let myNotification = new Notification('新消息',{
            body: body.content.username + "已经成为你的好友了",
            silent: true,
        });
        let contact = {
            avatar:body.content.avatar,
            createTime:body.content.createTime,
            remark:body.content.remark,
            userId:body.sender,
            username:body.content.username,
        }
        vue.$store.getters.getContacts.push(contact);
    }

}

export default handler;