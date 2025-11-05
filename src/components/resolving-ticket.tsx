// 'use client';

// import { useCurrentUser } from '@/hooks/auth';
// import { UploadButton } from '@/utils/uploadthing';
// import { Paperclip, X } from 'lucide-react';
// import Image from 'next/image';
// import React, { useState, useEffect, useRef } from 'react';

// interface Ticket {
//   ticketNumber: string
//   id: string;
//   subject: string;
//   description: string;
//   status: string;
//   priority: string;
//   category: string;
//   attachment: string[] | null;
// }

// interface Message {
//   id: string;
//   ticketId: string;
//   senderId: string;
//   direction: 'user_to_admin' | 'admin_to_user';
//   message: string;
//   attachments?: string[];
//   isRead: boolean;
//   createdAt: string;
//   sender?: {
//     id: string;
//     name: string;
//     profilePic?: string;
//   };
// }

// interface Props {
//   ticket: Ticket;
//   onClose: () => void;
//   onResolve?: () => void;
//   userId: string;
// }

// const ResolvingTicket: React.FC<Props> = ({ ticket, onClose, onResolve, userId }) => {
//   const [resolutionMessage, setResolutionMessage] = useState('');
//   const [priority, setPriority] = useState(ticket.priority);
//   const [status, setStatus] = useState(ticket.status);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState('');
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [loadingMessages, setLoadingMessages] = useState(true);
//   // const [activeTab, setActiveTab] = useState<'details' | 'chat'>('details');
//   const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const [newTicket, setNewTicket] = useState({
//       title: '',
//       description: '',
//       priority: 'MEDIUM',
//       category: 'TECHNICAL',
//       attachments: [] as string[]
//     });
//   // Admin attachment functionality
//   const [adminAttachments, setAdminAttachments] = useState<string[]>([]);
//   const [isUploading, setIsUploading] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);
  
//   const user = useCurrentUser();

//   // Scroll to bottom when messages update
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };
//  const handleUploadError = (error: Error) => {
//     console.error("Upload error:", error);
//     setError(`Upload failed: ${error.message}`);
//   };
//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Fetch messages on component mount
//   useEffect(() => {
//     fetchMessages();
//   }, [ticket.id]);

//   const fetchMessages = async () => {
//     try {
//       setLoadingMessages(true);
//       const response = await fetch(`/api/ticket-messages?ticketId=${ticket.id}`);
//       if (response.ok) {
//         const data = await response.json();
//         if (data.success) {
//           setMessages(data.data || []);
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching messages:', error);
//     } finally {
//       setLoadingMessages(false);
//     }
//   };
// const removeUploadedFile = (fileUrl: string) => {
//     const updatedFiles = uploadedFiles.filter(url => url !== fileUrl);
//     setUploadedFiles(updatedFiles);
//     setNewTicket({
//       ...newTicket,
//       attachments: updatedFiles
//     });
//   };
//   // const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//   //   const files = event.target.files;
//   //   if (!files || files.length === 0) return;

//   //   setIsUploading(true);
//   //   setError('');

//   //   try {
//   //     const uploadPromises = Array.from(files).map(async (file) => {
//   //       // Validate file size (5MB limit)
//   //       if (file.size > 5 * 1024 * 1024) {
//   //         throw new Error(`File ${file.name} is too large. Maximum size is 5MB.`);
//   //       }

//   //       // Validate file type
//   //       const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
//   //       if (!allowedTypes.includes(file.type)) {
//   //         throw new Error(`File type ${file.type} is not supported.`);
//   //       }

//   //       const formData = new FormData();
//   //       formData.append('file', file);
//   //       formData.append('type', 'admin_attachment');

//   //       const response = await fetch('/api/upload', {
//   //         method: 'POST',
//   //         body: formData,
//   //       });

//   //       if (!response.ok) {
//   //         throw new Error(`Failed to upload ${file.name}`);
//   //       }

//   //       const data = await response.json();
//   //       if (!data.success) {
//   //         throw new Error(data.error || `Failed to upload ${file.name}`);
//   //       }

//   //       return data.fileUrl;
//   //     });

