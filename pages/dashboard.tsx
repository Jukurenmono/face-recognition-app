import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Camera from '../components/camera';
import Records from '../components/records';
import Notifications from '../components/notification';
import RecognitionModal from '../components/recogModal';
import { useAuth } from '@/auth/AuthContext';

interface Person {
  name: string;
  age: number;
  department: string;
}

const Dashboard: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [recognizedPerson, setRecognizedPerson] = useState<Person | null>(null);
  const { user, logout } = useAuth();
  const router = useRouter();
  const cameraStreamRef = useRef<MediaStream | null>(null); // Ref to hold the camera stream

  const handleRecognition = (person: Person) => {
    setRecognizedPerson(person);
    setModalOpen(true);
  };

  useEffect(() => {
    if (!user) {
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach(track => track.stop());
      }
      router.push("/login");
    }
  }, [user, router]);

  const handleLogout = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach(track => track.stop());
    }
    logout();
  };

  const stopCamera = () => {
    if (cameraStreamRef.current) {
      const tracks = cameraStreamRef.current.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 overflow-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Face Recognition Dashboard</h1>
        <button
          type='button'
          onClick={handleLogout}
          className="font-bold bg-red-500 text-white py-2 px-4 rounded-md hover:bg-hoverColor transition"
        >
          Logout
        </button>
      </div>
      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 mb-6">
        <div className="bg-white rounded-lg shadow-md flex-1 p-6">
          <h2 className="text-2xl text-black font-semibold mb-4">Camera</h2>
          <div className="overflow-auto">
            {user ? (
              <Camera 
                onRecognition={handleRecognition}
                stopCamera={stopCamera}
              />
            ) : (
              <p className="text-gray-500">Please log in to access the camera.</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md flex-1 p-6">
          <h2 className="text-2xl text-black font-semibold mb-4">Records</h2>
          <div className="overflow-auto">
            <Records />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl text-black font-semibold mb-4">Notifications</h2>
        <div className="overflow-auto">
          <Notifications />
        </div>
      </div>

      <RecognitionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        person={recognizedPerson || { name: '', age: 0, department: '' }}
      />
    </div>
  );
};

export default Dashboard;
