import { FaX } from 'react-icons/fa6';
import { useEffect, useState } from 'react';

interface DetectionRecord {
  name: string;
  time: string;
}

const NotificationSidebar: React.FC<{ isOpen: boolean; toggleSidebar: () => void }> = ({
  isOpen,
  toggleSidebar,
}) => {
  const [records, setRecords] = useState<DetectionRecord[]>([]);

  useEffect(() => {
    const storedDetections = JSON.parse(localStorage.getItem('detections') || '[]');
    setRecords(storedDetections);
  }, []);

  return (
    <div
      className={`fixed inset-y-0 left-0 w-[350px] bg-[#7a949a] p-6 shadow-md z-20 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300`}
    >
      <button
        className="absolute bg-[#D9D9D9] rounded-full p-2 text-black top-2 right-2 font-bold"
        onClick={toggleSidebar}
      >
        <FaX />
      </button>
      <h2 className="text-xl font-bold mb-4">Notifications</h2>

      <div className="overflow-y-auto max-h-[70vh]">
        <table className="min-w-full">
          <thead className="bg-[#85A1A7]">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-white">Name</th>
              <th className="px-4 py-2 text-left font-semibold text-white">Time</th>
            </tr>
          </thead>
          <tbody className="text-black bg-green-50">
            {records.map((record, index) => (
              <tr key={index} className="border-t border-gray-200">
                <td className="px-4 py-2">{record.name}</td>
                <td className="px-4 py-2">{record.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NotificationSidebar;
