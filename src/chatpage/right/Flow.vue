<template>
    <div>
        <div class="label">
            <span>{{receiver.remark}}</span>
        </div>
        <div class="content" ref="msgWarp" @click="cancelEmojiPicker">
             <div :class="item.sender === receiver.userId?'you':'me'" v-for="(item,index) in $store.getters.getSession" :key="index">
                <div class="bubble" v-if="item.sender == receiver.userId">
                    <img class="avatar" v-bind:src="receiver.avatar" alt="">
                        <div>
                            <span>{{item.date | format}}</span>
                            <div class='text' v-if="item.msgType == 1">
                                {{item.content.txt}}
                            </div>
                            <div class="img" v-else-if="item.msgType == 2">
                                <img :src="item.content.uri"
                                :width="item.content.width | imgW"
                                :height="item.content.height | imgH(item.content.width)"/>
                            </div>
                        </div>
                </div>
                <div class="bubble" v-else>
                    <div>
                        <span>{{item.date | format}}</span>
                        <div class="text" v-if="item.msgType == 1">
                            {{item.content.txt}}
                        </div>
                        <div v-else-if="item.msgType == 2">
                            <img class="img" :src="item.content.uri"
                            :width="item.content.width | imgW"
                            :height="item.content.height | imgH(item.content.width)"/>
                        </div>
                    </div>
                    <img class="avatar" :src="$store.getters.getUser.property.avatar" alt="">
                </div>
            </div>

        </div>
        <div class="typing" >
            <Picker set="emojione" v-if='emojiDisplay'
             @select="addEmoji"
             :title="title" emoji="point_up"
             :style="{ position: 'absolute', bottom: '120px', left: '0px' }"
             :i18n="i18n"
             :native="true"
             :sheetSize="20"
             :include="include"/>
             <div class="toolbar">
                 <span type="button" class="iconfont icon-biaoqing-xue" @click="showEmojiPicker"/>
                 <span type="button" class="iconfont icon-wenjian1"  @click="sendPic"/>
             </div>

            <textarea ref="inputMsg" autofocus='autofocus' spellcheck='false' v-model="msg" @keydown.enter="send2" @keyup.enter="send"></textarea>
        </div>
    </div>
</template>

