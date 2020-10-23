<template>
    <div class="container">
        <div class="main">
            <div class="left">
                <div>
                    <div @click.stop="loadChats">
                        <span :class="['iconfont',duihua?'icon-duihuaxinxi':'icon-duihuaxinxitianchong']"></span>
                    </div>
                    <div @click.stop="loadContacts">
                        <span :class="['iconfont', yonghu?'icon-yonghu':'icon-yonghutianchong']" >
                            <span class="unread" v-show="$store.getters.getContactUnread"></span>
                        </span>
                    </div>
                </div>
                <div>
                    <div @click.stop="loadBangzhu">
                        <span :class="['iconfont', bangzhu?'icon-bangzhu':'icon-bangzhutianchong']">
                            
                        </span>
                    </div>
                    <div @click.stop="loadShezhi" >
                        <span :class="['iconfont', shezhi?'icon-shezhi':'icon-shezhitianchong']"></span>
                    </div>
                    <div>
                        <img class="icon-avatar" :src="userProperty.avatar" alt="" />
                    </div>
                </div>
            </div>
            <div class="medium">
                <component :is="mediumComName" @func="rightCom"></component>
            </div>
            <div class="right">
                <transition name="fade"
                            enter-active-class="fadeIn"
                            leave-active-class="fadeOut" 
                            mode="out-in">
                    <component :is="rightComName" 
                                style="animation-duration: .2s" 
                                @func="rightCom"
                                @func2="mediumCom"
                                :key='incrementKey'></component>
                </transition>
            </div>
        </div>
        
    </div>
</template>


<script>
import "@/assets/fonts/iconfont.css"

// import right
import AddContact from './right/AddContact'
import Flow from './right/Flow'
import Me from './right/Me'
import Contact from './right/Contact'
import NewContact from './right/NewContact'
import Security from './right/Security'

// import medium
import Sessions from './medium/Sessions'
import Contacts from './medium/Contacts'
import Settings from './medium/Settings'

import MessageHandler from '../util/messageHandler'

export default {
    name:"Chat",
    data(){
        return {
            duihua:false,
            yonghu:true,
            bangzhu:true,
            shezhi:true,
            mediumComName:"Sessions",
            rightComName: null,

            stompClient:null,
            timer:'',
            userProperty:null,

            incrementKey:0,

        }
    },
    methods:{
      
        connection() {
            this.$ws.disConnection();
            this.$ws.connection(
                this.$store.getters.getUser,
                this.$store.getters.getToken,
                body => {
                    MessageHandler[body['msgType']](body,this);
                },err =>{
                    setTimeout(() => {
                        console.log("re connection")
                        this.connection();
                        console.log(err);
                    },5000)
                    
                })
        }, 
        loadChats(){
            this.duihua = false;
            this.yonghu = this.bangzhu = this.shezhi = true; 
            this.mediumComName = Sessions;
            
        },
        loadContacts(){
            this.yonghu = false;
            this.duihua = this.bangzhu = this.shezhi = true;
            this.addContactStatus = true;
            this.mediumComName = Contacts;
        },
        loadBangzhu(){
            this.bangzhu = false;
            this.yonghu = this.duihua = this.shezhi = true; 
        },
        loadShezhi(){
            this.shezhi = false;
            this.yonghu = this.bangzhu = this.duihua = true; 
            this.mediumComName = Settings;
        },
        rightCom(rightCom){
            this.incrementKey+=1;
            //因为rightCom 值没变所以需要强制刷新界面
            this.rightComName = rightCom;
            
        },
        mediumCom(){
            this.loadChats();
        }
    },
    created(){

        //get user from session storage
        let userJson = sessionStorage.getItem("user");
        let userPropertyJson = sessionStorage.getItem("userProperty");
        let token = sessionStorage.getItem("token");
        if(!userJson || !userPropertyJson || !token){
            this.$ws.disConnection();
            sessionStorage.clear();
            this.$router.replace({path:"/"});
            return;
        }
        //get user from session storage
        this.$store.commit("setUser", JSON.parse(userJson));

        //get user property from session storage
        let userProperty = JSON.parse(userPropertyJson);
        this.$store.commit("setUserProperty",userProperty);

        //local storage
        this.$store.commit("setToken",token);
        
        this.userProperty = userProperty;
        this.connection();
    },
  
    beforeDestroy(){
        this.$ws.disConnection();
    },
    
    components:{
        //right
        Flow,
        AddContact,
        Settings,
        Me,
        Contact,
        NewContact,
        Security,
        
        //medium
        Sessions,
        Contacts
    },
   
}

</script>


<style scoped>

.container{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    /* box-sizing: content-box; */
   
}

.main{
    width: 80%;
    max-width: 1000px;
    min-width: 800px;
    height: 80%;
    display: flex;
    border: 1px solid #333;

}
.left{
    background-color: #333;
    width: 80px;
    height: 100%;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.medium{
    background-color: #2A2D2E;
    width: 280px;
    height: 100%;
    min-height: 100%;
    text-align: center;
}
.right{
    width: 100%;
    height: 100%;
    min-height: 100%;
    background-color: #F0F1F5;
    color: black;
    position: relative;
}

 .iconfont{
    color: white;
    font-size: 32px;
    line-height: 60px;
    position: relative;
}

.icon-avatar{
    width: 32px;
    height: 32px;
    border-radius: 32px;
    margin-top: 14px;
}

.left > div > div{
    width: 100%;
    height: 60px;
    border-left: 1px solid #333333;
    text-align: center;
}


.left > div > div:hover{
    border-left: 1px solid white;
    cursor: pointer;
}

.unread {
    background-color: red;
    width: 8px;
    height: 8px;
    border-radius: 8px;
    position: absolute;
    top: 0px;
    right: 0px;
}
</style>