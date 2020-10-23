
let handler = {

    /**
     * 文本消息
     */
    1:(body,vue) => {
        let sessions = vue.$store.getters.getSessions;
        let session = sessions[body.sender];

        let curReceiver =  vue.$store.getters.getReceivert
        vue.$db.add(body);
        //当前消息的接收者是否是当前选择的接收这
        if(curReceiver){
            if(body.receiver == curReceiver.userId 
                || body.sender == curReceiver.userId){
                vue.$store.commit('addMessage',body);
            }
        }else{
            vue.$notify("新消息");
            //添加未读红点
            session.unread = true;
        }
       
        session.lastMsg = body.content.txt;
        session.lastMsgTime = body.date;
        sessionStorage.setItem("sessions",JSON.stringify(sessions));
    },
    /**
     * 图片消息
     */
    2:(body,vue) => {
        let sessions = vue.$store.getters.getSessions;
        let session = sessions[body.sender];

        let curReceiver =  vue.$store.getters.getReceivert
        vue.$db.add(body);
        //当前消息的接收者是否是当前选择的接收这
        if(curReceiver){
            if(body.receiver == curReceiver.userId 
                || body.sender == curReceiver.userId){
                vue.$store.commit('addMessage',body);
            }
        }else{
            vue.$notify("新消息");
            //添加未读红点
            session.unread = true;
        }
        session.lastMsg = "[图片]";
        session.lastMsgTime = body.date;
        sessionStorage.setItem("sessions",JSON.stringify(sessions));
    },
    /**
     * 添加好友消息
     */
    10: (body,vue) =>{
        vue.$notify("添加好友请求");
        vue.$store.commit("setContactUnread",true);
    },
    /**
     * 同意添加好友请求
     */
    11: (body,vue) => {
        vue.$notify(body.content.username + "现在已经是你的好友了");
        let contact = {
            avatar:body.content.avatar,
            createTime:body.content.createTime,
            remark:body.content.remark,
            userId:body.sender,
            username:body.content.username,
        }
        vue.$store.getters.getContacts.push(contact);        // vue.$store.commit("setContactUnread",true);
    }

}

export default handler;