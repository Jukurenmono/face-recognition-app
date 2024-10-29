import React from 'react';

interface Person {
  name: string;
  age: number;
  department: string;
}

interface RecognitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  person: Person;
}

const RecognitionModal: React.FC<RecognitionModalProps> = ({ isOpen, onClose, person }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white text-black p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-semibold mb-4">Recognition Result</h2>
        <p><strong>Name:</strong> {person.name}</p>
        <p><strong>Age:</strong> {person.age}</p>
        <p><strong>Department:</strong> {person.department}</p>
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default RecognitionModal;
