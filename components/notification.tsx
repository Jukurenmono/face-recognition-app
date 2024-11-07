import { FaX } from 'react-icons/fa6'

const NotificationSidebar: React.FC<{ isOpen: boolean; toggleSidebar: () => void }> = ({
  isOpen,
  toggleSidebar,
}) => {
  return (
    <div
      className={`fixed inset-y-0 left-0 w-[350px] bg-[#7a949a] p-6 shadow-md z-20 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300`}
    >
      <button className="absolute bg-[#D9D9D9] rounded-full p-2 text-black top-2 right-2 font-bold" onClick={toggleSidebar}>
        <FaX/>
      </button>
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      <div>Your notifications will be shown here.</div>
    </div>
  );
};

export default NotificationSidebar;