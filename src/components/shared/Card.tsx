"use client"
import React from 'react';

const truncateDescription = (description: string, maxWords: number) => {
  const words = description.split(' ');
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(' ') + '...';
  }
  return description;
};

const Card = ({ img, heading, dis }: any) => {
  const truncatedDis = truncateDescription(dis, 15);

  return (
    <div className="max-w-sm rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
      <div className="relative h-48">
        <img src={img} alt={heading} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-xl mb-2">{heading}</h3>
        <p className="text-gray-600">{truncatedDis}</p>
      </div>
    </div>
  );
};

export default Card;
