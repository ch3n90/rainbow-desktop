<template>
  
      <!-- 全局提示框 -->
        <transition name="fade"
  enter-active-class="fadeInRight"
  leave-active-class="fadeOutRight" mode="out-in">
            <div v-show="visible" class="dialog-tips dialog-right">{{message}}</div>
        </transition>
         
  
</template>
<script>
import 'vue2-animate/dist/vue2-animate.min.css'
export default {
  data() {
    return {
      visible: false,
      message: ""
    };
  }
};
</script>
<style>
.dialog-tips{
    position: fixed;
    z-index: 100;
    min-width: 200px;
    padding: 5px;
    white-space: nowrap;
    text-align: center;
    background-color:#fff;
    border-radius: 5px;
}
.dialog-right {
    top: 20px;
    right: 3%;
}

</style>