<template>
    <div class="loading3">
    <div class="circle circle1">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
    </div>
    <div class="circle circle2">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
    </div>
    <div class="circle circle3">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
    </div>
 </div>
</template>

<script>
const {ipcRenderer, session} = require('electron')
const remote = require('electron').remote
import HttpApi from '@/util/http.js'

// const md5 = require('md5');
const {insertUser,removeById} = require('../repsitory/users')
const {querySessions} = require('../repsitory/sessions')
export default {
    name: 'Loading',
    created(){
       setTimeout(()=>{
           let user = this.$store.getters.getUser;
           HttpApi.post('/sys/v1/signIn', {
                username: user.username,
                passwd: user.passwd,
            })
            .then(response => {
                if(response.code == 200){
                    const token = response.data;
                    //cache global token 
                    remote.getGlobal('cache').token = token;
                    let parts = token.split(".");
					if (parts.length == 2 && token.endsWith(".")) {
                        parts = [parts[0],parts[1],""];
					}
                    let payloadJson = atob(parts[1]);
                    payloadJson = JSON.parse(payloadJson);
                    //cache user info to vuex
                    user.id = payloadJson.userId
                    //get user property
                    return HttpApi.get('/user/v1/property');
                }else{
                    this.$router.replace({path:"/login"});
                    throw response.msg;                       
                }
            })
            .then(response => {
                if(response){
                    if(response.code == 200){
                        user.property = response.data;
                        user.lastLoginTime = new Date().getTime();
                        //cache global user;
                        remote.getGlobal('cache').user = user;
                        if(user.rememberMe){
                            insertUser(user);
                        }else{
                            removeById(user.id);
                        }
                        return HttpApi.get('/contact/v1/list')
                    }else{
                        throw response.msg
                    }
                }
            }).then(response => {
                if(response){
                    if(response.code === 200){
                        let cotnacts = response.data;
                        
                         //cache global contacts;
                        remote.getGlobal('cache').contacts = cotnacts;
                        return querySessions(user.id);
                    }else{
                        throw response.msg
                    }
                }
            }).then(sessions => {
                //cache global sessions;
                remote.getGlobal('cache').sessions = sessions;
                ipcRenderer.send("chat-win");
            })
            .catch(function (error) {
                let myNotification = new Notification('失败',{
                    body: error,
                    silent: true,
                });
            });
       },500)
   }
}
</script>

<style scoped>
.loading3{
    width:30px;
    height:30px;
    margin:50% auto;
    position:relative;
}
.circle{
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;
}
.circle span{
    width:8px;
    height:8px;
    display:inline-block;
    background:#9d170a;
    border-radius: 100%;
    position:absolute;
    -webkit-animation: mycircle 1.2s infinite ease-in-out;
    animation: mycircle 1.2s infinite ease-in-out;
    -webkit-animation-fill-mode:both;
    animation-fill-mode:both;
}
.circle2{
    -webkit-transform: rotateZ(45deg);
    transform: rotateZ(45deg);
}
.circle3{
    -webkit-transform: rotateZ(90deg);
    transform: rotateZ(90deg);
}
.circle>span:nth-child(1){
    top:0;
    left:0;
}
.circle>span:nth-child(2){
    top:0;
    right:0;
}
.circle>span:nth-child(3){
    right:0;
    bottom:0;
}
.circle>span:nth-child(4){
    left:0;
    bottom:0;
}
.circle2 >span:nth-child(1){
    -webkit-animation-delay: -1.1s;
    animation-delay: -1.1s;
}
.circle3 >span:nth-child(1){
    -webkit-animation-delay: -1.0s;
    animation-delay: -1.0s;
}
.circle1 >span:nth-child(2){
    -webkit-animation-delay: -0.9s;
    animation-delay: -0.9s;
}
.circle2 >span:nth-child(2){
    -webkit-animation-delay: -0.8s;
    animation-delay: -0.8s;
}
.circle3 >span:nth-child(2){
    -webkit-animation-delay: -0.7s;
    animation-delay: -0.7s;
}
.circle1 >span:nth-child(3){
    -webkit-animation-delay: -0.6s;
    animation-delay: -0.6s;
}
.circle2 >span:nth-child(3){
    -webkit-animation-delay: -0.7s;
    animation-delay: -0.7s;
}
.circle3 >span:nth-child(3){
    -webkit-animation-delay: -0.4s;
    animation-delay: -0.4s;
}
.circle1 >span:nth-child(4){
    -webkit-animation-delay: -0.3s;
    animation-delay: -0.3s;
}
.circle2 >span:nth-child(4){
    -webkit-animation-delay: -0.2s;
    animation-delay: -0.2s;
}
.circle3 >span:nth-child(4){
    -webkit-animation-delay: -0.1s;
    animation-delay: -0.1s;
}
@-webkit-keyframes mycircle{
    0%{transform:scale(0.0);}
    40%{transform:scale(1.0);}
    80%{transform:scale(0.0);}
    100%{transform:scale(0.0);}
}
@keyframes mycircle{
    0%{transform:scale(0.0);}
    40%{transform:scale(1.0);}
    80%{transform:scale(0.0);}
    100%{transform:scale(0.0);}
}
</style>