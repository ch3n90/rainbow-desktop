<template>
    <div class="reset">
        <div class="top">
            <div>
                <input placeholder="邮箱" type="text" v-model="email">
                <a @click.stop="sendEmail">发送验证码</a>
            </div>

            <div>
                <div class="username-text"></div>
                <input placeholder="验证码" type="text" v-model="code">
            </div>

            <div>
                <input placeholder="账户" type="text" v-model="username">
            </div>

            <div>
                <input placeholder="新密码" type="password" v-model="passwd">
            </div>
            <div>
                <input type="button" value="重  置" class="reset-btn" @click.stop="reset"/>
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
.top,.bottom{
    width: 90%;
    margin: 0 auto;
    /* text-align: center; */
}

.reset div{
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

.reset-btn{
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

.register, .login{
    width: 100%;
    height: 60px;
    font-size: 12px;
    text-decoration: none;
    color: #fff;
}

.register span,.login span{
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