import React, { useRef, useEffect, useState } from 'react';
import * as ort from 'onnxruntime-web';
import * as blazeface from '@tensorflow-models/blazeface';
import '@tensorflow/tfjs-backend-webgl';

const labels = [
  'Blenchie Cuadra',
  'Christine Serdan',
  'Aldric Calatrava',
  'Joey Ara Teh',
  'Kian Ambala',
  'Christian Alparo'
];

const CameraComponent: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [model, setModel] = useState<ort.InferenceSession | null>(null);
  const [blazeFaceModel, setBlazeFaceModel] = useState<blazeface.BlazeFaceModel | null>(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const blazeModel = await blazeface.load();
        const session = await ort.InferenceSession.create('faceRecog_model.onnx');
        setBlazeFaceModel(blazeModel);
        setModel(session);
      } catch (error) {
        console.error('Failed to load models:', error);
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

    loadModels();
    startVideo();
  }, []);

  const processFrame = async () => {
    if (!videoRef.current || !model || !blazeFaceModel || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);

      const detections = await blazeFaceModel.estimateFaces(video, false);

      if (detections.length > 0) {
        const face = detections[0];
        const { topLeft, bottomRight } = face;
        const [x1, y1] = topLeft as [number, number];
        const [x2, y2] = bottomRight as [number, number];

        context.strokeStyle = 'red';
        context.lineWidth = 3;
        context.strokeRect(x1, y1, x2 - x1, y2 - y1);

        const modelInputSize = 224;
        const faceWidth = x2 - x1;
        const faceHeight = y2 - y1;
        const faceCanvas = document.createElement('canvas');
        const faceContext = faceCanvas.getContext('2d');
        faceCanvas.width = modelInputSize;
        faceCanvas.height = modelInputSize;

        if (faceContext) {
          faceContext.drawImage(
            video,
            x1,
            y1,
            faceWidth,
            faceHeight,
            0,
            0,
            modelInputSize,
            modelInputSize
          );
          const faceImageData = faceContext.getImageData(0, 0, modelInputSize, modelInputSize);
          const inputTensor = preprocessImage(faceImageData);

          const feeds: Record<string, ort.Tensor> = { 'sequential_1_input': inputTensor };
          const results = await model.run(feeds);
          const output = results['sequential_3'].data as Float32Array;

          const highestIndex = output.indexOf(Math.max(...output));
          const detectedPerson = labels[highestIndex];
          const confidence = output[highestIndex];

          const timestamp = `${new Date().toLocaleTimeString()}`;
          const datestamp = `${new Date().toLocaleDateString()}`;
          const detectionRecord = {
            name: confidence > 0.75 ? detectedPerson : 'Unknown Person',
            time: timestamp,
            date: datestamp,
            detectionType: confidence > 0.75 ? 'known' : 'unknown',
            imageUrl: faceCanvas.toDataURL('image/png')
          };

          const storedDetections = JSON.parse(localStorage.getItem('detections') || '[]');
          const lastDetection = storedDetections[storedDetections.length - 1];

          if (!lastDetection || lastDetection.name !== detectionRecord.name) {
            storedDetections.push(detectionRecord);
            localStorage.setItem('detections', JSON.stringify(storedDetections));

            if (detectionRecord.detectionType === 'unknown') {
              localStorage.setItem('detectionType', 'unknown');
            }
          }

          context.font = '16px Arial';
          context.fillStyle = 'red';
          context.fillText(
            `Employee: ${confidence > 0.75 ? detectedPerson : 'Unknown Person'}`,
            x1,
            y1 - 10
          );
        }
      }
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

    return new ort.Tensor('float32', input, [1, height, width, 3]);
  };

  useEffect(() => {
    const interval = setInterval(processFrame, 500);
    return () => clearInterval(interval);
  }, [model, blazeFaceModel, videoRef]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default CameraComponent;