//   //     const uploadedUrls = await Promise.all(uploadPromises);
//   //     setAdminAttachments(prev => [...prev, ...uploadedUrls]);
//   //   } catch (error) {
//   //     console.error('Error uploading files:', error);
//   //     setError(error instanceof Error ? error.message : 'Failed to upload files');
//   //   } finally {
//   //     setIsUploading(false);
//   //     if (fileInputRef.current) {
//   //       fileInputRef.current.value = '';
//   //     }
//   //   }
//   // };
// const handleUploadComplete = (res: any) => {
//     console.log("Files uploaded: ", res);
//     const fileUrls = res.map((file: any) => file.url);
//     setUploadedFiles([...uploadedFiles, ...fileUrls]);
//     setNewTicket({
//       ...newTicket,
//       attachments: [...newTicket.attachments, ...fileUrls]
//     });
//   };
//   const removeAdminAttachment = (fileUrl: string) => {
//     setAdminAttachments(prev => prev.filter(url => url !== fileUrl));
//   };

//   const getStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case 'open':
//       case 'new':
//         return 'bg-blue-100 text-blue-800 border-blue-300';
//       case 'in progress':
//       case 'working':
//         return 'bg-yellow-100 text-yellow-800 border-yellow-300';
//       case 'resolved':
//       case 'closed':
//         return 'bg-green-100 text-green-800 border-green-300';
//       case 'pending':
//         return 'bg-orange-100 text-orange-800 border-orange-300';
//       default:
//         return 'bg-gray-100 text-gray-800 border-gray-300';
//     }
//   };

//   const getPriorityColor = (priority: string) => {
//     switch (priority.toLowerCase()) {
//       case 'high':
//       case 'urgent':
//         return 'bg-red-100 text-red-800 border-red-300';
//       case 'medium':
//         return 'bg-yellow-100 text-yellow-800 border-yellow-300';
//       case 'low':
//         return 'bg-green-100 text-green-800 border-green-300';
//       default:
//         return 'bg-gray-100 text-gray-800 border-gray-300';
//     }
//   };

//   const getCategoryColor = (category: string) => {
//     switch (category.toLowerCase()) {
//       case 'bug':
//         return 'bg-red-100 text-red-800 border-red-300';
//       case 'feature':
//         return 'bg-purple-100 text-purple-800 border-purple-300';
//       case 'support':
//         return 'bg-blue-100 text-blue-800 border-blue-300';
//       case 'enhancement':
//         return 'bg-indigo-100 text-indigo-800 border-indigo-300';
//       case 'technical':
//         return 'bg-gray-100 text-gray-800 border-gray-300';
//       default:
//         return 'bg-gray-100 text-gray-800 border-gray-300';
//     }
//   };

//   const formatTime = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleTimeString('en-US', { 
//       hour: '2-digit', 
//       minute: '2-digit',
//       hour12: true 
//     });
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     const today = new Date();
//     const yesterday = new Date(today);
//     yesterday.setDate(yesterday.getDate() - 1);

//     if (date.toDateString() === today.toDateString()) {
//       return 'Today';
//     } else if (date.toDateString() === yesterday.toDateString()) {
//       return 'Yesterday';
//     } else {
//       return date.toLocaleDateString('en-US', { 
//         month: 'short', 
//         day: 'numeric',
//         year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
//       });
//     }
//   };

//   const getFileName = (url: string) => {
//     return url.split('/').pop() || 'attachment';
//   };

//   const isImageFile = (url: string) => {
//     const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
//     return imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
//   };

//   const handleSendMessage = async () => {
//     if (!resolutionMessage.trim() && adminAttachments.length === 0) {
//       setError('Please enter a message or attach a file');
//       return;
//     }

//     setIsSubmitting(true);
//     setError('');

//     try {
//       const messageResponse = await fetch('/api/ticket-messages', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           ticketId: ticket.id,
//           senderId: user?.id,
//           direction: 'admin_to_user',
//           message: resolutionMessage,
//           attachments: adminAttachments.length > 0 ? adminAttachments : undefined,
//           isRead: false,
//           updateTicket: {
//             status: status,
//             priority: priority
//           }
//         }),
//       });

//       if (!messageResponse.ok) {
//         throw new Error('Failed to send message');
//       }

//       const messageData = await messageResponse.json();
      
