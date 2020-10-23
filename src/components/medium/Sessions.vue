<template>
    <div>
        <div class="label">
            <span>聊天</span>
        </div>
        <div class="blank">
        </div>
        <div class="list">
            <div v-for="(item,index) in $store.getters.getSessions" :key="item.userId">
                <div @click.stop="loadFlowCom(index)">
                    <div class="contactAvator">
                        <img :src="item.avatar">
                        <div class="unread" v-if="item.unread"></div>
                    </div>
                    <div class="contactInfo">
                        <div class="contactName">
                            <span>{{item.remark | c}}</span>
                        </div>
                        <div class="lastMsg">
                            <span>{{item.lastMsg | c}}</span>
                        </div>
                    </div>
                    <div class="contactTime">
                        <span>{{item.lastMsgTime | format}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
export default {
    name:"Sessions",
    data(){
        return {
            // sessions:[],
        }
    },
    methods:{
        loadFlowCom(index){
            let receiver = this.$store.getters.getSessions[index];
            receiver.unread = false;
            this.$store.commit("setReceiver",receiver);
            this.$emit("func","Flow"); 
        }
    },
    filters:{
        c:function(content){
            if(content){
                return content.length >= 6 ? content.substr(0,6) + "..." : content;
            }
           
        },
        format:function(time){
            if(!time){
                return "--:--";
            }
            time = new Date(time);
            let fmt = "HH:mm";
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
    },
    created(){
        let sessions = sessionStorage.getItem("sessions");
        if(sessions){
            this.$store.commit("setSessions",JSON.parse(sessions));
            // this.sessions = this.$store.getters.getSessions;

        }
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
    top: -11px;
}

.medium .label div span{
    font-size: 20px;
}

.medium .blank{
    min-height: 20px;

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
    position: relative;
}

.contactAvator > img{
    width: 35px;
    height: 35px;
    border-radius: 35px;
}

.contactInfo{
    margin-left: 5%;
    height: 45px;
    width: 60%;
    font-size: 13px;
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    flex-direction: column;
    align-items: flex-start;
}

.contactTime{
    height: 35px;
    font-size: 12px;
}

.contactAvator .unread {
    background-color: red;
    width: 8px;
    height: 8px;
    border-radius: 8px;
    position: absolute;
    top: 0px;
    right: 0px;
}

.lastMsg{
    height: 20px;
}

</style>>