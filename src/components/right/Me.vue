<template>
    <div>
        <div class="label">
            <span>个人信息</span>
        </div>
        <div class="info">
            <div class="avator">
                <span @click="modifiedAvatar">更换</span>
                <img :src="$store.getters.getUserPropery.avatar" alt="">
            </div>
            <div class="infoDetails">
                <table>
                    <tr>
                        <td>昵称</td>
                         <td v-if="flag" @click="edit">
                            {{$store.getters.getUserPropery.nickname}}
                        </td>
                        <td v-else><input class="in" type="text" v-model="$store.getters.getUserPropery.nickname" ></td>
                    </tr>

                    <tr>
                        <td>年龄</td>
                         <td v-if="flag" @click="edit">
                            {{$store.getters.getUserPropery.age}}
                        </td>
                        <td v-else><input class="in" type="text" v-model="$store.getters.getUserPropery.age" ></td>
                    </tr>
                    <tr>
                        <td>性别</td>
                         <td v-if="flag" @click="edit">
                            {{$store.getters.getUserPropery.gender | gender}}
                        </td>
                        <td v-else>
                            <select class="in" v-model="$store.getters.getUserPropery.gender" >
                                <option value="0">女</option>
                                <option value="1">男</option>
                                <option value="-1">保密</option>
                            </select>
                            </td>
                    </tr>

                     <tr>
                        <td>电话</td>
                         <td v-if="flag" @click="edit">
                            {{$store.getters.getUserPropery.phone}}
                        </td>
                        <td v-else><input class="in" type="text" v-model="$store.getters.getUserPropery.phone" ></td>
                    </tr>

                     <tr>
                        <td>邮箱</td>
                         <td v-if="flag" @click="edit">
                            {{$store.getters.getUserPropery.email}}
                        </td>
                        <td v-else><input class="in" type="text" v-model="$store.getters.getUserPropery.email" ></td>
                    </tr>


                     <tr>
                        <td>签名</td>
                         <td v-if="flag" @click="edit">
                            {{$store.getters.getUserPropery.signature}}
                        </td>
                        <td v-else><input class="in" type="text" v-model="$store.getters.getUserPropery.signature" ></td>
                    </tr>
                </table>
                <input v-if="!flag" class="modifiedBtn" type="button" value="修改" @click.stop="modified">
                <input v-if="!flag" class="cancelBtn" type="button" value="取消" @click.stop="cancel">

            </div>
        </div>
    </div>
</template>

<script>
import HttpApi from '../../util/http'
export default {
    name:"Me",
    data(){
        return{
            flag:true,
        }
    },
    filters:{
        gender(val){
            if(val == 1){
                return "男";
            }else if(val == 0){
                return "女";
            }else{
                return "保密";
            }
        }
    },
    methods:{
        edit(){
            this.flag = false;
        },
        modified(){
            this.flag = true;
            let property = this.$store.getters.getUserPropery
            HttpApi.post("/user/v1/property",{
                age:property.age,
                email:property.email,
                gender:property.gender,
                signature:property.signature,
                phone:property.phone,
                nickname:property.nickname,
            })
            .then(resp => {
               if(resp.code != 200){
                   this.$notify(resp.msg);
               }
            })
            .catch(err => {
                console.log(err)
            })
        },
        modifiedAvatar(){

            new Promise((resolve) => {
                let input = document.createElement('input');
                input.value = '选择文件';
                input.type = 'file';
                input.accept = 'image/png,image/gif,image/jpeg';
                input.onchange = event => {
                    let file = event.target.files[0];
                    resolve(file);
                };
                input.click();
            }).then(file => {
                let param = new FormData();
                param.append('file',file);
                //设置请求头
                let config = {
                    headers:{'Content-Type':'multipart/form-data'}
                }; 
                HttpApi.post('/user/v1/avatar',param,config)
                .then(response => {
                    if(response.code == 200){
                        let userProperty = this.$store.getters.getUserPropery;
                        //更新缓存
                        userProperty.avatar = response.data;
                        this.$store.commit("setUserProperty",userProperty);
                        //更新session
                        sessionStorage.setItem("userProperty",JSON.stringify(userProperty));
                    }
                })


            });

           
        },
        cancel(){
            this.flag = !this.flag;
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

.right .info{
    width: 80%;
    height: 50%;
    margin: 30px auto;
    display: flex;
    display: -webkit-flex;
}

.avator{
    /* background-color: lightgreen; */
    width: 60px;
    height: 60px;
    border-radius: 60px;
    position: relative;
    overflow: hidden;
} 

.avator span{
    display: block;
    position: absolute;
    color: skyblue;
    font-size: 12px;
    text-align: center;
    bottom: 0px;
    /* left: 20px; */
    width: 100%;
    background-color:rgba(51, 51, 51, .7);
    cursor: pointer;
}

.info .avator img{
    width: 60px;
    height: 60px;
    border-radius: 60px;
    border: 1px solid #b2b2b2;
}
.info .infoDetails{
    margin: 0 20px ;
}

.info .infoDetails table td{
    padding: 5px 10px;
    height: 26px;
}

.info .infoDetails .in{
    height: 26px;
    border: 0px;
    padding: 0 5px;
}

.info .infoDetails .modifiedBtn{
    width: 100px;
    height: 40px;
    font-size: 14px;
    margin: 30px 0;
    border: 0;
    background-color: #333;
    color: white;
    border-radius: 5px;
}


.info .infoDetails .cancelBtn{
    width: 100px;
    height: 40px;
    font-size: 14px;
    margin: 30px 0;
    border: 0;
    background-color: red;
    color: white;
    border-radius: 5px;
    float: right;
}
</style>>