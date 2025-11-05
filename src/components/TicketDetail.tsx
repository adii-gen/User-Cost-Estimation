'use client';

import { useState } from 'react';
import { CheckCircle, AlertCircle, Clock, XCircle, Send } from 'lucide-react';
interface TicketType {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  category: string;
  createdAt: string;
  updatedAt: string;
  messages?: MessageType[];
}

interface MessageType {
  id: string;
  message: string;
  direction: 'user_to_admin' | 'admin_to_user';
  createdAt: string;
  isRead: boolean;
}
export default function TicketDetail({ 
  ticket,
  onClose 
}: { 
  ticket: TicketType;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<MessageType[]>(ticket.messages || []);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/tickets/${ticket.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: newMessage })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages([...messages, data.message]);
        setNewMessage('');
      } else {
        setError('Failed to send message');
      }
    } catch (err) {
      setError('Error sending message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">{ticket.subject}</h2>
              <div className="flex items-center mt-2 space-x-4">
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(ticket.status)}`}>
                  {ticket.status.replace('_', ' ')}
                </span>
                <span className="text-sm text-gray-500">
                  #{ticket.ticketNumber}
                </span>
                <span className="text-sm text-gray-500">
                  Created: {new Date(ticket.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.direction === 'user_to_admin' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-3/4 p-4 rounded-lg ${
                  message.direction === 'user_to_admin' 
                    ? 'bg-blue-100 text-blue-900' 
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.message}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(message.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
            <button
              onClick={handleSendMessage}
              disabled={loading || !newMessage.trim()}
              className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function getStatusColor(status: string) {
  switch(status) {
    case 'open': return 'bg-red-100 text-red-800';
    case 'in_progress': return 'bg-yellow-100 text-yellow-800';
    case 'resolved':
    case 'closed': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}
