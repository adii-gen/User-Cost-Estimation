import Image from "next/image";
import Link from "next/link";
import React from "react";
export default function Navbar() {
  return (
    <nav className="bg-[#1B3A60] text-white p-2  shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div>
        <Image
        src="/college/logo.jpeg"
        alt="Logo"
        width={40}
        height={40}
        className=" rounded-full"
        />
        <h1 className="text-red-500 font-bold text-[8px] px-2 pt-1">PIMS</h1>
        </div>
        {/* <div className="text-xl font-bold">Uniform Management System</div> */}
        {/* <div className="hidden md:flex space-x-4">
          <a href="#" className="hover:text-gray-300">Home</a>
          <a href="#" className="hover:text-gray-300">Courses</a>
          <a href="#" className="hover:text-gray-300">Pages</a>
          <a href="#" className="hover:text-gray-300">Blog</a>
        </div> */}
        <div className="flex items-center space-x-4">
          {/* <Link href="/auth/register">
            {" "}
            <button className="bg-[#1B3A60] text-white px-3 py-1 rounded">
              Register
            </button>
          </Link> */}
          {/* <Link href="/auth/login">
            <button className="bg-[#1B3A60] text-white px-3 py-1 rounded ">
              Login
            </button>
          </Link> */}
        </div>
      </div>
    </nav>
  );
}
