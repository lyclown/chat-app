<template>
    <el-dialog :visible.sync="dialogVisible" width="60%" :before-close="handleDialogClose">
        <img v-if="imageUrl" :src="imageUrl" class="dialog-image">
    </el-dialog>
</template>
<script>
export default {
    name:'PreviewImage',
    data() {
        return {
            dialogVisible: false,
            imageUrl: ''
        }
    },
    methods: {
        show(imageUrl) {
            this.dialogVisible = true
            this.imageUrl = imageUrl
        },
        handleDialogClose() {
            this.dialogVisible = false
            this.imageUrl = ''
        }
    }
}
</script>
<style lang="scss" scoped> 
.dialog-image{
    width: 100%;
}
</style>