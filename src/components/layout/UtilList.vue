
<template>
    <section class="utils-layout">
        <div v-for="util in utils" :key="util.path">
            <el-button type="success" :icon="util.icon" @click="toPage(util)">{{ util.title }}</el-button>
        </div>
    </section>
</template>
<script>
export default {
    data(){
        return{
            utils:[
                {title:'ChatGPT',icon:'el-icon-s-comment',path:'/chat'},
                {title:'生成图片',icon:'el-icon-picture',path:'/image'},
                {title:'语音对话',icon:'el-icon-picture',path:'/video'}             
            ]
        }
    },
    methods:{
        toPage(item){
            this.$router.push({path:item.path})
        }
    }



}
</script>
<style lang="scss" scoped>
.utils-layout{
    box-sizing: border-box;
    padding: 10px;
    background-color: #fff;
    border-radius:8px;
    box-shadow :0 2px 8px rgba(0, 0, 0, 0.1);
    display: grid;
    grid-template-columns:120px 120px;
    grid-row-gap: 20px;
    grid-column-gap: 20px;
    
}
</style>