//       if (messageData.success) {
//         // Add new message to local state
//         const newMessage: Message = {
//           id: messageData.data.id,
//           ticketId: ticket.id,
//           senderId: user?.id || '',
//           direction: 'admin_to_user',
//           message: resolutionMessage,
//           attachments: adminAttachments.length > 0 ? adminAttachments : undefined,
//           isRead: false,
//           createdAt: new Date().toISOString(),
//           sender: {
//             id: user?.id || '',
//             name: user?.name || 'Admin',
//             // profilePic: user?.profilePic
//           }
//         };
        
//         setMessages(prev => [...prev, newMessage]);
//         setResolutionMessage('');
//         setAdminAttachments([]);
        
//         if (onResolve) onResolve();
//       } else {
//         throw new Error(messageData.error || 'Failed to send message');
//       }
//     } catch (error) {
//       console.error('Error sending message:', error);
//       setError(error instanceof Error ? error.message : 'Failed to send message');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div
//       className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-2 sm:p-4"
//       onClick={onClose}
//     >
//       <div
//         className="bg-white rounded-lg shadow-lg w-full h-full sm:max-w-xl sm:h-auto sm:max-h-[90vh] relative flex flex-col"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header - Fixed */}
//         <div className="p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
//           <button
//             onClick={onClose}
//             className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-700 text-xl z-10"
//           >
//             ×
//           </button>
         

         
//           <h2 className="text-lg sm:text-xl font-semibold text-gray-900 pr-8">
//                       Ticket #{ticket.ticketNumber}-  {ticket.subject}
//           </h2>
          
          
//           {/* Tab Navigation for All Screens */}
//           {/* <div className="mt-4">
//             <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
//               <button
//                 onClick={() => setActiveTab('details')}
//                 className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
//                   activeTab === 'details'
//                     ? 'bg-white text-blue-600 shadow-sm'
//                     : 'text-gray-500 hover:text-gray-700'
//                 }`}
//               >
//                 Details
//               </button>
//               <button
//                 onClick={() => setActiveTab('chat')}
//                 className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
//                   activeTab === 'chat'
//                     ? 'bg-white text-blue-600 shadow-sm'
//                     : 'text-gray-500 hover:text-gray-700'
//                 }`}
//               >
//                 Chat
//               </button>
//             </div>
//           </div> */}
//         </div>

//         {/* Main Content Area - Tab Based for All Screens */}
//         <div className="flex-1 flex flex-col overflow-hidden">
//           {/* Details Tab */}
//           {/* {activeTab === 'details' && ( */}
//             <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
//               {/* Title */}
              

//               {/* Description */}
//               <div>
//                 <h3 className="font-medium text-gray-900 mb-2">Description</h3>
//                 <div className="text-gray-700 text-sm bg-gray-50 p-3 rounded border max-h-32 sm:max-h-40 overflow-y-auto">
//                   {ticket.description}
//                 </div>
//               </div>

//               {/* Status, Priority, Category in one line */}
//               <div className="grid grid-cols-3 gap-2 sm:gap-4">
//                 {/* <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
//                   <select
//                     value={status}
//                     onChange={(e) => setStatus(e.target.value)}
//                     className={`px-2 py-1 text-xs rounded border ${getStatusColor(status)} w-full`}
//                     disabled={isSubmitting}
//                   >
//                     <option value="open">Open</option>
//                     <option value="pending">Pending</option>
//                     <option value="resolved">Resolved</option>
//                   </select>
//                 </div> */}
//                 {/* <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Priority</label>
//                   <select
//                     value={priority}
//                     onChange={(e) => setPriority(e.target.value)}
//                     className={`px-2 py-1 text-xs rounded border ${getPriorityColor(priority)} w-full`}
//                     disabled={isSubmitting}
//                   >
//                     <option value="low">Low</option>
//                     <option value="medium">Medium</option>
//                     <option value="high">High</option>
//                   </select>
//                 </div> */}
                
//               </div>

//               {/* Admin Message Box */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Admin Message</label>
//                 <div className="space-y-3">
//                   <textarea
//                     value={resolutionMessage}
//                     onChange={(e) => setResolutionMessage(e.target.value)}
//                     placeholder="Type your message to the user..."
//                     className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//                     disabled={isSubmitting}
//                     rows={3}
//                     onKeyDown={(e) => {
//                       if (e.key === 'Enter' && !e.shiftKey) {
//                         e.preventDefault();
//                         handleSendMessage();
//                       }
//                     }}
//                   />
                  
