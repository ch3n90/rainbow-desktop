<template>
    <div class="login" @click.stop="lost">
        <div class="top">
            <div class="avatar">
                <ul v-if="!avatar">
                    <li style="background-color:#E72339"></li>
                    <li style="background-color:#F39233"></li>
                    <li style="background-color:#FCFC98"></li>
                    <li style="background-color:#CFFD9B"></li>
                    <li style="background-color:#30E5FA"></li>
                    <li style="background-color:#4C5A9B"></li>
                    <li style="background-color:#C679A5"></li>
                </ul>
                <img v-else :src="avatar"/>
            </div>

            <div class="username-div">
                <span class="auth iconfont icon-yonghu"></span>
                <span :class="[statusOfMoreUser?'clickMoreUser moreUser iconfont icon-icon_sanjiaoxing':'moreUser iconfont icon-icon_sanjiaoxing']" @click.stop="moreUser"></span>
                <input class="username-input" type="text" spellcheck="false" v-model="username">
                    <transition  name="fade"
                    enter-active-class="fadeIn"
                    leave-active-class="fadeOut" mode="out-in">
                            <div v-show="statusOfMoreUser" class="otherUser">
                                <div class="items" v-for="(item,index) in users" :key="index" @click.stop="selectUser(index)">
                                    <div class="item">
                                       <div class="item-avatar">
                                            <img :src="item.property.avatar" alt="">
                                        </div>
                                       <div class="item-info">
                                           <span class="nickname">{{ item.property.nickname }}</span>
                                           <span class="username">{{ item.username }}</span>
                                        </div>
                                       <div class="item-close">
                                            <span class="iconfont icon-guanbi1" @click.stop="deleteUser(index)"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </transition>
            </div>

            <div class="password-div">
                <span class="auth iconfont icon-suo"></span>
                <input class="password-input" type="password" v-model="passwd">
            </div>

            <div class="remember">
                <input type="checkbox" id="inputId" v-model="rememberMe">
                <label for="inputId"></label>
                <span @click.stop="clickRememberMe">记住我</span>
            </div>
            <div>
                <input type="button" class="signIn-btn" value="登  入" @click="login">
            </div>
        </div>

        <div class="splite"></div>
        <div class="bottom">
                <router-link to="/reset" class="forget">
                    <ul>
                        <li>忘 记 密 码 ?</li>
                        <li>别担心，我们将会给你发送一个新的密码。</li>
                    </ul>
                    <span class="iconfont icon-youjiantou"></span>
                </router-link>
        </div>
         <p/>
        <div class="bottom">
            <router-link to="/register" class="register">
                <ul>
                    <li>没 有 账 号 ?</li>
                    <li>现在注册吧，欢迎加入。</li>
                </ul>
                <span class="iconfont icon-youjiantou"></span>
            </router-link>
        </div>
         <p/>
    </div>
</template>

<script>
const {queryUser,removeById} = require('../repsitory/users')

export default {
    name: 'Login',
    data:function(){
        return {
            avatar:null,
            username:null,
            passwd:null,
            rememberMe:false,
            statusOfMoreUser:false,
            users:[],
        }
    },
    methods:{
        login(){
            let user = {
                username: this.username,
                passwd:this.passwd,
                rememberMe:this.rememberMe,
            }
            this.$store.commit("setUser",user);
            this.$router.replace({path:"/loading"});
        },
        moreUser(){
            this.statusOfMoreUser = !this.statusOfMoreUser;
        },
        selectUser(index){
            this.statusOfMoreUser = false;
            let currentUser = this.users[index];
            this.avatar = currentUser.property.avatar;
            this.username = currentUser.username;
            this.passwd = currentUser.passwd;
        },
        deleteUser(index){
            let currentUser = this.users[index];
            if(currentUser.username === this.username){
                this.username = null;
                this.avatar = null;
                this.passwd = null;
                this.rememberMe = false;
            }
            removeById(currentUser.id);
            this.users.splice(index);
        },
        clickRememberMe(){
            this.rememberMe = !this.rememberMe;
        },
        lost(){
            this.statusOfMoreUser = false;
        }
    },
    created(){
        queryUser()
            .then(docs => {
                if(docs && docs.length > 0){
                    let currentUser = docs[0];
                    this.avatar = currentUser.property.avatar;
                    this.username = currentUser.username;
                    this.passwd = currentUser.passwd;
                    this.rememberMe = currentUser.rememberMe;
                }
                this.users = docs;
            });
    },
    mounted(){
        //   document.onkeyup = ()=> {
        //         let key = window.event.keyCode;
        //         if (key == 13) {
        //             this.signIn();
        //         }
        //   }
    },

}
</script>

