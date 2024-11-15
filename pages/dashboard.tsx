import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAuth } from '@/auth/AuthContext';
import cameraImage from '../public/camera.svg';
import imageHeader from '../public/dashboardheader.svg';
import bottomImage1 from '../public/bg-bottom1.svg';
import bottomImage2 from '../public/bg-bottom2.svg'
import recordsBtn from '../public/recordsBtn.svg';
import notifBtn from '../public/notifBtn.svg';
import Camera from '@/components/camera';
import NotificationSidebar from '@/components/notification';

const Dashboard: React.FC = () => {
  const [isCameraOpen, setCameraOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();

  const openCamera = () => setCameraOpen(true);
  const closeCamera = () => setCameraOpen(false);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col items-center justify-between">
      <div
        className="w-full h-full flex flex-col items-center justify-between bg-[#A3A2A2]"
        style={{ background: 'linear-gradient(to bottom, #85A1A7 48%, #C2CCCD 100%)' }}
      >
        <header className="w-full flex justify-between">
          <div className="flex">
            <Image src={imageHeader} alt="dashboardHeader" className="max-w-xl " />
          </div>
          <div className='py-8 px-8'>
          <button
            onClick={handleLogout}
            className="bg-[#E2F1E7] hover:bg-[#e9fff0] text-gray-800 shadow-lg px-6 py-1 rounded-full font-semibold"
          >
            LOG OUT
          </button>
          </div>
        </header>

        <main className="flex-col items-center justify-center max-w-96">
          {/* <div className="flex items-center justify-center">
            <div className="text-center">
              <h6 className="text-lg text-right pr-14 font-bold text-[#FFF4F4]">CAN SEE</h6>
              <div className='text-left'>
              <h1 className="text-5xl font-bold text-[#FFF4F4] leading-tight">
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
            </div>

            <div className="relative">
              <Image src={cameraImage} alt="Camera" width={300}/>
            </div>
          </div> */}
          <Camera/>
        </main>
        <div className='absolute bottom-24 justify-between flex w-screen h-1/2'>
        <Image src={bottomImage1} alt="BottomImage1"/>
        <Image src={bottomImage2} alt="BottomImage2"/>
        </div>

        <footer className="w-full h-1/6 bg-gray-100 border-t border-gray-300 shadow-md flex justify-center space-x-6 py-2">
          {/* <button onClick={openCamera} className="flex items-center justify-center">
            <Image src={cameraBtn} alt="Camera Button" width={120}/>
          </button> */}
          <button onClick={() => router.push('/records')} className="flex items-center justify-center">
            <Image src={recordsBtn} alt="Records Button" width={120} />
          </button>
          <button onClick={toggleSidebar} className="flex items-center justify-center">
            <Image src={notifBtn} alt="Notification Button" width={120} />
          </button>
        </footer>
      </div>

      {/* {isCameraOpen && (
        <div className="fixed inset-0 z-20 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="relative bg-white px-12 py-12 rounded-lg w-8/12">
            <Camera stopCamera={closeCamera} onRecognition={(person) => console.log('Recognized Person: ', person)} />
          </div>
        </div>
      )} */}
      <NotificationSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </div>
  );
};

export default Dashboard;
