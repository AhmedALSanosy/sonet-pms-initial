// ============================================================
// Sonet PMS — Voice Capture Hook (Web Audio API)
// Ready for Whisper integration via Tauri commands
// ============================================================
import { useCallback, useRef } from 'react';
import { useVoiceStore } from '../store/useVoiceStore';

export function useVoiceCapture() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { setVoiceState, setTranscript, startConversation } = useVoiceStore();

  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const audioChunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop all tracks
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;

        // Create audio blob for potential Whisper processing
        const _audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        void _audioBlob;

        // TODO: Send audioBlob to Whisper via Tauri command or FastAPI
        // const transcript = await invoke('transcribe_audio', { audio: arrayBuffer });
        // For now, simulate with mock transcript
        const mockTranscripts = [
          'أعرض لي نتايج المريض أحمد محمد',
          'فيه كام أوردر معلق النهارده؟',
          'عايز أطلب تحليل CBC للمريض رقم 1042',
          'ايه حالات الطوارئ النهارده؟',
          'اعمللي فاتورة للمريضة فاطمة',
        ];
        const transcript = mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];

        setTranscript(transcript);
        startConversation(transcript);
      };

      mediaRecorder.start();
      setVoiceState('listening');
    } catch (error) {
      console.error('Microphone access denied:', error);
      setVoiceState('idle');
    }
  }, [setVoiceState, setTranscript, startConversation]);

  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  return { startListening, stopListening };
}
