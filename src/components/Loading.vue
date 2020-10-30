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
import HttpApi from '@/util/http.js'
export default {
    name: 'Loading',
    created(){
       setTimeout(()=>{
           let user = {};
           HttpApi.post('/sys/v1/signIn', {
                username: this.$route.query.username,
                passwd: this.$route.query.passwd
            })
            .then(response => {
                if(response.code == 200){
                    const token = response.data;
                    let parts = token.split(".");
					if (parts.length == 2 && token.endsWith(".")) {
                        parts = [parts[0],parts[1],""];
					}
                    let payloadJson = atob(parts[1]);
                    payloadJson = JSON.parse(payloadJson);
                    //cache user info to vuex
                    user = {
                        id: payloadJson.userId,
                        username:payloadJson.username
                    }
                    this.$store.commit('setToken',token);
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
                        this.$user_db.add(user);
                        this.$store.commit('setUser',user);
                        return HttpApi.get('/contact/v1/list')
                    }else{
                        throw response.msg
                    }
                }
            }).then(response => {
                if(response){
                    if(response.code === 200){
                        const data = response.data;
                        this.$store.commit("setContacts",data);
                        return  this.$sessions_db.get();
                    }else{
                        throw response.msg
                    }
                }
            }).then(sessions => {
                this.$store.commit("setSessions",sessions);
                ipcRenderer.send("chat-win");
                this.$router.push({path:"/chat"});
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