<style scoped>
.top,.bottom{
    width: 90%;
    margin: 0 auto;
    text-align: center;
    position: relative;
}
.avatar ul{
    background-color: #333;
    width: 80px;
    height: 80px;
    border-radius: 80px;
    overflow: hidden;
    display: inline-block;
     margin: 10%;
}

.avatar ul li{
    width: 100%;
    height: 14.28%;
}


.avatar img{
    background-color: #fff;
    width: 80px;
    height: 80px;
    border-radius: 80px;
    margin: 10%;
    -moz-user-select: none;
    -o-user-select:none;
    -khtml-user-select:none;
    -webkit-user-select:none;
    -ms-user-select:none;
    user-select:none
}

.username-div,.password-div{
    position: relative;
}
.auth{
    position: absolute;
    font-size: 20px;
    top: 8px;
    left: 10px;
}

.moreUser{
    position: absolute;
    font-size: 20px;
    top: 8px;
    right: 10px;
}

.clickMoreUser{
    transform:rotate(180deg);
    -webkit-transform:rotate(180deg); /* Safari 和 Chrome */
}

.otherUser{
    background-color: #0f0f0f;
    width: 100%;
    min-height: 60px;
    max-height: 180px;
    position: absolute;
    top: 40px;
    z-index: 888;
    border-radius: 3px;
    animation-duration: 0.5s;
    padding: 10px 0;
    overflow-y:scroll;
}

.otherUser::-webkit-scrollbar-track
{
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
	background-color: #000;
}

.otherUser::-webkit-scrollbar
{
	width: 6px;
	background-color: #000;
}

.otherUser::-webkit-scrollbar-thumb
{
	background-color: #fff;
}

.username-input,.password-input{
    width: 100%;
    height: 36px;
    border: 0px;
    font-size: 20px;
    margin-bottom: 20px;
    border-radius: 3px;
    padding-left: 35px;
    background-color: #0f0f0f;
    color: #888;
}

.items:hover{
    background-color: #888;
}

.items:hover .item .item-close{
    visibility: visible;
}

.item{
    width: 90%;
    height: 60px;
    margin: 0 auto;
}

.item .item-avatar{
    width: 25%;
    height: 100%;
    float: left;
}

.item .item-avatar img{
    display: block;
    width: 50px;
    height: 50px;
    border-radius: 50px;
    margin: 5px auto;
}

.item .item-info{
    width: 65%;
    height: 100%;
    float: left;
    text-align: left;
    font-size: 14px;
}

.item .item-info .nickname{
    display: inline-block;
    width: 100%;
    height: 50%;
    line-height: 40px;
}

.item .item-info .username{
    display: inline-block;
    width: 100%;
    height: 50%;
}

.item .item-close{
    width: 10%;
    height: 60px;
    float: left;
    font-size: 14px;
    text-align: center;
    line-height: 60px;
    visibility: hidden;
}

.remember{
    text-align: left;
    height: 20px;
    margin: -10px 0 10px 0;
    display: flex;
}

.remember input{
    display: none;
}
label {
    width: 12px;
    height: 12px;
    border-radius: 1px;
    border: 1px solid #888;
    position: relative;
    cursor: pointer;
    margin-top: 4px;
}
label::before {
    content: " ";
    width: 6px;
    border: 2px solid #fff;
    height: 2px;
    border-top: none;
    border-right: none;
    transform: rotate(-45deg);
    top: 2px;
    left: 1px;
    position: absolute;
    opacity: 0;
}
.remember input:checked+label {
      background: #888;
  }
.remember input:checked+label::before{
    opacity: 1;
    transform: all 0.5s;
}

.remember span{
    margin-left: 10px;
    font-size: 12px;
    color: #888;
    cursor: pointer;
}
.signIn-btn{
    display: inline-block;
    margin: 10px 0 30px 0;
    width: 100%;
    border: 0px;
    border-radius: 3px;
    height: 36px;
    font-size: 16px;
    line-height: 36px;
    background-color: #9d170a;
    color: #fff;
    cursor: pointer;
    text-decoration: none;
}

.splite{
    width: 100%;
    height: 10px;
    background-color: #1a1a1c;
}

p{
    width: 100%;
    height: 2px;
    background-color: #1a1a1c;
}

.forget, .register{
    width: 100%;
    height: 60px;
    font-size: 12px;
    text-decoration: none;
    color: #fff;
}

.forget span,.register span{
    position: absolute;
    right: 0px;
    top: 20px;
}

ul li{
   list-style: none;
   text-align: left;
   height: 30px;
   line-height: 30px;
}

ul li:nth-child(even){
    color: #888;
}
</style>