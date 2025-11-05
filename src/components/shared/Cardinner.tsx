// // import React from 'react';
// // import { Play } from 'lucide-react';

// export default function CareersPage() {
//   const stats = [
//     { label: 'INDUSTRY', value: 'Consumer Goods & Services: Fashion & Retail' },
//     { label: 'LOCATION', value: 'Austin, TX' },
//     { label: 'SIZE', value: '1,001-5,000 employees' },
//     { label: 'PERKS AND BENEFITS', value: 'Health & Wellness + more' }
//   ];

//   const employees = [
//     {
//       name: 'Zoete Peludo',
//       title: 'Wholesale Marketing Manager',
//       image: '/ashu.jpeg'
//     },
//     {
//       name: 'Omar De Los Santos',
//       title: 'Point Analytics Distribution Center',
//       image: '/image.jpg'
//     },
//     {
//       name: 'Cheryl Mills Knight',
//       title: 'VP Brand & Strategic Pipeline',
//       image: '/img.jpg'
//     }
//   ];

//   return (
//     <div className=" mx-auto px-4 py-8 ">
//       {/* Header */}
//       <div className="px-24  ">
//         <h1 className="text-3xl font-bold mb-4">Kendra Scott</h1>
//         <p className="text-gray-600 my-7">
//           Kendra Scott is a beloved lifestyle brand of big dreams, colorful
//           confidence, and inspired design.
//         </p>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-24 mb-12">
//         {stats.map((stat, index) => (
//           <div key={index} className="bg-gray-50 p-4 rounded-lg">
//             <h3 className="text-sm font-semibold text-gray-500 mb-2">
//               {stat.label}
//             </h3>
//             <p className="text-sm">{stat.value}</p>
//           </div>
//         ))}
//       </div>

//       {/* Store Image Section */}
//       <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
//         <div className="flex flex-col md:flex-row">
//           <div className="md:w-1/2 relative">
//             <img
//               src="/img.jpg"
//               alt="Office hallway"
//               className="w-full h-full object-cover"
//             />
//             <button className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded shadow hover:bg-gray-50 transition-colors">
//               VIEW SLIDESHOW
//             </button>
//           </div>
//           <div className="md:w-1/2 p-6 space-y-4">
//             <div className="flex justify-end">
//               <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors">
//                 START YOUR JOURNEY
//               </button>
//             </div>

//             <h1 className="text-2xl font-bold text-gray-800">
//               Working at Equity Lifestyle Properties
//             </h1>

//             <h2 className="text-xl font-semibold text-gray-700">
//               Your Journey Begins with Equity Lifestyle Properties
//             </h2>

//             <p className="text-gray-600 leading-relaxed">
//               Throughout its{" "}
//               <a href="#" className="text-blue-600 hover:underline">
//                 hundreds of properties
//               </a>{" "}
//               across North America, ELS works to create a comfortable and
//               welcoming environment for everyone—residents, guests, and
//               employees too. With a culture of recognition and reputation for
//               excellence, ELS teammates are empowered to take ownership in their
//               job and make a difference. ELS is a place where talent is
//               recognized and internal growth is promoted, making it an ideal
//               organization in which to develop a long and successful career.
//               Let&apos;s start your new journey today!
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Navigation */}
//       <div className="flex justify-center space-x-8 my-12">
//         {["About", "Offices", "Jobs"].map((item) => (
//           <button
//             key={item}
//             className="text-gray-600 hover:text-gray-900 pb-2 border-b-2 border-transparent hover:border-yellow-400"
//           >
//             {item}
//           </button>
//         ))}
//       </div>

// //       {/* Video Section */}
// //       {/* <div className="relative h-64 md:h-96 bg-gray-100 mb-12 rounded-lg overflow-hidden">
// //         <div className="absolute inset-0 flex items-center justify-center">
// //           <img
// //             src="/api/placeholder/1200/600"
// //             alt="Video Thumbnail"
// //             className="w-full h-full object-cover"
// //           />
// //           <div className="absolute inset-0 bg-black bg-opacity-30" />
// //           <div className="absolute text-center text-white">
// //             <div className="flex flex-col items-center">
// //               <div className="mb-4">
// //                 <Play size={48} className="text-white" />
// //               </div>
// //               <h2 className="text-2xl font-bold mb-2">Inside the offices of...</h2>
// //               <img
// //                 src="/api/placeholder/200/50"
// //                 alt="Kendra Scott Logo"
// //                 className="h-8"
// //               />
// //             </div>
// //           </div>
// //         </div>
// //       </div> */}

//       {/* Employee Section */}
//       <div>
//         <h2 className="text-2xl font-bold mb-8 text-center">
//           Meet Kendra Scott&apos;s Employees
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {employees.map((employee, index) => (
//             <div key={index} className="text-center">
//               <div className="mb-4">
//                 <img
//                   src={employee.image}
//                   alt={employee.name}
//                   className="w-32 h-32 rounded-full mx-auto"
//                 />
//               </div>
//               <h3 className="font-bold mb-2">{employee.name}</h3>
//               <p className="text-gray-600 mb-4">{employee.title}</p>
//               <button className="bg-teal-500 text-white px-4 py-2 rounded-full text-sm">
//                 LEARN MORE
//               </button>
//             </div>
//           ))}
//         </div>
//         <div className="text-center mt-8">
//           <button className="text-teal-500 font-semibold">SHOW MORE →</button>
//         </div>
//       </div>
//     </div>
//   );
// }