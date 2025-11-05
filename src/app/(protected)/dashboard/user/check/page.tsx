// 'use client';
// import React, { useState } from 'react';
// import { Search, Home, ClipboardList, User, Phone } from 'lucide-react';

// const SiteInspectorHome = () => {
//   const [searchTerm, setSearchTerm] = useState('');

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
//         <div className="px-4 py-4">
//           <h1 className="text-xl font-bold text-gray-900">Site Inspector Home</h1>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="px-4 py-4">
//         {/* Sales Inspector Section */}
//         <div className="mb-6">
//           <h2 className="text-lg font-semibold text-gray-900 mb-2">Sales Inspector</h2>
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//             <h3 className="text-md font-medium text-gray-900 mb-3">Inquiry for Inspection</h3>
            
//             {/* Search Bar */}
//             <div className="relative mb-4">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Search className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="Search Inquiry..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>

//             {/* Form Fields */}
//             <div className="space-y-3">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Customer name</label>
//                 <input
//                   type="text"
//                   className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
//                 <input
//                   type="text"
//                   className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//                 <input
//                   type="password"
//                   className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">ID:JMMYYYY</label>
//                 <input
//                   type="text"
//                   className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
//                 <input
//                   type="tel"
//                   className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Navigation */}
//       <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb">
//         <div className="flex justify-around items-center px-4 py-3">
//           <button className="flex flex-col items-center text-blue-600">
//             <Home className="h-6 w-6" />
//             <span className="text-xs mt-1">Home</span>
//           </button>
//           <button className="flex flex-col items-center text-gray-500">
//             <ClipboardList className="h-6 w-6" />
//             <span className="text-xs mt-1">Inspections</span>
//           </button>
//           <button className="flex flex-col items-center text-gray-500">
//             <User className="h-6 w-6" />
//             <span className="text-xs mt-1">Profile</span>
//           </button>
//           <button className="flex flex-col items-center text-gray-500">
//             <Phone className="h-6 w-6" />
//             <span className="text-xs mt-1">Contact</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SiteInspectorHome;

'use client';
import React, { useState } from 'react';
import { Search, Home, ClipboardList } from 'lucide-react';

const SiteInspector = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">Site Inspector</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-4">
        {/* Sales Inspector Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Sales Inspector</h2>
          
          {/* Search Bar */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search Inspections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Form Fields */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SIYYYY-MM-DD-##</label>
              <input
                type="text"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
              <input
                type="text"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
              <input
                type="text"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb">
        <div className="flex justify-around items-center px-4 py-3">
          <button className="flex flex-col items-center text-blue-600">
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">Home</span>
          </button>
          <button className="flex flex-col items-center text-gray-500">
            <ClipboardList className="h-6 w-6" />
            <span className="text-xs mt-1">Inspections</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SiteInspector;