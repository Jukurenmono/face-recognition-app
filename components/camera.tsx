import React, { useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';

interface Person {
  name: string;
  age: number;
  department: string;
}

interface CameraProps {
  onRecognition: (person: Person) => void;
  stopCamera: () => void;
}

const Camera: React.FC<CameraProps> = ({ onRecognition, stopCamera }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let model: blazeface.BlazeFaceModel | null = null;
    
    const initializeModel = async () => {
      try {
        await tf.setBackend('webgl');
        await tf.ready();
      } catch (error) {
        console.warn('WebGL backend unavailable, falling back to CPU.');
        await tf.setBackend('cpu');
        await tf.ready();
      }
      model = await blazeface.load();
    };
  
    const getVideoStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        await initializeModel();
        detectFace();
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };
  
    const detectFace = async () => {
      if (model && videoRef.current && canvasRef.current) {
        const predictions = await model.estimateFaces(videoRef.current, false);
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
  
        if (context) {
          context.clearRect(0, 0, canvas.width, canvas.height);
  
          predictions.forEach((prediction) => {
            const [x, y] = prediction.topLeft as [number, number];
            const [endX, endY] = prediction.bottomRight as [number, number];
            const width = endX - x;
            const height = endY;
  
            context.strokeStyle = 'red';
            context.lineWidth = 2;
            context.strokeRect(x, y, width, height);
          });
        }
      }
      requestAnimationFrame(detectFace);
    };
  
    getVideoStream();

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);
  

  const handleRecognition = () => {
    const recognizedPerson: Person = {
      name: 'Cuadra, Blenchie Jean',
      age: 20,
      department: 'Program Management',
    };
    onRecognition(recognizedPerson);
  };

  return (
    <div className="relative border border-gray-300 rounded-lg h-64 w-full flex items-center justify-center">
      <video ref={videoRef} className="w-full h-full object-cover" autoPlay />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
        width={640}
        height={480}
      />
      <button
        onClick={handleRecognition}
        className="absolute bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        Simulate Recognition
      </button>
    </div>
  );
};

export default Camera;