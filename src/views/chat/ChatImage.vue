<template>
    <div class="chat-wrap" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
        <div class="content">
            <div class="flex ai-center jc-center">
                <van-icon color="red" size="30px" name="fire" />
                <h1 class="ml-20" style="color:#fff">chatGPT</h1>
            </div>

            <div v-for="(questionsAnswer, index) in questionsAnswers" :key="index">
                <div class="question flex jc-sb">
                    <div>
                        <van-icon color="#fff" size="20px" name="friends-o" />
                        <span class="ml-20 copy-content">{{ questionsAnswer.content }}</span>
                    </div>
                    <span class="c-pointer" @click="copyContent">
                        <i class="el-icon-document-copy"></i>
                        <span class="ml-4">copy</span>
                    </span>
                </div>
                <div class="answer">
                    <image-card  v-for="image in questionsAnswer.images" :key="image.url" :imgSrc="image.url"></image-card>
                    <!-- <div class="image-wrap" v-for="image in questionsAnswer.images" :key="image.url" @click="enlargeImage(image)">
                        <img :src="image.url" alt="" >
                    </div> -->
                </div>

            </div>
        </div>
        <div class="footer">
            <el-input v-model="currentQuestion" placeholder="输入问题" @keyup.enter.native="sendQuestion" maxlength="1000" show-word-limit>
                <i style="color:#1e80ff;font-size: 20px;" slot="prefix" class="el-input__icon el-icon-delete-solid"></i>
                <i style="color:black;font-size: 20px;" slot="suffix" class="el-input__icon el-icon-s-promotion"  @click="sendQuestion"> </i>
            </el-input>
        </div>
    </div>
</template>
    
<script>
import {getImage,getAnswer} from '@/apis/chat'
import ImageCard from '@/components/image/ImageCard.vue'
export default {
    components:{ImageCard},
    data() {
        return {
            currentQuestion: '',
            questionsAnswers: [],
            loading:false
        };
    },
    mounted() {
        const cahtGptData = window.sessionStorage.getItem('images')
        if (cahtGptData) {
            this.questionsAnswers = JSON.parse(cahtGptData)
        }
    },
    methods: {
        async copyContent() {
            let text = document.querySelector('.copy-content').innerText;
            await this.$copyText(text)
            this.$message.success('复制成功')
        },
        async clearStory() {
            this.questionsAnswers = []
            window.sessionStorage.clear()
            this.$message.success('清理成功')
        },
        async sendQuestion() {
            if (!this.currentQuestion) return
            this.loading = true
            // const currentQuestion = await this.translationQuestion(this.currentQuestion)
            const {data} = await getImage({
                prompt:this.currentQuestion
            })
            console.log(data)
            this.loading = false
            const questionsAnswer = this.questionsAnswers.find(x=>x.content ===this.currentQuestion)
            console.log(questionsAnswer)
            if(questionsAnswer){
                questionsAnswer.images.push(...data.data)
            }else{
                this.questionsAnswers.push({ role: 'user', content: this.currentQuestion,images:data.data })
            }
            console.log(this.questionsAnswers)
            window.sessionStorage.setItem('images', JSON.stringify(this.questionsAnswers))
        },
        async translationQuestion(question=''){
            question= `请翻译“${question}”为英文`
            
            const messages = [{role:'user',content:question}]
            const data = await getAnswer({messages})
            return data

        }
    }
}
</script>
<style lang="scss" scoped>
.chat-wrap {
    height: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    border-radius: 10px;
    padding: 0 10px;
    background-color: #444654;
}

.content {
    flex: 1;
    overflow-y: auto;
}

.footer {
    display: flex;
    align-items: center;
    /* height: 60px; */
    margin: 10px;
    background-color: #fff;
    border-radius: 10px;
}

.question {
    display: flex;
    width: 100%;
    background-color: #343541;
    color: #fff;
    padding: 10px;
    box-sizing: border-box;
    border-radius: 5px;
}

.answer {
    padding: 10px 0;
    display: grid;
    grid-template-columns:repeat(auto-fill, 100px);
    grid-template-rows:repeat(auto-fill, 100px);
    grid-row-gap: 15px;
    grid-column-gap: 15px;

    
}

.ml-20 {
    margin-left: 8px;
}

.mt-17 {
    margin-top: 17px;
}
.ml-7{
margin-left: 7px;
}
.ml-4{
    margin-left: 4px;
}

.ofx-auto {
    overflow-x: auto;
}
.jc-sb{
    justify-content: space-between;
}

.ti-center {
    text-align: center;
}
.c-pointer{
    cursor: pointer;
}
.flex {
    display: flex;
}

.ai-center {
    align-items: center;
}

.jc-center {
    justify-content: center;
}
</style>

