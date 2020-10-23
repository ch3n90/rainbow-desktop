<template>
    <div>
        <div class="label">
            <span>通讯录</span>
            <div>
                <span class="iconfont icon-tianjiayonghu" @click.stop="loadAddContactCom"></span>
            </div>
        </div>
        <div class="search">
            <input type="text" @keyup.enter="search" v-model="searchContent">
        </div>
        <div class="list">
              <div class="newContact" @click.stop.prevent="newContact">
                <div>
                    <div class="contactAvator iconfont icon-icon-test1 ">
                        <div class="unread" v-show="$store.getters.getContactUnread"></div>
                    </div>
                    <div class="contactInfo">
                        <div class="contactName">
                            <span>新的朋友</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="group">
                <div>
                    <div class="contactAvator iconfont icon-icon-test ">
                    </div>
                    <div class="contactInfo">
                        <div class="contactName">
                            <span>群聊</span>
                        </div>
                    </div>
                </div>
            </div>
            <div v-for="(item, index) in contacts" :key="item.name" @click.stop="loadContactCom(index)">
                <div>
                    <div class="contactAvator">
                        <img :src="item.avatar">
                    </div>
                    <div class="contactInfo">
                        <div class="contactName">
                            <span>{{item.remark | c}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import HttpApi from '../../util/http.js'
export default {
    
    name:"Contacts",
     data(){
        return {
            contacts:null,
            searchContent:null,
        }
    },
    filters:{
        c:function(content){
            if(content){
                return content.length >= 6 ? content.substr(0,6) + "..." : content;
            }else{
                return "-";
            }
           
        }
    },
    methods:{
         loadAddContactCom(){
            this.$emit('func',"AddContact");
        },

        loadContactCom(index){
            this.$store.commit("setContact",this.contacts[index])
            this.$emit("func","Contact"); 
        },

        newContact(){
            this.$emit("func","NewContact"); 
            this.$store.commit("setContactUnread",false);
        },
        search(){
            if(!this.searchContent){
                this.contacts = this.$store.getters.getContacts;
                return;
            }
            let contacts = this.$store.getters.getContacts;
            let result = [];
            contacts.forEach(element => {
                let reg = new RegExp(this.searchContent.trim());
                if(element.remark.match(reg)){
                    result.push(element);
                }
            });
            this.contacts = result;
        }
    },
    created(){
        HttpApi.get('/contact/v1/list')
            .then(response => {
                if(response.code === 200){
                    const data = response.data;
                    this.contacts = data;
                    this.$store.commit("setContacts",data);
                }else{
                    this.$notify(response.msg);
                }
               
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}
</script>

<style scoped>
.medium .label{
    width: 100%;
    height: 5%;
    min-height: 35px;
    text-align: center;
    line-height: 35px;
    box-shadow: 0px 10px 10px -5px #1d1d1d ;
    position: relative;
}

.medium .label div{
    height: 100%;
    float: right;
    line-height: 35px;
    position: absolute;
    right: 10px;
    top: 0px;
    cursor: pointer;
}

.medium .label div span{
    font-size: 20px;
}

.medium .search{
    height: 10%;
    min-height: 70px;

}

.medium .search input{
    margin-top: 10%;
    width: 85%;
    height: 30px;
    background-color: #333;
    border: 0;
    border-radius: 5px;
    padding-left: 10px;
    color: white;

}

.list{
  width: 100%;
  height: 87%;
  overflow-y:auto;
  border: 0px;
}

.list > div{
    background-color: #444;
    width: 100%;
    height: 45px;
    margin-top: 4px;
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    justify-content: center;
    cursor: pointer;
}

.list > div > div{
    width: 85%;
    height: 100%;
    display: flex;
    display: -webkit-flex;
    justify-content: flex-start;
    flex-direction: row;
    align-items: center;
}

.contactAvator{
    width: 35px;
    height: 35px;
}

.contactAvator > img{
    width: 35px;
    height: 35px;
    border-radius: 35px;
}

.contactInfo{
    margin-left: 10%;
    height: 45px;
    width: 60%;
    font-size: 13px;
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    flex-direction: column;
    align-items: flex-start;
}
.group{
    margin-bottom: 20px;
}

.group .iconfont,.newContact .iconfont {
    font-size: 35px;
    color: #2C9984;
    position: relative;
}

.unread {
    background-color: red;
    width: 8px;
    height: 8px;
    border-radius: 8px;
    position: absolute;
    top: 0px;
    right: 0px;
}
</style>>