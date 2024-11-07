import React from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import Link from 'next/link';

interface Record {
  id: number;
  name: string;
  age: number;
  department: string;
}

const records: Record[] = [
  { id: 1, name: 'Alparo, Christian', age: 20, department: 'Engineering' },
  { id: 2, name: 'Calatrava, Aldric', age: 20, department: 'Marketing' },
  { id: 3, name: 'Cuadra, Blenchie', age: 20, department: 'Marketing' },
  { id: 4, name: 'Serdan, Christine', age: 20, department: 'Data Set' },
  { id: 5, name: 'Teh, Ara', age: 20, department: 'Design' },
];

const RecordsPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="p-auto w-11/12 h-5/6 bg-gray-100 rounded-lg shadow-lg">
        <div className="px-4 py-4 flex items-center">
        <Link href='/dashboard'>
          <button className="bg-white text-black rounded-full px-1 py-1 text-2xl mr-2">
          <FaChevronLeft/>
          </button>
        </Link>
          <h2 className="text-xl text-black font-semibold">Records</h2>
        </div>
        
        <div className="overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-[#85A1A7]">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-white">ID</th>
                <th className="px-4 py-2 text-left font-semibold text-white">Name</th>
                <th className="px-4 py-2 text-left font-semibold text-white">Age</th>
                <th className="px-4 py-2 text-left font-semibold text-white">Department</th>
              </tr>
            </thead>
            <tbody className="text-black bg-green-50">
              {records.map((record) => (
                <tr key={record.id} className="border-t border-gray-200">
                  <td className="px-4 py-2">{record.id}</td>
                  <td className="px-4 py-2">{record.name}</td>
                  <td className="px-4 py-2">{record.age}</td>
                  <td className="px-4 py-2">{record.department}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecordsPage;
