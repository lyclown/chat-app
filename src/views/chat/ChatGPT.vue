<template>
    <div class="chat-wrap">
        <div class="content">
            <div class="flex ai-center jc-center">
                <van-icon color="red" size="30px" name="fire" @click="convertToPdf" />
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
                    <van-icon class="mt-17 ml-10" olor="#fff" size="20px" name="envelop-o" />
                    <div class="ml-20 ofx-auto answer-content" v-highlight v-html="handelMarked(questionsAnswer.content)">
                    </div>
                </div>

            </div>
        </div>
        <div class="footer">
            <el-input v-model="currentQuestion" placeholder="输入问题" @keyup.enter.native="sendQuestion" maxlength="100000"
                show-word-limit>
                <i style="color:#1e80ff;font-size: 20px;" slot="prefix" class="el-input__icon el-icon-delete-solid"
                    @click="clearStory"></i>
                <i style="color:black;font-size: 20px;" slot="suffix" class="el-input__icon el-icon-s-promotion"
                    @click="sendQuestion"> </i>
            </el-input>
        </div>
    </div>
</template>
    
<script>
import { marked } from 'marked';
import { getAnswer } from '@/apis/chat'
import { htmlTopdf } from '@/utils/tools'
import SSE from '@/utils/sse'
export default {
    data() {
        return {
            currentQuestion: '',
            questionsAnswers: [],
            source: Object.freeze({})
        };
    },
    mounted() {
        const cahtGptData = window.sessionStorage.getItem('cahtGpt')
        if (cahtGptData) {
            this.questionsAnswers = JSON.parse(cahtGptData)
        }
        this.sseTimeout = setTimeout(() => {
            this.source.close()
        }, 1000 * 60 * 5)
    },
    methods: {
        createSse(path) {
            return new Promise((resolve, reject) => {
                this.source = new SSE(path, {}, ({ event, error, status }) => {
                    if (error) {
                        console.log(error)
                        reject(error)
                    }
                    if (status === 'open') {
                        resolve()
                    }
                    if (status === 'message' && event) {
                        if (this.questionsAnswers.length > 0) this.questionsAnswers[this.questionsAnswers.length - 1].content += event.data
                    }
                });
            })

        },
        handelMarked(text) {
            return marked.parse(text)
        },
        async copyContent() {
            let text = document.querySelector('.answer-content').innerText;
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
            // if (this.source.status === 'close') {
            //     this.source.init()
            // }
            // if (this.source.status !== 'open') {
            //     await this.createSse('http://localhost:3000/api/sse')
            // }
            const currentQuestion = this.currentQuestion
            this.questionsAnswers.push({ role: 'user', content: this.currentQuestion })
            const questionsAnswers = JSON.parse(JSON.stringify(this.questionsAnswers))
            this.questionsAnswers.push({ role: 'assistant', content: '' })
            this.currentQuestion = ''
            try {
                await getAnswer({
                    messages: questionsAnswers
                })
                window.sessionStorage.setItem('cahtGpt', JSON.stringify(this.questionsAnswers))
            } catch (error) {
                this.$message.error('请稍后重试')
                this.questionsAnswers.splice(-2, 2)
                this.currentQuestion = currentQuestion
            }
        },
        convertToPdf() {
            htmlTopdf('.content', {
                filename: 'chatGPT.pdf'
            })
        },
    },
    destroyed() {
        this.source.close()
        this.source = null
        clearTimeout(this.sseTimeout)
    }
}
</script>
<style>
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
    background-color: #444654;
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

.ml-7 {
    margin-left: 7px;
}

.ml-4 {
    margin-left: 4px;
}

.ofx-auto {
    overflow-x: auto;
}

.jc-sb {
    justify-content: space-between;
}

.ti-center {
    text-align: center;
}

.c-pointer {
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

