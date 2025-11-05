"use client"
import React from "react";
import Image from "next/image";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

interface ContactCardProps {
  businessOpeningDays: string[];
  city: string;
  companyName: string;
  headquartersAddress: string;
  id: string;
  logo: string;
  pincode: string;
  primaryContactEmail: string;
  primaryContactName: string;
  primaryContactPhone: string;
  state: string;
  whatsappnumber: string;
}

const ContactCard: React.FC<any> = ({
  businessOpeningDays,
  city,
  companyName,
  headquartersAddress,
  logo,
  pincode,
  primaryContactEmail,
  primaryContactName,
  primaryContactPhone,
  state,
  whatsappnumber,
}) => {
  const handleCall = () => {
    window.location.href = `tel:${primaryContactPhone}`;
  };

  const handleMail = () => {
    window.location.href = `mailto:${primaryContactEmail}`;
  };

  const handleWhatsapp = () => {
    window.location.href = `https://wa.me/${whatsappnumber}`;
  };

  return (
    <div className="w-full md:w-2/3 lg:w-1/3 mx-auto border border-gray-200 p-8 sticky top-5 rounded-xl bg-white shadow-lg mt-8 md:mt-0 transition-all duration-300 hover:shadow-2xl">
      {/* Header Section with Logo and Name */}
      <div className="flex flex-col md:flex-row items-center md:space-x-6 mb-8">
        <div className="relative w-[100px] h-[100px]">
          <Image
            src={logo || '/api/placeholder/100/100'}
            alt={`${companyName} Logo`}
            fill
            sizes="100px"
            className="rounded-full ring-4 ring-blue-50 object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/api/placeholder/100/100';
            }}
          />
          <div className="absolute -bottom-2 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
        </div>
        <div className="text-center md:text-left mt-4 md:mt-0">
          <h2 className="font-bold text-2xl text-gray-800 mb-1">{companyName}</h2>
          <p className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full inline-block">
            {primaryContactName}
          </p>
        </div>
      </div>

      {/* Contact Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleCall}
          className="w-full flex items-center space-x-3 bg-gradient-to-r from-green-50 to-white p-4 rounded-xl hover:from-green-100 transition-all duration-300 group"
        >
          <div className="bg-green-500 p-2 rounded-lg text-white group-hover:scale-110 transition-transform duration-300">
            <Phone className="h-5 w-5" />
          </div>
          <span className="font-medium text-gray-700">{primaryContactPhone}</span>
        </button>

        <button
          onClick={handleMail}
          className="w-full flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-white p-4 rounded-xl hover:from-blue-100 transition-all duration-300 group"
        >
          <div className="bg-blue-500 p-2 rounded-lg text-white group-hover:scale-110 transition-transform duration-300">
            <Mail className="h-5 w-5" />
          </div>
          <span className=" font-medium  text-gray-700 break-all">{primaryContactEmail}</span>
        </button>

        <button
          onClick={handleWhatsapp}
          className="w-full flex items-center space-x-3 bg-gradient-to-r from-emerald-50 to-white p-4 rounded-xl hover:from-emerald-100 transition-all duration-300 group"
        >
          <div className="bg-emerald-500 p-2 rounded-lg text-white group-hover:scale-110 transition-transform duration-300">
            <FaWhatsapp className="h-5 w-5" />
          </div>
          <span className="font-medium text-gray-700">{whatsappnumber}</span>
        </button>
      </div>

      {/* Footer Info */}
      <div className="mt-8 space-y-4">
        <div className="flex items-start space-x-3 text-gray-600">
          <MapPin className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
          <p className="text-sm">
            {headquartersAddress}, {city}, {state}, {pincode}
          </p>
        </div>
        
        <div className="flex items-start space-x-3 text-gray-600">
          <Clock className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium mb-1">Business Hours</p>
            <p className="text-sm bg-gray-50 px-3 py-1 rounded-lg inline-block">
              {businessOpeningDays?.join(", ") || "Not specified"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;