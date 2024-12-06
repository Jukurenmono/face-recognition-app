import React, { useEffect, useState } from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import Link from 'next/link';

interface Record {
  id: number;
  name: string;
  age: number;
  department: string;
}

interface Detection {
  name: string;
  date: string;
  time: string;
}

const records: Record[] = [
  { id: 1, name: 'Christian Alparo', age: 20, department: 'Engineering' },
  { id: 2, name: 'Aldric Calatrava', age: 20, department: 'Marketing' },
  { id: 3, name: 'Blenchie Cuadra', age: 20, department: 'Marketing' },
  { id: 4, name: 'Christine Serdan', age: 20, department: 'Data Set' },
  { id: 5, name: 'Joey Ara Teh', age: 20, department: 'Design' },
  { id: 6, name: 'Ambala Kian', age: 20, department: 'Data Set' },
];

const RecordsPage: React.FC = () => {
  const [detections, setDetections] = useState<Detection[]>([]);

  useEffect(() => {
    const storedDetections = JSON.parse(localStorage.getItem('detections') || '[]');
    setDetections(storedDetections);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="w-full h-full bg-gray-100 rounded-lg shadow-lg flex flex-col">
        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-[#243642] text-white">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">
                  <Link href="/main">
                    <button className="bg-white text-black rounded-full px-2 py-2 text-lg">
                      <FaChevronLeft />
                    </button>
                  </Link>
                </th>
                <th className="px-4 py-2 text-center font-semibold">ID</th>
                <th className="px-4 py-2 text-center font-semibold">Name</th>
                <th className="px-4 py-2 text-center font-semibold">Age</th>
                <th className="px-4 py-2 text-center font-semibold">Department</th>
                <th className="px-4 py-2 text-center font-semibold">Timestamp</th>
              </tr>
            </thead>
            <tbody className="bg-green-50 text-black">
              {detections.map((detection, index) => {
                const record = records.find((record) => record.name === detection.name);
                
                const timestamp = `${detection.date} ${detection.time}`;

                return record ? (
                  <tr key={index} className="hover:bg-gray-100 border-t border-[#243642]">
                    <td className="px-4 py-2 text-center"></td>
                    <td className="px-4 py-2 text-center">{record.id}</td>
                    <td className="px-4 py-2 text-center">{record.name}</td>
                    <td className="px-4 py-2 text-center">{record.age}</td>
                    <td className="px-4 py-2 text-center">{record.department}</td>
                    <td className="px-4 py-2 text-center">{timestamp}</td>
                  </tr>
                ) : null;
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecordsPage;