<script>
import HttpApi  from '../../util/http'
import { Picker } from 'emoji-mart-vue'
const {queryChats,insertChat} = require('../../repsitory/chats')
const {updateLastMsgTimeAndLastMsgContentById} = require('../../repsitory/sessions')
export default {
    name:"Flow",
    data(){
        return {
            msg : '',
            // user: null,
            receiver:null,
            pageNum:1,
            typing:null,
            // flow:this.$store.getters.getSession,
            emojiDisplay:false,
            include:['people','nature','foods','symbols'],
            i18n:{ search: '搜索',
                    notfound: '没找到emoji',
                    categories: {
                    search: '搜索结果',
                    recent: '常用',
                    people: '笑脸',
                    nature: '自然',
                    foods: '食物',
                    activity: '活动',
                    places: '地点',
                    objects: '对象',
                    symbols: '符号',
                    flags: '旗子',
                    // custom: 'Custom',
                    } },
            title:"选择emoji"
        }
    },
    components:{
        Picker
    },
    watch:{
      '$store.getters.getSession':function(){
          this.$nextTick(function(){
            this.$refs.msgWarp.scrollTo(0,this.$refs.msgWarp.scrollHeight);
          });
       }
    },
    methods:{
        cancelEmojiPicker(){
            this.emojiDisplay = false;
        },
        sendPic(){
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
                param.append('receiver',this.receiver.userId);

                //设置请求头
                let config = {
                    headers:{'Content-Type':'multipart/form-data'}
                };
                HttpApi.put('/message/v1/pic/sending',param,config)
                .then(resp => {
                    if(resp.code == 200){
                        let msgResp = resp.data;
                        this.$store.commit('addMessage',msgResp);
                        insertChat(msgResp);
                        let sessions = this.$store.getters.getSessions;
                        sessions.some((session,index,array) => {
                            if(session.userId === msgResp['receiver']){
                                session.lastMsgTime = msgResp.date;
                                session.lastMsg = "[图片]";
                                this.$set(sessions,index, session);
                                return true;
                            }
                        });
                    }
                })
            });
        },
        showEmojiPicker(){
          this.emojiDisplay = !this.emojiDisplay;
        },
        addEmoji(emoji){
            this.msg = this.msg + emoji.native;
            this.emojiDisplay = false;
            this.$refs.inputMsg.focus();
        },
        send2(event){
            event.preventDefault();

        },
        send(){
            if(!this.msg){
                return;
            }
            let message = {
                msgType:1,
                content: {
                    txt: this.msg
                },
                receiver:this.receiver.userId,
            };
            HttpApi.put("/message/v1/sending",message)
            .then(resp => {
                if(resp.code == 200){
                    let msgResp = resp.data;
                    this.$store.commit('addMessage',msgResp);
                    ////////////////////////////////////////////////
                    let sessions = this.$store.getters.getSessions;
                    sessions.some((session,index,array) => {
                        if(session.userId === msgResp['receiver']){
                            session.lastMsgTime = msgResp.date;
                            session.lastMsg = msgResp.content.txt;
                            this.$set(sessions,index, session);
                            return true;
                        }
                    });
                    sessions.sort((a,b) => {
                        return b.lastMsgTime - a.lastMsgTime;
                    })
                    this.$store.commit("setSessions",sessions);
                    ////////////////////////////////////////////////
                    insertChat(msgResp);
                    updateLastMsgTimeAndLastMsgContentById(msgResp.date,msgResp.content.txt,false,msgResp.receiver);
                }else{
                    throw resp.msg;
                }

            }).catch(err => {
                let myNotification = new Notification('失败',{
                    body: err,
                    silent: true,
                });
            })
            this.msg = '';

        },
        loadMessage(){
            //聊天消息应该加载双方且进行排序
            queryChats(this.$store.getters.getReceiver.userId,this.pageNum, docs => {
                this.$store.commit("setSession",docs);
            });
        },

    },
    created(){
        this.receiver = this.$store.getters.getReceiver;
        this.loadMessage();
    },
    mounted(){
        this.$refs.msgWarp.scrollTo(0,this.$refs.msgWarp.scrollHeight);
        this.$refs.inputMsg.focus();
    },
    filters:{
        imgW:function(width){
            //计算图片宽
            if(width >= 2000){
                return width / 7;
            }else if(width >=1500 && width < 2000){
                return width / 6;
            }else if(width >=1000 && width < 1500){
                return width / 5;
            }else if(width >= 500 && width < 1000){
                return width / 4;
            }else if(width >= 200 && width < 500){
                return width / 3;
            }else{
                return width / 2;
            }
        },
        imgH:function(height,width){
            //计算图片高
            if(width >= 2000){
                return height / 7;
            }else if(width >= 1500 && width < 2000){
                return height / 6;
            }else if(width >= 1000 && width < 1500){
                return height / 5;
            }else if(width >= 500 && width < 1000){
                return height / 4;
            }else if(width >= 200 && width < 500){
                return height / 3;
            }else{
                return height / 2;
            }
        },
        format:function(time){
            time = new Date(time);
            let fmt = '';
            if(time.getDate() === new Date().getDate()){
                fmt = "HH:mm";
            }else if(time.getFullYear() === new Date().getFullYear()){
                fmt = "MM-dd HH:mm";
            }else{
                fmt = "yyyy-MM-dd HH:mm";
            }
            var o = {
                        "M+": time.getMonth() + 1, // 月份
                        "d+": time.getDate(), // 日
                        "H+": time.getHours(), // 小时
                        "m+": time.getMinutes(), // 分
                        "s+": time.getSeconds(), // 秒
                        "q+": Math.floor((time.getMonth() + 3) / 3), // 季度
                        "S": time.getMilliseconds() // 毫秒
                    };
            if (/(y+)/.test(fmt))
                fmt = fmt.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }
    }

}
</script>

