import React, { useEffect, useState } from 'react';
import { FaChevronLeft, FaDownload, FaTimes } from 'react-icons/fa';
import Link from 'next/link';

interface Record {
  imageUrl: string;
  name: string;
  time: string;
}

const Gallery: React.FC = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const storedDetections = localStorage.getItem('detections');
    if (storedDetections) {
      setRecords(JSON.parse(storedDetections));
    }
  }, []);

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleDownload = () => {
    if (!selectedImage) return;
    const a = document.createElement('a');
    a.href = selectedImage;
    a.download = 'captured-face.png';
    a.click();
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="w-full h-full bg-gray-100 rounded-lg shadow-lg flex flex-col">
        {/* Table */}
        <div className="flex-1 overflow-hidden">
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-[#243642] text-white sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 text-left font-semibold w-[8%]">
                  <Link href="/main">
                    <button className="bg-white text-black rounded-full px-2 py-2 text-lg">
                      <FaChevronLeft />
                    </button>
                  </Link>
                </th>
                <th className="px-4 py-2 text-center font-semibold w-[25%]">Image</th>
                <th className="px-4 py-2 text-center font-semibold w-[32%]">Name</th>
                <th className="px-4 py-2 text-center font-semibold w-[30%]">Time</th>
              </tr>
            </thead>
          </table>

          {/* Scrollable body */}
          <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <tbody className="bg-green-50 text-black">
                {records.map((record, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-100 border-t border-[#243642]"
                  >
                    <td className="px-4 py-2 text-center"></td>
                    {/* Display the image */}
                    <td className="p-5 justify-items-center text-center">
                      <img
                        src={record.imageUrl}
                        alt={record.name}
                        className="h-16 w-16 object-cover rounded cursor-pointer"
                        onClick={() => handleImageClick(record.imageUrl)}
                      />
                    </td>
                    <td className="px-4 py-2 text-center">{record.name}</td>
                    <td className="px-4 py-2 text-center">{record.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedImage && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-2 max-w-sm relative">
            {/* Close Button */}
            <div className="flex p-2 justify-end">
              <button
                className="text-red-500 text-2xl"
                onClick={closeModal}
              >
                <FaTimes />
              </button>
            </div>
            {/* Modal Content */}
            <img
              src={selectedImage}
              alt="Selected Face"
              className="w-full h-auto rounded"
            />
            <div className="flex justify-center mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
                onClick={handleDownload}
              >
                <FaDownload />
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
