// types.ts
export interface CarouselItem {
  id: string;
  image: string;
  contactNo: string;
}

// FoodCarousel.tsx
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FoodCarouselProps {
  items: CarouselItem[];
  autoRotateInterval?: number;
  height?: string;
}

const FoodCarousel: React.FC<FoodCarouselProps> = ({ 
  items = [], 
  autoRotateInterval = 3000,
  height = "h-[150px]"
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    if (items.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex: number) => 
        prevIndex === items.length - 1 ? 0 : prevIndex + 1
      );
    }, autoRotateInterval);

    return () => clearInterval(timer);
  }, [items.length, autoRotateInterval]);

  const handleImageClick = (id: string): void => {
    router.push(`/vendor/${id}`);
  };

  const handleDotClick = (index: number): void => {
    setCurrentIndex(index);
  };

  return (
    <div className={`relative ${height} w-full overflow-hidden group`}>
      {items.map((item: CarouselItem, index: number) => (
        <div
          key={`carousel-item-${index}`}
          className="absolute w-full h-full transition-transform duration-500 ease-out cursor-pointer"
          style={{
            transform: `translateX(${100 * (index - currentIndex)}%)`,
          }}
          onClick={() => handleImageClick(item.id)}
          role="button"
          tabIndex={0}
          aria-label={`Slide ${index + 1} of ${items.length}`}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleImageClick(item.id);
            }
          }}
        >
          <div className="relative w-full h-full">
            <Image
              src={item.image}
              alt={`Carousel image ${index + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              className="object-cover"
              quality={75}
            />
          </div>
          
          {/* Contact overlay */}
          <div 
            className="absolute bottom-0 left-0 right-0 bg-black/70 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label={`Contact number: ${item.contactNo}`}
          >
            <div className="flex items-center justify-center text-white gap-2">
              <Phone size={16} aria-hidden="true" />
              <span>{item.contactNo}</span>
            </div>
          </div>
        </div>
      ))}
      
      {/* Navigation dots */}
      <div 
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2"
        role="tablist"
        aria-label="Carousel navigation"
      >
        {items.map((_, index: number) => (
          <button
            key={`carousel-dot-${index}`}
            className={`w-2 h-2 rounded-full transition-colors ${
              currentIndex === index ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => handleDotClick(index)}
            role="tab"
            aria-selected={currentIndex === index}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default FoodCarousel;