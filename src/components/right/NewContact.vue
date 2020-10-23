<template>
    <div>
        <div class="label">
            <span>新的朋友</span>
        </div>

        <div class="result" v-for="(item,index) in msg" :key="item.id">
            <div>
                <img :src="item.content.sender.avatar" alt="">
                <div>{{item.content.sender.nickname}}</div>
            </div>
            <div v-if="item.content.status === 0">
                <i :class="['iconfont', reject?'icon-guanbi':'icon-cuowutishitianchong']" 
                    @click.stop.prevent="handle(index,2)"
                    @mouseover="mouseOver1"
                    @mouseleave="mouseLeave1"></i>
                &nbsp;
                <i :class="['iconfont',accpet?'icon-zhengquetishi':'icon-zhengquetishitianchong']"
                   @mouseover="mouseOver2"
                    @mouseleave="mouseLeave2"
                 @click.stop.prevent="handle(index,1)"></i>
            </div>
            <div v-if="item.content.status === 1">
                已同意
            </div>
            <div v-if="item.content.status === 2">
                已拒绝
            </div>
        </div>


    </div>
</template>

<script>
import HttpApi from '../../util/http'

export default {
    name: "NewContact",
    data(){
        return {
            msg:'',
            reject:true,
            accpet:true,
            flag:true,
        }
    },
    methods:{
        mouseOver1(){
            this.reject = !this.reject;
        },
         mouseLeave1(){
            this.reject = !this.reject;
        },
        mouseOver2(){
            this.accpet = !this.accpet;
        },
         mouseLeave2(){
            this.accpet = !this.accpet;
        },
        handle(index,h){
            let handleMsg = this.msg[index];
            HttpApi.post("/contact/v1/handle/request",
                {
                    sender:handleMsg.sender,
                    handle:h     
                }
            ).then(response => {
                if(response.code == 200){
                    handleMsg.content.status = h;
                    if(h === 1){
                        let contacts = this.$store.getters.getContacts;
                        let contact = {
                            avatar:handleMsg.content.sender.avatar,
                            createTime:handleMsg.date,
                            remark:handleMsg.content.sender.nickname,
                            userId:handleMsg.sender,
                            username:handleMsg.content.sender.username,
                        }
                        contacts.push(contact);
                    }
                }else{
                   this.$notify(response.msg);
                }
                
            }).catch(error => {
                console.log(error);
            })
        },
        
    },
    created(){
        HttpApi.get('/contact/v1/add/request/list')
            .then(response => {
                this.msg = response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
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

.right .result .icon-guanbi{
    font-size: 32px;
    color: red;
}


.right .result .icon-cuowutishitianchong{
    font-size: 32px;
    color: red;
}

.right .result .icon-zhengquetishi{
    font-size: 32px;
    color: #2C9984;
}


.right .result .icon-zhengquetishitianchong{
    font-size: 32px;
    color: #2C9984;
}



</style>
