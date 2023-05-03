<template>
  <div>
    <el-button icon="el-icon-microphone" @click="startRecording" @touchstart="startRecording" @mouseup="stopRecording"
      @touchend="stopRecording">
      {{ recording ? '录音中...' : '开始录音' }}
    </el-button>
    <el-button icon="el-icon-microphone" @click="stopRecording">结束录音</el-button>
    <el-button v-if="recordings.length > 0" @click="uploadRecordings">上传录音</el-button>
    <ul v-if="recordings.length > 0">
      <li v-for="(recording, index) in recordings" :key="index">
        <audio :src="recording.blobURL" controls></audio>
      </li>
    </ul>
  </div>
</template>

<script>
import Recorder from 'recorder-js';
import { createTranscription } from '@/apis/chat';
// import Speech from 'speak-tts'

export default {
  data() {
    return {
      recording: false,
      recorder: null,
      recordings: [],
    };
  },
  methods: {
    async startRecording() {
      console.log(88888)
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.recorder = new Recorder(audioContext, {
        onAnalysed: data => console.log(data),
      });
      this.recording = true;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      this.recorder.init(stream)
      this.recorder.start()
    },
    async stopRecording() {
      this.recording = false;
      const {blob} = await this.recorder.stop();
      // this.recordings.push({
      //   blobURL: URL.createObjectURL(blob),
      //   blob,
      // });
      console.log(this.recorder)
      console.log(blob)
      this.uploadRecordings(blob)
      // const a = Recorder.download(blob, 'my-audio-file');
      // console.log(a)
    },
    async uploadRecordings(blob) {
      // 将录音文件上传到服务器
      // const recording = this.recordings[this.recordings.length - 1]
      const formData = new FormData();
      formData.append('files', blob, 'recording.wav');
      const { data } = await createTranscription(formData);
      console.lof(data)
      // 清空录音文件数组
      // this.recordings = [];
    },
  },
};
</script>