<template>
    <div id="Auth" class="container" >
      <div class="titlebar"> 
        <div class="opbar">
            <div @click="close">
              <span class="iconfont icon-guanbi1"></span>
            </div>
            <div @click="minimize">
              <span class="iconfont icon-jianhao"></span>
            </div>
        </div>
      </div>
      
      <transition  name="fade"
  enter-active-class="fadeInLeft"
  leave-active-class="fadeOutRight" mode="out-in">
        <router-view style="animation-duration: 0.5s"/>
      </transition>
    </div>
</template>

<script>
import Login from '@/components/Login'
import 'vue2-animate/dist/vue2-animate.min.css'
// const {BrowserWindow} = require( 'electron').remote
 const {ipcRenderer,app,BrowserWindow} = require('electron')

  export default {
    name: 'Auth',
    render:function(c){
        return c(Login);
    },
    created(){
      // get cid
      let cid = localStorage.getItem("cid");
         if(!cid){
            var rString = randomString(8, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
            localStorage.setItem("cid",rString);
         }
      },
      methods:{
        close(){
        ipcRenderer.send("auth-win-close")
        },
        minimize(){
          ipcRenderer.send("auth-win-min")
        }
      }
    }


  function randomString(length, chars) {
      var result = '';
      for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
      return result;
  }


</script>


<style scoped>
.container{
  color: white;
}

.titlebar{
  width: 100%;
  height: 31px;
   -webkit-app-region: drag;
  -webkit-user-select: none;
}

.opbar div{
  -webkit-app-region: no-drag;
  float: right;
  margin: 1px 1px 0 0;
  width: 30px;
  height: 30px;
  font-size: 20px;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
}

.opbar div:nth-child(odd):hover{
  background-color: #9d170a;
}
.opbar div:nth-child(even):hover{
  background-color: #888;
}



</style>