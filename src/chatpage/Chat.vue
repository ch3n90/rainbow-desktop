<template>
    <div class="container">
        <div class="main">
            <div class="left">
                <div>
                    <div @click.stop="loadChats" >
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
                        <img class="icon-avatar" :src="$store.getters.getUser.property.avatar" alt="" />
                    </div>
                </div>
            </div>
            <div class="medium">
                <div class="drag" ></div>
                <component :is="mediumComName" @func="rightCom"></component>
            </div>
            <div class="right">
                <div class="drag" >
                    <div class="opbar">
                        <div @click="close">
                        <span class="iconfont icon-guanbi1"></span>
                        </div>
                        <div @click="minimize">
                        <span class="iconfont icon-jianhao"></span>
                        </div>
                    </div>
                </div>
                <transition name="fade"
                            enter-active-class="fadeIn"
                            leave-active-class="fadeOut"
                            mode="out-in">
                    <component :is="rightComName"
                                style="animation-duration: .2s;"
                                @func="rightCom"
                                @func2="mediumCom"
                                :key='incrementKey'></component>
                </transition>
            </div>
        </div>

    </div>
</template>


<script>
import "../assets/fonts/iconfont.css"

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
const remote = require('electron').remote
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
            incrementKey:0,

        }
    },
    methods:{

        connection() {
            this.$ws.disConnection();
            this.$ws.connection(
                this.$store.getters.getUser,
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
        },
        close(){
            remote.getCurrentWindow().close();
        },
        minimize(){
          remote.getCurrentWindow().minimize();
        }
    },
    created(){
        this.$store.commit("setUser",remote.getGlobal('cache').user);
        this.$store.commit("setContacts",remote.getGlobal('cache').contacts);
        this.$store.commit("setSessions",remote.getGlobal('cache').sessions);

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
}
.opbar{
    right: 0;
    z-index: 999;
    position: absolute;
    top: 0;
}
.opbar div{
  -webkit-app-region: no-drag;
  float: right;
  width: 36px;
  height: 36px;
  font-size: 12px;
  text-align: center;
  cursor: pointer;
}

.opbar div span{
  font-size: 12px;
  color: black;
  line-height: 36px;

}

.opbar div:nth-child(odd):hover{
  background-color: #f45454;
}
.opbar div:nth-child(odd):hover span{
  color: #fff;
}
.opbar div:nth-child(even):hover{
  background-color: #e3e3e3;
}

.main{
    width: 100%;
    height: 100%;
    display: flex;
    border: 1px solid #333;
}
.left{
    background-color: #333;
    width: 60px;
    min-width: 60px;
    height: 100%;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    -webkit-app-region: drag;
    -webkit-user-select: none;
}
.medium{
    background-color: #2A2D2E;
    width: 220px;
    min-width: 220px;
    height: 100%;
    min-height: 100%;
    text-align: center;
}
.drag{
    width: 100%;
    height: 35px;
    -webkit-app-region: drag;
    -webkit-user-select: none;
    position: absolute;
}
.right{
    width: 100%;
    height: 100%;
    min-width: 600px;
    min-height: 100%;
    background-color: #f5f5f5;
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
    -webkit-app-region: no-drag;
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