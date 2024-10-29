import React from 'react';

const Records = () => {
  const data = [
    { id: 101, name: 'Alparo, Christian Lorrence', age: 20, department: 'System Maintainance' },
    { id: 102, name: 'Teh, Joey Ara', age: 20, department: 'Media and Graphics' },
    { id: 103, name: 'Cuadra, Blenchie Jean', age: 20, department: 'Program Management' },
    { id: 104, name: 'Serdan, Christine Mae', age: 20, department: 'Data Management'}
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-500">
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Age</th>
            <th className="px-4 py-2 text-left">Department</th>
          </tr>
        </thead>
        <tbody>
          {data.map((person) => (
            <tr key={person.id} className="border-b text-black">
              <td className="px-4 py-2">{person.id}</td>
              <td className="px-4 py-2">{person.name}</td>
              <td className="px-4 py-2">{person.age}</td>
              <td className="px-4 py-2">{person.department}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Records;
