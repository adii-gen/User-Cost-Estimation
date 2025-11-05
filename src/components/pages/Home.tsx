"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Card from "../shared/Card";

interface Vendor {
  id: number;
  companyName: string;
  description: string;
  img: string;
}

const Hero = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetch("/api/get/vendors");
        const data = await response.json();
        const transformedData = data.map((vendor: any) => ({
          id: vendor.id,
          companyName: vendor.companyName,
          description:
            vendor.description ||
            "This vendor specializes in providing quality products and services.",
          img: vendor.img || "/default-image.jpg", // Fallback image if not provided
        }));
        setVendors(transformedData);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    };

    fetchVendors();
  }, []);

  return (
    <div className="flex flex-col">
      <div className="bg-blue-50">
        <div className="flex justify-center">
          <h1 className="text-navy-900 text-3xl font-serif mx-auto py-16">
            Explore Vendors
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-8 lg:px-24 pb-24">
          {vendors.length > 0 ? (
            vendors.map((vendor) => (
              <div key={vendor.id}>
                <Link href={`/vendor/${vendor.id}`}>
                  <Card
                    img={vendor.img}
                    heading={vendor.companyName}
                    dis={vendor.description}
                  />
                </Link>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-3">
              Loading vendors...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
