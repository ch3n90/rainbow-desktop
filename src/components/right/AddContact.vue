<template>
    <div>
        <div class="label">
            <span>添加朋友</span>
        </div>

        <div class="search">
            <input type="text" placeholder="账号/邮箱" 
            @keydown.enter="search2"
            @keyup.enter="search"
            v-model="content">
            <br>
            <br>
            <span>我的账号：{{$store.getters.getUser.username}}</span>
        </div>

        <div class="result" v-show="flag">
            <div>
                    <img :src="user.avatar" alt="">
                    <div>{{user.nickname}}</div>
            </div>
            <i class="iconfont icon-tianjia" @click.stop.prevent="addContact"></i>
        </div>


    </div>
</template>

<script>
import HttpApi from '../../util/http'

export default {
    name: "AddContact",
    data(){
        return {
            flag: false,
            content:null,
            user:'',
        }
    },
    methods:{
        search(){
            if(!this.content){
                return
            }
            HttpApi.get('/user/v1/search/'+this.content)
            .then(response => {
                let user = response.data;
                if(user){
                    this.user = user;
                    this.flag = true;
                }else{
                    this.flag = false;
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        },
        search2(event){
            event.preventDefault();
        },
        addContact(){
            let searchUser = this.user;
            let userProperty = this.$store.getters.getUserPropery;
            let user = this.$store.getters.getUser;
            let senderContactBrief = {
                avatar:userProperty.avatar,
                nickname: userProperty.nickname,
                username: user.username,
            };

            let receiverContactBrief = {
                avatar:searchUser.avatar,
                nickname: searchUser.nickname,
                username: searchUser.username,
            };

            let addContactContent = {
                sender:senderContactBrief,
                receiver:receiverContactBrief,
                note:"..."
            };

            let message = {
                msgType:10,
                content: addContactContent ,
                receiver: searchUser.userId,
                status:0,
                date:new Date().getTime()
            };
            HttpApi.put("/contact/v1/add/request",message)
            .then(response => {
                if(response.code == 200){
                    if(response.data){
                        this.$store.getters.getContacts.push(response.data)
                    }else{
                        this.$notify("验证消息已发送");
                    }
                    
                }else{
                    this.$notify(response.msg);
                }
            }).catch(error => {
                console.log(error)
            })
        }
        
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

.right .search{
    width: 100%;
    margin-top: 20px;
    text-align: center;
}

.right .search input{
    width: 90%;
    border: 0;
    height: 30px;
    border-radius: 5px;
    text-align: center;
}

.right .result {
    display: flex;
    display: -webkit-flex;
    padding: 10px 20px;
    /* height: 60px; */
    background-color: white;
    margin-top: 10px;
    align-items: center;
    justify-content: space-between;
    
}

.right .result img{
    width: 40px;
    height: 40px;
    border-radius: 35px;
}

.right .result div > div{
    height: 100%;
    margin-left: 10px; 
    margin-top: 8px;
    float: right;
}

.right .result .iconfont{
    font-size: 28px;
    color: #333;
}

.right .result .iconfont:hover{
    cursor: pointer;
    color: #2C9984;
}



</style>
