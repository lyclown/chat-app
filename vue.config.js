const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: "./",
  outputDir: "dist",
  devServer: {
    host: '0.0.0.0', // 默认是localhost
    port: 8081, // 前端项目编译后使用的端口号，跟webpack配置的port同理
    proxy: {
      '/api': {
        target: "http://localhost:3001",   // 实际跨域请求的API地址
        secure: false,   // https请求则使用true
        ws:true,
        changeOrigin: true,  // 跨域
        // 请求地址重写  http://front-end/api/login ⇒ http://api-url/login
        // pathRewrite:{
        //   '/api':''
        // }
      }
    }
  }
})
