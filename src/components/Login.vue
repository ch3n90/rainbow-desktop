<template>
    <div class="login">
        <div class="top">
            <div class="avatar">
                <img src="avatar.png"/>
            </div>

            <div>
                <span class="auth iconfont icon-yonghu"></span>
                <input class="username-input" type="text" v-model="username">
            </div>

            <div>
                <span class="auth iconfont icon-suo"></span>
                <input class="password-input" type="password" v-model="passwd">
            </div>
            <div>
                <router-link :to="{path:'/loading',query:{username:username,passwd:passwd}}" class="signIn-btn">登  入</router-link>
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

export default {
    name: 'Login',
    data:function(){
        return {
            username:'askch3ng',
            passwd:'ch3ng4rb1',
        }
    },
    mounted(){
          document.onkeyup = ()=> {
                let key = window.event.keyCode;
                if (key == 13) {
                    this.signIn();
                }
          }
    },

}
</script>

<style scoped>
.top,.bottom{
    width: 90%;
    margin: 0 auto;
    text-align: center;
}

.login div{
    position: relative;
}

.avatar img{
    width: 80px;
    height: 80px;
    border-radius: 80px;
    margin: 10%;
    moz-user-select: -moz-none;
    -moz-user-select: none;
    -o-user-select:none;
    -khtml-user-select:none;
    -webkit-user-select:none;
    -ms-user-select:none;
    user-select:none
}
.auth{
    position: absolute;
    font-size: 20px;
    top: 8px;
    left: 10px;
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