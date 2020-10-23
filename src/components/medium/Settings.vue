<template>
    <div class="settingsItem">
        <div class="label">
            <span>设置</span>
        </div>

        <div class="setting">
            <div @click.stop="loadMe">
                <span>我的</span>
                <i class="iconfont icon-youjiantou"></i>
            </div>

             <div @click.stop="loadSecurity">
                <span>安全</span>
                <i class="iconfont icon-youjiantou"></i>
            </div>
<!--
            <div>
                <span>提醒</span>
                <i class="iconfont icon-youjiantou"></i>
            </div> -->

        </div>
        <div class="exit" @click.stop="exit">
            <span>登出</span>
        </div>
    </div>
</template>


<script>
export default {
    name:"Settings",
    methods:{
        loadMe(){
            this.$emit("func","Me");
        },
        loadSecurity(){
            this.$emit("func","Security");
        },
        exit(){
            sessionStorage.clear();
            this.$router.replace({path:"/"});
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

.setting{
    width: 100%;
    height: 100%;
    margin-top: 20px;
}

.setting > div{
    background-color:#444;
    padding: 5px 10px;
    height: 30px;
    line-height: 30px;
    cursor: pointer;
    margin-bottom: 10px;
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
}

.settingsItem{
    position: relative;
    height: 100%;
}

.exit{
    background-color:#444;
    width: 100%;
    height: 30px;
    line-height: 30px;
    cursor: pointer;
    padding: 5px 0;
    color: red;
    position: absolute;
    bottom: 0px;
}

</style>