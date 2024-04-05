import React, { useState } from 'react';
import { WhisperSTT } from '../components/wishper'; 

const apiKey = "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";

const TranscriptionComponent = () => {
  const [transcription, setTranscription] = useState('');
  const [whisperSTT] = useState(new WhisperSTT(apiKey));

  const startRecording = async () => {
    try {
      await whisperSTT.startRecording();
    } catch (error) {
      console.error('Error starting recording:', error.message);
    }
  };

  const stopRecording = async () => {
    try {
      await whisperSTT.stopRecording((text) => {
        setTranscription(text);
      });
    } catch (error) {
      console.error('Error stopping recording:', error.message);
    }
  };

  return (
    <div>
      <button onClick={startRecording} disabled={whisperSTT.isRecording}>
        Start Recording
      </button>
      <button onClick={stopRecording} >
        Stop Recording
      </button>
      <div>
        Transcription: {transcription}
      </div>
    </div>
  );
};

export default TranscriptionComponent;
