import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import cameraImage from '../public/camera.svg';
import imageHeader from '../public/dashboardheader.svg';
import bottomImage from '../public/bg-bottom.svg';
import cameraBtn from '../public/cameraBtn.svg';
import recordsBtn from '../public/recordsBtn.svg';
import notifBtn from '../public/notifBtn.svg';

const Dashboard: React.FC = () => {
  const [isCameraOpen, setCameraOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  // Toggle Camera Modal
  const openCamera = () => setCameraOpen(true);
  const closeCamera = () => setCameraOpen(false);

  // Toggle Notification Sidebar
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen flex flex-col items-center justify-between">
      <div
        className="min-h-screen w-full bg-[#A3A2A2] flex flex-col items-center justify-normal"
        style={{ background: 'linear-gradient(to bottom, #85A1A7 48%, #C2CCCD 100%)' }}
      >
        {/* Header */}
        <header className="w-full flex justify-between">
          <div className="flex">
            <Image src={imageHeader} alt="dashboardHeader" className="w-10/12" />
          </div>
          <div className="p-10">
            <button className="bg-[#E2F1E7] hover:bg-[#e9fff0] text-gray-800 shadow-lg px-8 py-2 rounded-full font-semibold">
              LOG OUT
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-col items-center justify-center">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <h6 className="text-2xl text-right px-20 font-bold text-[#FFF4F4] leading-tight">
                CAN SEE
              </h6>
              <h1 className="text-6xl text-left font-bold text-[#FFF4F4] leading-tight">
                <span className="px-2">I</span>
                <span className="relative px-2 inline-block text-[#BFBFBF]">
                  KNOW
                  <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 border-4 border-white"></div>
                </span>
                <br />
                WHAT IS <br />
                GOING ON
              </h1>
            </div>

            <div className="relative w-64 h-64 mt-8">
              <Image src={cameraImage} alt="Camera" layout="fill" objectFit="contain" />
            </div>
          </div>
        </main>
        <Image src={bottomImage} alt="BottomImage" className="absolute bottom-0 flex justify-end" />
      </div>

      <footer className="w-full relative py-14 bg-gray-100 border-t border-gray-300 shadow-md">
        <div className="flex justify-center space-x-10">
          <button onClick={openCamera} className="flex items-center justify-center">
            <Image src={cameraBtn} alt="Camera Button" width={100} height={100} />
          </button>

          <button onClick={() => router.push('/records')} className="flex items-center justify-center">
            <Image src={recordsBtn} alt="Records Button" width={100} height={100} />
          </button>

          <button onClick={toggleSidebar} className="flex items-center justify-center">
            <Image src={notifBtn} alt="Notification Button" width={100} height={100} />
          </button>
        </div>
      </footer>

      {isCameraOpen && (
        <div className="fixed inset-0 z-20 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="relative bg-white p-6 rounded-lg max-w-lg w-full">
            <button className="absolute top-2 right-2 text-xl font-bold" onClick={closeCamera}>
              ✕
            </button>
            <CameraComponent />
          </div>
        </div>
      )}

      <NotificationSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </div>
  );
};

const CameraComponent: React.FC = () => {
  return <div className="text-center text-lg">Camera Component Content Here</div>;
};

const NotificationSidebar: React.FC<{ isOpen: boolean; toggleSidebar: () => void }> = ({
  isOpen,
  toggleSidebar,
}) => {
  return (
    <div
      className={`fixed inset-y-0 left-0 w-64 bg-gray-100 p-6 shadow-md z-20 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300`}
    >
      <button className="absolute top-2 right-2 text-xl font-bold" onClick={toggleSidebar}>
        ✕
      </button>
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      <div>Your notifications will be shown here.</div>
    </div>
  );
};

export default Dashboard;
