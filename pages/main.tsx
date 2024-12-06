import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/auth/AuthContext';
import Camera from '@/components/camera';
import Modal from '@/components/modal'; // Import the Modal component

const Main: React.FC = () => {
  const router = useRouter();
  const { logout } = useAuth();
  const [detections, setDetections] = useState<{ name: string; time: string }[]>([]);
  const [showModal, setShowModal] = useState(false); // To control modal visibility
  const [modalMessage, setModalMessage] = useState(''); // To store the modal message

  const navigateTo = (path: string) => {
    router.push(path);
  };

  useEffect(() => {
    const fetchDetections = () => {
      const storedDetections = JSON.parse(localStorage.getItem('detections') || '[]');
      setDetections(storedDetections);
    };
    fetchDetections();
    const intervalId = setInterval(fetchDetections, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const checkForUnknown = setInterval(() => {
      const detectionType = localStorage.getItem('detectionType');
      if (detectionType === 'unknown') {
        setModalMessage('Unknown person detected!');
        setShowModal(true);
        localStorage.removeItem('detectionType');
      }
    }, 1000);

    return () => clearInterval(checkForUnknown);
  }, []);

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <div className="flex flex-col text-center items-center justify-between shadow-lg bg-gradient-to-r from-[#243642] to-[#445B6A]">
        <div className="grid grid-col-1">
          {/* Records Button */}
          <div
            className="flex flex-col border-b-2 hover:bg-[#445B6A] border-white w-full items-center p-4 cursor-pointer"
            onClick={() => navigateTo('/records')}
          >
            <img
              src="records.svg"
              alt="Records Icon"
              className="w-6 h-6"
            />
            Records
          </div>

          {/* Gallery Button */}
          <div
            className="flex flex-col border-b-2 hover:bg-[#445B6A] border-white w-full items-center p-4 cursor-pointer"
            onClick={() => navigateTo('/gallery')}
          >
            <img
              src="gallery.svg"
              alt="Gallery Icon"
              className="w-6 h-6"
            />
            Gallery
          </div>
        </div>

        {/* Logout Button */}
        <div
          className="flex flex-col text-center hover:bg-[#445B6A] items-center p-4 text-white border-t-2 border-white w-full cursor-pointer"
          onClick={() => logout()}
        >
          <img
            src="logout.svg"
            alt="Logout Icon"
            className="w-6 h-6"
          />
          Logout
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white flex justify-center items-center" style={{ height: '100%', position: 'relative' }}>
        <Camera />
      </div>

      {/* Right Sidebar */}
      <div className="w-1/5 bg-[#445B6A] flex flex-col items-center shadow-lg">
        <header className="w-full text-lg font-semibold border-2 border-[#243642] text-white uppercase text-center p-2 bg-gradient-to-r from-[#243642] to-[#445B6A]">
          <h1>Face log</h1>
        </header>
        <div className="overflow-y-auto max-h-[calc(100vh-100px)] mt-4 w-full">
          <ul className="space-y-2 text-white w-full">
            {detections.length > 0 ? (
              detections.map((detection, index) => (
                <li
                key={index}
                className={`text-sm border-b w-full text-center p-2 ${
                    detection.name === "Unknown Person" ? "text-red-500" : "text-white"
                }`}
                >
                <strong>{detection.name}</strong> at {detection.time}
                </li>
              ))
            ) : (
              <li className="text-sm text-center">No detections recorded.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Display Modal */}
      {showModal && <Modal message={modalMessage} onClose={closeModal} />}
    </div>
  );
};

export default Main;
