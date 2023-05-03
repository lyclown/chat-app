<template>
    <div class="wrap">
        <div class="content">
            <div class="flex ai-center jc-center">
                <van-icon color="red" size="30px" name="fire" />
                <h1 class="ml-20" style="color:#fff">chatGPT</h1>
            </div>

            <div v-for="(questionsAnswer, index) in questionsAnswers" :key="index">
                <div v-if="questionsAnswer.role === 'user'" class="question flex jc-sb">
                    <div>
                        <van-icon color="#fff" size="20px" name="friends-o" />
                        <span class="ml-20">{{ questionsAnswer.content }}</span>
                    </div>
                    <span class="c-pointer" @click="copyContent">
                        <van-icon size="15px" name="bookmark-o" />
                        <span class="ml-4">copy</span>
                    </span>
                </div>
                <div v-if="questionsAnswer.role === 'assistant'" class="answer">
                    <van-icon class="mt-17" olor="#fff" size="20px" name="envelop-o" />
                    <div class="ml-20 ofx-auto answer-content" v-highlight v-html="handelMarked(questionsAnswer.content)"></div>
                </div>

            </div>
        </div>
        <div class="footer">
            <van-icon color="#1e80ff" size="30px" name="delete" @click="clearStory" />
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
        };
    },
    mounted() {
        const cahtGptData = window.sessionStorage.getItem('cahtGpt')
        if (cahtGptData) {
            this.questionsAnswers = JSON.parse(cahtGptData)
        }
        const source = new EventSource('http://localhost:3000/api/sse');
        source.addEventListener('message', (event) => {
            if (this.questionsAnswers.length > 0) this.questionsAnswers[this.questionsAnswers.length - 1].content += event.data
        })
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
            this.$toast('清理成功')
        },
        async sendQuestion() {
            if (!this.currentQuestion) return
            this.questionsAnswers.push({ role: 'user', content: this.currentQuestion })
            const questionsAnswers = JSON.parse(JSON.stringify(this.questionsAnswers))
            this.questionsAnswers.push({ role: 'assistant', content: '' })
            this.currentQuestion = ''
            const { data } = await axios.post("http://localhost:3000/api/getAnswer", { messages: questionsAnswers })
            if (data === 'success') {
                window.sessionStorage.setItem('cahtGpt', JSON.stringify(this.questionsAnswers))
            }
        },
    }
}
</script>
<style>
.wrap {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 10px;
    box-sizing: border-box;
    background-color: #444654;
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
    /* display: flex; */
    /* justify-content: center; */
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