//                   {/* File Upload Section */}
//                   {/* <div className="space-y-2">
//                     <div className="flex items-center gap-2">
//                       <input
//                         ref={fileInputRef}
//                         type="file"
//                         multiple
//                         accept="image/*,.pdf,.doc,.docx,.txt"
//                         onChange={handleFileUpload}
//                         className="hidden"
//                         disabled={isUploading || isSubmitting}
//                       />
//                       <button
//                         type="button"
//                         onClick={() => fileInputRef.current?.click()}
//                         disabled={isUploading || isSubmitting}
//                         className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       >
//                         {isUploading ? 'Uploading...' : '📎 Attach Files'}
//                       </button>
//                       <span className="text-xs text-gray-500">
//                         Max 5MB per file (Images, PDF, DOC, TXT)
//                       </span>
//                     </div>

                    
//                     {adminAttachments.length > 0 && (
//                       <div className="space-y-2">
//                         <label className="text-xs font-medium text-gray-700">Attachments to send:</label>
//                         <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto border border-gray-200 rounded p-2">
//                           {adminAttachments.map((fileUrl, index) => (
//                             <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded border">
//                               <div className="flex items-center space-x-2 flex-1 min-w-0">
//                                 {isImageFile(fileUrl) ? (
//                                   <Image 
//                                     src={fileUrl} 
//                                     height={30} 
//                                     width={30} 
//                                     alt={`Preview ${index + 1}`}
//                                     className="w-8 h-8 rounded object-cover flex-shrink-0 cursor-pointer"
//                                     onClick={() => setSelectedImage(fileUrl)}
//                                   />
//                                 ) : (
//                                   <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
//                                     <span className="text-blue-600 text-xs">📄</span>
//                                   </div>
//                                 )}
//                                 <span className="text-xs text-gray-600 truncate">
//                                   {getFileName(fileUrl)}
//                                 </span>
//                               </div>
//                               <button
//                                 onClick={() => removeAdminAttachment(fileUrl)}
//                                 className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0 text-sm"
//                                 disabled={isSubmitting}
//                               >
//                                 ×
//                               </button>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div> */}
//                   <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     <Paperclip className="w-4 h-4 inline mr-1" />
//                     Attachments (Optional)
//                   </label>
//                   <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
//                     <UploadButton
//                       endpoint="imageUploader"
//                       onClientUploadComplete={handleUploadComplete}
//                       onUploadError={handleUploadError}
//                     />
//                     {/* <p className="text-xs text-gray-500 mt-2 text-center">
//                       Upload screenshots, documents, or other files to help describe your issue
//                     </p> */}
//                   </div>

//                   {/* Display uploaded files */}
//                   {uploadedFiles.length > 0 && (
//                     <div className="mt-4">
//                       <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files:</h4>
//                       <div className="space-y-2">
//                         {uploadedFiles.map((fileUrl, index) => (
//                           <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
//                             <div className="flex items-center min-w-0">
//                               <Paperclip className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
//                               <a 
//                                 href={fileUrl} 
//                                 target="_blank" 
//                                 rel="noopener noreferrer"
//                                 className="text-sm text-blue-600 hover:underline truncate"
//                               >
//                                 <img src={fileUrl} alt="" className="max-w-full h-auto max-h-20 object-contain" />
//                               </a>
//                             </div>
//                             <button
//                               type="button"
//                               onClick={() => removeUploadedFile(fileUrl)}
//                               className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0"
//                             >
//                               <X className="w-4 h-4" />
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>


//                   <button
//                     onClick={handleSendMessage}
//                     disabled={(!resolutionMessage.trim() && adminAttachments.length === 0) || isSubmitting}
//                     className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                   >
//                     {isSubmitting ? 'Sending...' : 'Send Message'}
//                   </button>
//                   {error && (
//                     <div className="text-sm text-red-500">
//                       {error}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* User Attachments */}
//               {ticket.attachment && ticket.attachment.length > 0 && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">User Attachments</label>
//                   <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 max-h-60 overflow-y-auto border border-gray-200 rounded p-2">
//                     {ticket.attachment.map((item, index) => (
//                       <div key={index} className="aspect-square sm:aspect-auto flex-shrink-0">
//                         <Image 
//                           src={item} 
//                           height={200} 
//                           width={200} 
//                           alt={`Attachment ${index + 1}`}
//                           className="w-full h-full sm:w-auto sm:h-auto rounded border border-gray-300 object-cover cursor-pointer hover:opacity-80 transition-opacity"
//                           onClick={() => setSelectedImage(item)}
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
        

