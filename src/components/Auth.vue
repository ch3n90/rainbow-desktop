<template>
    <div id="Auth" class="container" >
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

</style>