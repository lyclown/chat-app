<template>
    <div class="mask-container">
      <div class="icon-container">
        <i class="el-icon-view mr-4 c-pointer" @click="preview"></i>
        <i class="el-icon-download c-pointer" @click="download"></i>
      </div>
      <img class="img-container" :src="imgSrc" alt="">
      <preview-image ref="previewImage"></preview-image>
    </div>
  </template>
  
  <script>
  import {downloadImage} from '@/utils/tools'
  import PreviewImage from '@/components/image/PreviewImage.vue'
  export default {
    components :{
      PreviewImage
    },
    props :{
      imgSrc: {
        type :String,
        required :true
      }
    },
    methods :{
      preview() {
        console.log('preview');
        this.$refs.previewImage.show(this.imgSrc)
      },
      download() {
        downloadImage(this.imgSrc)
        console.log('download');
        // 编写下载图片的逻辑
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .mask-container {
    position: relative;
    border-radius: 6px;
    overflow: hidden;
    img {
        width: 100%;
        height: 100%;
    }
    &:hover {
      .icon-container {
        visibility: visible;
      }
    }
  }
  
  .icon-container {
    position :absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    visibility: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #000000b3;
    color: #fff;
    font-size: 20px;
  }
  
  .icon-preview, .icon-download {
    display: inline-block;
    width :30px;
    height: 30px;
    margin: 0 10px;
    background-repeat: no-repeat;
    background-size: contain;
    cursor :pointer;
  }
  .mr-4{
    margin-right: 4px;
  }
  .c-pointer{
    cursor: pointer;
  }
  </style>
  