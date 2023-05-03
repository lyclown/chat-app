<template>
    <div class="copy-wrap">
        <span>{{ language_type }}</span>
        <span class="c-pointer" @click="copyContent">
            <!-- <van-icon size="15px" name="bookmark-o" /> -->
            <span class="ml-4">Copy code</span>
        </span>
    </div>
</template>
<script>
    export default{
        name:'CopyContent',
        data(){
            return {
                language_type:'',
            }
        },
        methods:{
            async copyContent(){
                const text = this.contetnNode.innerText
                await this.$copyText(text)
                this.$toast.success('复制成功')
            }
        }
    }
</script>
<style scoped>
.copy-wrap{
    background-color: #343541;
    display: flex;
    justify-content: space-between;
    padding: 5px;
    align-items: center;
    border-radius: 4px 4px 0 0;
}
.c-pointer{
    cursor: pointer;
}
.ml-4{
    margin-left: 4px;
}
</style>