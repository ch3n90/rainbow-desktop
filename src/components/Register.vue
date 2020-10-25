<template>
    <div class="register">
        <div class="top">
            <div>
                <input type="text" placeholder="邮箱" v-model="email">
                <a @click.stop="sendEmail">发送验证码</a>
            </div>

            <div>
                <input type="text" placeholder="验证码" v-model="code">
            </div>

            <div>
                <input type="text" placeholder="账号" v-model="username">
            </div>

            <div>
                <input type="password" placeholder="密码" v-model="passwd">
            </div>

            <div>
                <input type="text" placeholder="昵称" v-model="nickname">
            </div>

            <div>
                <input type="button" value="注  册" class="register-btn" @click.stop="signUp"/>
            </div>

        </div>


        <div class="splite"></div>
        <div class="bottom">
                <router-link to="/login" class="login">
                    <ul>
                        <li>现 在 登 入 ！</li>
                        <li>已经有账号了。</li>
                    </ul>
                    <span class="iconfont icon-youjiantou"></span>
                </router-link>
        </div>
         <p/>
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

    </div>
</template>

<script>
import HttpApi from '@/util/http.js'

export default {
    name: 'Regisger',
    data(){
        return {
            username:null,
            passwd:null,
            nickname:null,
            code:null,
            email:null
        }
    },
    methods:{
        signUp(){

            HttpApi.put('/sys/v1/signUp', {
                username: this.username,
                passwd: this.passwd,
                nickname: this.nickname,
                code:this.code,
                email:this.email
            })
            .then(response => {
                if(response.code === 200){
                    this.$notify("注册成功");
                    this.$router.push({path:"/login"})
                }else{
                     this.$notify(response.msg);
                }
            })
            .catch(function (error) {
                this.$notify(error);
            });
        },
        sendEmail(){
            HttpApi.put('/sys/v1/checkcode/sign/up', {
                email: this.email
            })
            .then(response => {
                if(response.code === 200){
                    this.$notify("验证码已发送");
                }else{
                     this.$notify(response.msg);
                }
            })
            .catch(error=> {
                console.log(error);
            });
        }
    }

}
</script>

<style scoped>
.top,.bottom{
    width: 90%;
    margin: 0 auto;
    /* text-align: center; */
}

.register div{
    position: relative;
}
input{
    width: 100%;
    height: 36px;
    border: 0px;
    font-size: 14px;
    background-color: #0f0f0f;
    border-radius: 3px;
    padding-left: 5px;
    color: #888;
}

.top div{
    margin-top: 10px;
}

a{
    font-size: 12px;
    cursor: pointer;
}

.register-btn{
    /* margin: 10px 0 30px 0; */
    width: 100%;
    border: 0px;
    border-radius: 3px;
    height: 40px;
    background-color: #9d170a;
    color: #fff;
    margin: 10px 0 30px 0;
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

.forget, .login{
    width: 100%;
    height: 60px;
    font-size: 12px;
    text-decoration: none;
    color: #fff;
}

.forget span,.login span{
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