<style scoped>
.right > div{
    height: 100%;
    position: relative;
    overflow: hidden;
}

.right .label{
    height: 35px;
    width: 100%;
    border-bottom: 1px solid #e7e7e7;
    line-height: 35px;
    text-align: center;
    position: absolute;
}

.right .label span{
    height: 35px;
}

.right .content{
    position: absolute;
    background-color: #fff;
    top: 35px;
    bottom: 120px;
    width: 100%;
    overflow-y:scroll;
}

.content > div{
    padding: 5px 10px;
}

.content .me .bubble{
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
}

.content .me > .bubble > div{
    padding: 0 5px;
    width: 100%;
}

.content .me > .bubble > div .text{
    max-width: 60%;
    min-width: 80px;
    width: fit-content;
    margin: 5px 5px 0 0;
    font-size: 14px;
    word-wrap:break-word;
    word-break:break-all;
    border-radius: 20px 0 20px 20px;
    background-color: #F1F1F4;
    padding: 5px 10px;
    float: right;
}

.content .me > .bubble > div .img{
    max-width: 60%;
    min-width: 80px;
    margin: 5px 5px 0 0;
    float: right;
}



.content .me > .bubble div > span{
    text-align: right;
    display: block;
    font-size: 10px;
    color:#b2b2b2;
    padding: 0 2px;
    border-radius: 3px;
}

/*  ********************************** */
.content .you .bubble{
    width: 100%;
    padding: 5px 0;
    display: flex;
    justify-content: flex-start;
}
.content .you > .bubble div{
    padding: 0 5px;
    width: 100%;
}
.content .you > .bubble > div .text{
    max-width: 60%;
    width: fit-content;
    min-width: 80px;
    font-size: 14px;
    word-wrap:break-word;
    word-break:break-all;
    border-radius: 0 20px 20px 20px;
     background: linear-gradient(70deg, #EB704A, #EEB601);
    padding: 5px 10px;
    color: white;
}

.content .you > .bubble > div .img{
    max-width: 60%;
    min-width: 80px;
    margin: 5px 5px 0 0;
}


.content .you > .bubble div > span{
    display: inline;
    font-size: 10px;
    color:#b2b2b2;
    padding: 0 2px;
    border-radius: 3px;
}


.content .avatar{
    width: 35px;
    height: 35px;
    border-radius: 35px;
    margin-top: 5px;
}

textarea::-webkit-scrollbar-track,.content::-webkit-scrollbar-track
{
	background-color: #f5f5f5;
}

textarea::-webkit-scrollbar,.content::-webkit-scrollbar
{
	width: 8px;
	background-color: #f5f5f5;
}

textarea::-webkit-scrollbar-thumb,.content::-webkit-scrollbar-thumb
{
	background-color: #d2d2d2;
    border-radius: 8px;
}

.typing{
    height: 120px;
    max-height:  120px;;
    min-height: 120px;
    width: 100%;
    position: absolute;
    bottom: 0;
}

.typing .toolbar {
    border-top: 1px solid #e7e7e7;
    width: 100%;
    height: 30px;
    background-color: #fff;
}

.typing .toolbar span{
    line-height: 30px;
    width: 30px;
    margin-left: 15px;
    font-size: 25px;
    line-height: 30px;
    color: #666;
}

.typing .toolbar span:hover{
    cursor: pointer;
}


.typing textarea{
    height: 90px;
    max-height:  90px;;
    min-height: 90px;
    width: 100%;
    font-size: 10px;
    resize: none;
    border: 0;
    resize: none;
    padding: 5px;
    font-size: 12px;
    outline: none;
    
}


</style>