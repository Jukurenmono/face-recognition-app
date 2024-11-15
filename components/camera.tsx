import React, { useRef, useEffect, useState } from 'react';
import * as ort from 'onnxruntime-web';

const labels = [
  'Blenchie Jean Cuadra',
  'Christine Serdan',
  'Aldric Rholen Calatrava',
  'Joey Ara Teh',
  'Kian Ambala',
  'Christian Lorrence Alparo'
];

const CameraComponent: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [model, setModel] = useState<ort.InferenceSession | null>(null);
  const [prediction, setPrediction] = useState<string>('');

  useEffect(() => {
    const loadModel = async () => {
      try {
        const session = await ort.InferenceSession.create('faceRecog_model.onnx');
        setModel(session);
      } catch (error) {
        console.error('Failed to load ONNX model:', error);
      }
    };

    const startVideo = () => {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((error) => {
          console.error('Failed to start video stream:', error);
        });
    };

    loadModel();
    startVideo();
  }, []);

  const processFrame = async () => {
    if (!videoRef.current || !model) return;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const modelInputSize = 224;
    canvas.width = modelInputSize;
    canvas.height = modelInputSize;

    if (context) {
      context.drawImage(videoRef.current, 0, 0, modelInputSize, modelInputSize);
      const imageData = context.getImageData(0, 0, modelInputSize, modelInputSize);
      const inputTensor = preprocessImage(imageData);

      const feeds: Record<string, ort.Tensor> = { 'sequential_1_input': inputTensor };
      const results = await model.run(feeds);
      const output = results['sequential_3'].data as Float32Array;

      const highestIndex = output.indexOf(Math.max(...output));
      const detectedPerson = labels[highestIndex];
      setPrediction(detectedPerson);

      const timestamp = new Date().toISOString();
      const detectionRecord = { name: detectedPerson, time: timestamp };
      const storedDetections = JSON.parse(localStorage.getItem('detections') || '[]');
      storedDetections.push(detectionRecord);
      localStorage.setItem('detections', JSON.stringify(storedDetections));
    }
  };

  const preprocessImage = (imageData: ImageData): ort.Tensor => {
    const { data, width, height } = imageData;
    const input = new Float32Array(width * height * 3);

    for (let i = 0; i < data.length; i += 4) {
      const idx = i / 4;
      input[idx * 3] = data[i] / 255;
      input[idx * 3 + 1] = data[i + 1] / 255;
      input[idx * 3 + 2] = data[i + 2] / 255; 
    }

    return new ort.Tensor('float32', input, [1, width, height, 3]);
  };

  useEffect(() => {
    const interval = setInterval(processFrame, 1000);
    return () => clearInterval(interval);
  }, [model]);

  return (
    <div>
      <div>
        <p>Detected Employee: {prediction || 'No face detected'}</p>
      </div>
      <video ref={videoRef} autoPlay playsInline width="100%" />
    </div>
  );
};

export default CameraComponent;
