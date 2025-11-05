"use client";

import RegisterForm from "@/components/forms/RegisterForm";
import React from "react";

function RegisterPage() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-r from-gold-100 to-indigo-50 flex flex-col items-center justify-center  sm:py-0">
      {/* <button className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-primary text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-opacity-90 transition text-sm sm:text-base ">
        <a href="/auth/login">Login Instead</a>
      </button>

      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4 sm:mb-6">
        Register
      </h1>

      <div className="w-full max-w-md bg-white rounded-lg sm:rounded-2xl shadow-md sm:shadow-xl p-4 sm:p-6"> */}
        <RegisterForm text="Create your account" role="USER" />
      {/* </div> */}
    </div>
  );
}

export default RegisterPage;