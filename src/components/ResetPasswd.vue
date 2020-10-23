<template>
    <div class="container">
        <div class="login-text">reset</div> 
        <div class="chat-panel-text">Password</div>

       <div>
            <div class="username-text">邮箱</div>
            <input class="username-input email-input" type="text" v-model="email">
            <a @click.stop="sendEmail">发送验证码</a>
        </div>

         <div>
            <div class="username-text">验证码</div>
            <input class="username-input" type="text" v-model="code">
        </div>

        <div>
            <div class="username-text">账户</div>
            <input class="username-input" type="text" v-model="username">
        </div>

        <div>
            <div class="password-text">新密码</div>
            <input class="password-input" type="password" v-model="passwd">
        </div>
        <div class="f-s-text"><router-link class="authLink" to="/register">注册 </router-link>or<router-link class="authLink" to="/login"> 登入</router-link></div>
        <div class="signIn-div">
            <input type="button" value="重置" class="signIn-btn" @click.stop="reset"/>
        </div>
    </div>
</template>

<script>
import HttpApi from '@/util/http.js'
export default {
    name: 'ResetPasswd',
    data(){
        return {
            username:null,
            passwd:null,
            code:null,
            email:null
        } 
    },
    methods:{
        reset(){
            HttpApi.post('/sys/v1/reset/passwd', {
                username: this.username,
                passwd: this.passwd,
                code:this.code,
                email:this.email
            })
            .then(response => {
                if(response.code === 200){
                    this.$notify("密码重置成功");
                    this.$router.push({path:"/login"});
                }else{
                    this.$notify(response.msg);
                }
            })
            .catch(error=> {
                console.log(error);
            });
        },
        sendEmail(){
            HttpApi.put('/sys/v1/checkcode/reset/pwd', {
                username: this.username,
                email:this.email
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
    .container{
        min-width: 400px;
        width: 400px;
        height: 400px;
        min-height: 400px;
        display: block;
    }

    a{
        font-size: 12px;
        cursor: pointer;
    }
    a:hover{
        text-decoration: underline;
    }
    .login-text{
        position: absolute;
    }
    .chat-panel-text{
        font-size: 75px;
    }
    .username-text{
        margin-top: 16px;
    }
    .password-text{
        margin-top: 16px;
    }
    .username-input,.password-input{
        width: 100%;
        height: 32px;
        border: 0px;
        font-size: 20px;
        outline: none;
    }
    .f-s-text{
        float: right;
        margin-top: 16px;
    }

    .authLink {
        color: white;
        text-decoration: none;
    }
    .authLink:hover{
        text-decoration: underline;
    }
    .signIn-div{
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content:center;
    }

    .signIn-btn{
        margin-top: 20px;
        padding: 10px;
        width:130px;
        height: 50px;
        outline: none;
        background-color: #fff;
    }
</style>