//           {/* Chat Tab */}
        
//         </div>
//       </div>

//       {/* Image Modal */}
//       {selectedImage && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-[60]"
//           onClick={() => setSelectedImage(null)}
//         >
//           <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center p-4">
//             <button
//               onClick={() => setSelectedImage(null)}
//               className="absolute top-4 right-4 text-white hover:text-gray-300 text-3xl z-10 bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
//             >
//               ×
//             </button>
//             <Image
//               src={selectedImage}
//               alt="Full size attachment"
//               width={800}
//               height={600}
//               className="max-w-full max-h-full object-contain rounded"
//               onClick={(e) => e.stopPropagation()}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ResolvingTicket;
'use client';

import { useCurrentUser } from '@/hooks/auth';
import { UploadButton } from '@/utils/uploadthing';
import { Paperclip, X } from 'lucide-react';
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';

interface Ticket {
  ticketNumber: string
  id: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  attachment: string[] | null;
}

interface Message {
  id: string;
  ticketId: string;
  senderId: string;
  direction: 'user_to_admin' | 'admin_to_user';
  message: string;
  attachments?: string[];
  isRead: boolean;
  createdAt: string;
  sender?: {
    id: string;
    name: string;
    profilePic?: string;
  };
}

interface Props {
  ticket: Ticket;
  onClose: () => void;
  onResolve?: () => void;
  userId: string;
}

