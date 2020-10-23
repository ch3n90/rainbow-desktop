<template>
    <div>
        <div class="label">
            <span>好友信息</span>
        </div>
        <div class="info">
            <div class="avator">
                <img :src="contact.avatar" alt="">
            </div>
            <div class="infoDetails">
                <table>
                    <tr>
                        <td>昵称</td>
                        <td>{{contact.nickname}}</td>
                    </tr>

                    <tr>
                        <td>备注</td>
                        <!-- <td>{{contact.remark}}</td> -->
                        <td v-if="flag">
                            {{contact.remark}}
                            <a @click.stop="editRemark">修改</a>
                        </td>
                        <td v-else><input class="remark" type="text" @blur.stop="editRemark2" v-model="remark" ></td>
                    </tr>

                    <tr>
                        <td>年龄</td>
                        <td>{{contact.age}}</td>
                    </tr>
                    <tr>
                        <td>性别</td>
                        <td>{{contact.gender | gender}}</td>
                    </tr>

                     <tr>
                        <td>电话</td>
                        <td>{{contact.phone}}</td>
                    </tr>

                     <tr>
                        <td>邮箱</td>
                        <td>{{contact.email}}</td>
                    </tr>

                     <tr>
                        <td>签名</td>
                        <td>{{contact.signature}}</td>
                    </tr>

                </table>
            </div>
            <input class="sendBtn" type="button" value="发送消息" @click.stop="sendTo">
            <input class="deleteBtn" type="button" value="删除好友" @click.stop="deleteContact">
        </div>
    </div>
</template>

<script>
import HttpApi from '../../util/http'

export default {
    name:"Contact",
    data(){
        return {
            contact: "",
            flag:true,
            remark:null,
        }
    },
    filters:{
        gender(val){
            if(val == 1){
                return "男";
            }else if(val == 0){
                return "女";
            }else{
                return "-";
            }
        },
    },
    methods:{
        deleteContact(){
            HttpApi.delete("/contact/v1/del/"+this.contact.userId)
            .then(resp => {
                if(resp.code == 200){
                    let contacts = this.$store.getters.getContacts;
                    for(let ele of contacts){
                        if(this.contact.userId === ele.userId){
                            contacts.pop(ele);
                            break;
                        }
                    }
                    this.$emit("func",""); 
                }else{
                    this.$notify(resp.msg);
                }
            })
            .catch(err => {
                console.log(err)
            })
        },
        sendTo(){
            //set current receiver
            this.$store.commit("setReceiver",this.contact);
            //cache current user for session list
            let sessions = sessionStorage.getItem("sessions");
            if(sessions){
                sessions = JSON.parse(sessions);
                if(!sessions[this.contact.userId]){
                    sessions[this.contact.userId] = this.contact;
                    sessionStorage.setItem("sessions",JSON.stringify(sessions));
                }
            }else{
                sessions = {};
                sessions[this.contact.userId] = this.contact;
                sessionStorage.setItem("sessions",JSON.stringify(sessions))
            }
            this.$emit("func","Flow"); 
            this.$emit("func2","Sessions"); 

        },
        editRemark(){
            this.flag = false;
        },
        editRemark2(){
            this.flag = true;
            if(this.remark === this.contact.remark){
                return;
            }
            let contactId = this.$store.getters.getContact.userId;
            HttpApi.post('/contact/v1/remark',{
                contactId: contactId,
                remark:this.remark
            })
            .then(response =>{
                if(response.code == 200){
                    //修改当前联系人面板信息
                    this.contact.remark = this.remark;
                    //修改联系人列表信息
                    let contacts = this.$store.getters.getContacts;
                    for(let contact of contacts){
                        if(contactId === contact.userId){
                            contact.remark = this.remark;
                            break;
                        }
                    }
                    //刷新会话列表
                    let sessions = sessionStorage.getItem("sessions");
                    if(sessions){
                        sessions = JSON.parse(sessions);
                        let contact = sessions[this.contact.userId];
                        if(contact){
                            contact.remark = this.remark;
                            sessionStorage.setItem("sessions",JSON.stringify(sessions));
                        }
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    },
    created(){
         HttpApi.post('/user/v1/contact/detail',{
                contactId:this.$store.getters.getContact.userId
            })
            .then(response =>{
                if(response.code === 200){
                    this.contact = response.data;
                    this.contact.unread = false;
                    this.contact.lastMsg = null;
                    this.contact.lastMsgTime = new Date().getTime();
                    this.remark = response.data.remark;

                    //刷新联系人列表缓存
                    let contacts = this.$store.getters.getContacts;
                    for(let i=0; i<contacts.length; i++){
                        let ct = contacts[i];
                        if(ct.userId === this.contact.userId){
                            contacts.splice(i,1,this.contact);
                            break;
                        }
                    }

                    //刷新会话列表
                    let sessions = sessionStorage.getItem("sessions");
                    if(sessions){
                        sessions = JSON.parse(sessions);
                        let session = sessions[this.contact.userId];
                        if(session){
                            this.contact.unread = session.unread?true:false;
                            this.contact.lastMsg = session.lastMsg?session.lastMsg:null;
                            sessions[this.contact.userId]= this.contact;
                            sessionStorage.setItem("sessions",JSON.stringify(sessions));
                        }
                    }
                }else{
                    this.$notify(response.msg);
                }
                
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}
</script>

<style scoped>

.right .label{
    border-bottom: 1px solid #b2b2b2;
    line-height: 35px;
    text-align: center;
}

.right .label span{
    height: 35px;
}

.right .info{
    width: 80%;
    height: 50%;
    margin: 30px auto;
}

.avator{
    width: 60px;
    height: 60px;
    border-radius: 60px;
    position: relative;
    overflow: hidden;
    float: left;
} 

.info .avator img{
    width: 60px;
    height: 60px;
    border-radius: 60px;
}
.info .infoDetails{
    margin: 0 20px ;
    margin-left: 80px;
    
}

.info .infoDetails table td{
    padding: 5px 10px;
}


.info .infoDetails table td a{
    font-size: 10px;
    margin-left: 20px;
    text-decoration: underline;
}

.info .infoDetails table td a:hover{
    cursor: pointer;
}

.info .sendBtn{
    width: 100px;
    height: 40px;
    font-size: 14px;
    margin: 30px 0;
    border: 0;
    background-color: #333;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    margin-left: 80px;
}

.info .deleteBtn{
    width: 100px;
    height: 40px;
    font-size: 14px;
    margin: 30px 0;
    border: 0;
    background-color: red;
    color: white;
    border-radius: 5px;
    /* float: right; */
    cursor: pointer;
    margin-left: 50px;
}
</style>>