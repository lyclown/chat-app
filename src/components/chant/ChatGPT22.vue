<template>
    <div class="wrap">
        <div class="content">
            <div class="flex ai-center jc-center">
                <van-icon color="red" size="30px" name="fire" />
                <h1 class="ml-20" style="color:#fff">chatGPT</h1>
            </div>

            <div v-for="(questionsAnswer, index) in questionsAnswers" :key="index">
                <div class="question flex jc-sb">
                    <div>
                        <van-icon color="#fff" size="20px" name="friends-o" />
                        <span class="ml-20">{{ questionsAnswer.question }}</span>
                    </div>
                    <span class="c-pointer" @click="copyContent">
                        <van-icon size="15px" name="bookmark-o" />
                        <span class="ml-4">copy</span>
                    </span>
                </div>
                <div class="answer">
                    <van-icon class="mt-17" olor="#fff" size="20px" name="envelop-o" />
                    <div class="ml-20 ofx-auto answer-content" v-highlight v-html="handelMarked(questionsAnswer.answer)">
                    </div>
                </div>

            </div>
        </div>
        <div class="footer">
            <van-icon class="ml-7" color="#1e80ff" size="30px" name="delete" @click="clearStory" />
            <van-field v-model="currentQuestion" @keyup.enter.native="sendQuestion" center clearable placeholder="输入问题">
                <template #button>
                    <van-icon size="20px" @click="sendQuestion" name="guide-o" />
                </template>
            </van-field>
        </div>
    </div>
</template>
    
<script>
import axios from 'axios';
import { marked } from 'marked';
export default {
    data() {
        return {
            currentQuestion: '',
            questionsAnswers: [],
            imageQuestion: '',
            imageUrl: '',
            questionIndex: 0,
            text: ''
        };
    },
    mounted() {
        
        const cahtGptData = window.sessionStorage.getItem('cahtGpt')
        if (cahtGptData) {
            this.questionsAnswers = JSON.parse(cahtGptData)
            this.questionIndex = this.questionsAnswers.length
        }
        const source = new EventSource('http://127.0.0.1:3001/stream');
        source.addEventListener('message', (event) => {
            const { message } = JSON.parse(event.data);
            this.questionsAnswers[this.questionIndex].answer += message
        });
    },
    methods: {
        handelMarked(text) {
            return marked.parse(text)
        },
        async copyContent() {
            let text = document.querySelector('.answer-content').innerText;
            await this.$copyText(text)
            this.$toast.success('复制成功')
        },
        async clearStory() {
            this.questionsAnswers = []
            window.sessionStorage.clear()
            this.questionIndex = 0
            const { data } = await axios.post("http://127.0.0.1:3001/clear/answer")
            if (data.status === 'success') this.$toast(data.message)
        },
        async sendQuestion() {
            if (!this.currentQuestion) return
            this.questionsAnswers.push({
                question: this.currentQuestion,
                answer: ''
            })
            const currentQuestion = this.currentQuestion
            this.currentQuestion = ''
            const { data } = await axios.post("http://localhost:3000/api/getAnswer", { prompt: currentQuestion })
            console.log(data)
            if (data.success) {
                this.$toast('完成')
                this.questionIndex++
                window.sessionStorage.setItem('cahtGpt', JSON.stringify(this.questionsAnswers))
            }
        },
    }
}
</script>
<style scoped>
.wrap {
    display: flex;
    flex-direction: column;
    height: 100vh;
    padding: 10px;
    box-sizing: border-box;
}

.content {
    flex: 1;
    overflow-y: auto;
}

.footer {
    display: flex;
    align-items: center;
    height: 60px;
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
    display: flex;
    width: 100%;
    background-color: #444654;
    color: #fff;
}

.answer pre {
    display: flex;
    justify-content: center;
}

.answer pre code {
    /* width: 800px; */
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

