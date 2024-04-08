import { RecordRTCPromisesHandler } from 'recordrtc';
import axios from 'axios';

const AUDIO_TYPE = 'audio';
const MODEL = 'whisper-1';
const TRANSCRIPTIONS_API_URL = 'https://api.openai.com/v1/audio/transcriptions';

class WhisperSTT {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.recorder = null;
    this.stream = null;
    this.isRecording = false;
    this.isStopped = true;
    this.isPaused = false;
    if (!apiKey) {
      throw new Error('API key is required');
    }
  }

  async pauseRecording() {
    if (!this.recorder) {
      throw new Error('Cannot pause recording: no recorder');
    }
    await this.recorder.pauseRecording();
    this.isPaused = true;
    this.isRecording = false;
  }

  async resumeRecording() {
    if (!this.recorder) {
      throw new Error('Cannot resume recording: no recorder');
    }
    await this.recorder.resumeRecording();
    this.isPaused = false;
    this.isRecording = true;
  }

  async startRecording() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.recorder = new RecordRTCPromisesHandler(this.stream, {
        type: AUDIO_TYPE,
      });
      this.recorder.startRecording();
      this.isRecording = true;
      this.isStopped = false;
    } catch (error) {
      this.isRecording = false;
      this.isStopped = true;
      throw new Error(`Error starting recording: ${error.message}`);
    }
  }

  async stopRecording(onFinish) {
    if (!this.isRecording || !this.recorder) {
      throw new Error('Cannot stop recording: no recorder');
    }
    try {
      await this.recorder.stopRecording();
      const blob = await this.recorder.getBlob();
      this.transcribe(blob, onFinish);
      this.stream?.getTracks().forEach((track) => {
        track.stop();
      });
      this.recorder = null;
      this.stream = null;
      this.isRecording = false;
      this.isStopped = true;
      this.isPaused = false;
      console.log('Stopping recording...');
      // Your existing code
      console.log('Recording stopped.');
    } catch (error) {
      this.isRecording = false;
      this.isStopped = true;
      throw new Error(`Error stopping recording: ${error.message}`);
    }
  }

  async transcribe(audioBlob, onFinish) {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.wav');
    formData.append('model', MODEL);

    const headers = {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'multipart/form-data',
    };
    try {
      const response = await axios.post(TRANSCRIPTIONS_API_URL, formData, {
        headers,
      });
      onFinish(response.data?.text || '');
    } catch (error) {
      console.error('Error transcribing audio:', error);
    }
  }
}

export { WhisperSTT };