const ResolvingTicket: React.FC<Props> = ({ ticket, onClose, onResolve, userId }) => {
  const [resolutionMessage, setResolutionMessage] = useState('');
  const [priority, setPriority] = useState(ticket.priority);
  const [status, setStatus] = useState(ticket.status);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [newTicket, setNewTicket] = useState({
      title: '',
      description: '',
      priority: 'MEDIUM',
      category: 'TECHNICAL',
      attachments: [] as string[]
    });
  const [adminAttachments, setAdminAttachments] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const user = useCurrentUser();

  // Scroll to bottom when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
 const handleUploadError = (error: Error) => {
    console.error("Upload error:", error);
    setError(`Upload failed: ${error.message}`);
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages();
  }, [ticket.id]);

  const fetchMessages = async () => {
    try {
      setLoadingMessages(true);
      const response = await fetch(`/api/ticket-messages?ticketId=${ticket.id}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMessages(data.data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

const removeUploadedFile = (fileUrl: string) => {
    const updatedFiles = uploadedFiles.filter(url => url !== fileUrl);
    setUploadedFiles(updatedFiles);
    setNewTicket({
      ...newTicket,
      attachments: updatedFiles
    });
  };

  // Handle file input change for the small button
  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    // Convert files to URLs and add to uploadedFiles
    Array.from(files).forEach(file => {
      const url = URL.createObjectURL(file);
      setUploadedFiles(prev => [...prev, url]);
      setNewTicket(prev => ({
        ...prev,
        attachments: [...prev.attachments, url]
      }));
    });
  };

const handleUploadComplete = (res: any) => {
    console.log("Files uploaded: ", res);
    const fileUrls = res.map((file: any) => file.url);
    setUploadedFiles([...uploadedFiles, ...fileUrls]);
    setNewTicket({
      ...newTicket,
      attachments: [...newTicket.attachments, ...fileUrls]
    });
  };
  const removeAdminAttachment = (fileUrl: string) => {
    setAdminAttachments(prev => prev.filter(url => url !== fileUrl));
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
      case 'new':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'in progress':
      case 'working':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'resolved':
      case 'closed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'bug':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'feature':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'support':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'enhancement':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'technical':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const getFileName = (url: string) => {
    return url.split('/').pop() || 'attachment';
  };

  const isImageFile = (url: string) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  const handleSendMessage = async () => {
    if (!resolutionMessage.trim() && adminAttachments.length === 0) {
      setError('Please enter a message or attach a file');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const messageResponse = await fetch('/api/ticket-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticketId: ticket.id,
          senderId: user?.id,
          direction: 'admin_to_user',
          message: resolutionMessage,
          attachments: adminAttachments.length > 0 ? adminAttachments : undefined,
          isRead: false,
          updateTicket: {
            status: status,
            priority: priority
          }
        }),
      });

      if (!messageResponse.ok) {
        throw new Error('Failed to send message');
      }

      const messageData = await messageResponse.json();
      
      if (messageData.success) {
        // Add new message to local state
        const newMessage: Message = {
          id: messageData.data.id,
          ticketId: ticket.id,
          senderId: user?.id || '',
          direction: 'admin_to_user',
          message: resolutionMessage,
          attachments: adminAttachments.length > 0 ? adminAttachments : undefined,
          isRead: false,
          createdAt: new Date().toISOString(),
          sender: {
            id: user?.id || '',
            name: user?.name || 'Admin',
          }
        };
        
        setMessages(prev => [...prev, newMessage]);
        setResolutionMessage('');
        setAdminAttachments([]);
        
        if (onResolve) onResolve();
      } else {
        throw new Error(messageData.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error instanceof Error ? error.message : 'Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full h-full sm:max-w-xl sm:h-auto sm:max-h-[90vh] relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed */}
        <div className="p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-700 text-xl z-10"
          >
            ×
          </button>
         
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 pr-8">
                      Ticket #{ticket.ticketNumber}-  {ticket.subject}
          </h2>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Description */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                <div className="text-gray-700 text-sm bg-gray-50 p-3 rounded border max-h-32 sm:max-h-40 overflow-y-auto">
                  {ticket.description}
                </div>
              </div>

              {/* Status, Priority, Category in one line */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                
              </div>

              {/* Admin Message Box */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Solution:-</label>
                <div className="space-y-3">
                  <textarea
                    value={resolutionMessage}
                    onChange={(e) => setResolutionMessage(e.target.value)}
                    placeholder="Type your message to the user..."
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    disabled={isSubmitting}
                    rows={3}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  
                  <div className="">
                    <div className='flex justify-between'>
                    <label className="flex text-sm justify-between font-medium text-gray-700 mb-2">
                     
                      Attachments (Optional)
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*,.pdf,.doc,.docx"
                        onChange={handleFileInputChange}
                        className="hidden"
                      />
                      
                    </label>
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className=" flex justify-between"
                      >
                        <Paperclip className="w-4 h-4" />
                      </button>
                      </div>
                    {/* <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <UploadButton
                        endpoint="imageUploader"
                        onClientUploadComplete={handleUploadComplete}
                        onUploadError={handleUploadError}
                      />
                    </div> */}

                    {/* Display uploaded files */}
                    {uploadedFiles.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files:</h4>
                        <div className="space-y-2">
                          {uploadedFiles.map((fileUrl, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                              <div className="flex items-center min-w-0">
                                <Paperclip className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                                <a 
                                  href={fileUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:underline truncate"
                                >
                                  <img src={fileUrl} alt="" className="max-w-full h-auto max-h-20 object-contain" />
                                </a>
                              </div>
                              <button
                                ref={buttonRef}
                                type="button"
                                onClick={() => removeUploadedFile(fileUrl)}
                                className="inline-flex items-center justify-center h-8 w-8 p-1.5 rounded bg-red-100 hover:bg-red-200 text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ml-2 flex-shrink-0"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleSendMessage}
                    disabled={(!resolutionMessage.trim() && adminAttachments.length === 0) || isSubmitting}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                  {error && (
                    <div className="text-sm text-red-500">
                      {error}
                    </div>
                  )}
                </div>
              </div>

              {/* User Attachments */}
              {ticket.attachment && ticket.attachment.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">User Attachments</label>
                  <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 max-h-60 overflow-y-auto border border-gray-200 rounded p-2">
                    {ticket.attachment.map((item, index) => (
                      <div key={index} className="aspect-square sm:aspect-auto flex-shrink-0">
                        <Image 
                          src={item} 
                          height={200} 
                          width={200} 
                          alt={`Attachment ${index + 1}`}
                          className="w-full h-full sm:w-auto sm:h-auto rounded border border-gray-300 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => setSelectedImage(item)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-[60]"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center p-4">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 text-3xl z-10 bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
            >
              ×
            </button>
            <Image
              src={selectedImage}
              alt="Full size attachment"
              width={800}
              height={600}
              className="max-w-full max-h-full object-contain rounded"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ResolvingTicket;