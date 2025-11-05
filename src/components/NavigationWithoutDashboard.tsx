"use client";

import { Search, TicketIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import FoodCarousel from "./shared/Banner";
import { useCurrentRole, useCurrentUser } from "@/hooks/auth";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

interface Category {
  id: string;
  name: string;
  logo: string;
}

export default function NavBarWithoutDasboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";
  const carouselData = [
    {
      id: "ba8c068c-4adb-42f6-bf6b-bd09df4f4991",
      image: "/gym.jpg",
      contactNo: "+1 234-567-8901",
    },
    {
      id: "a7055a6c-d5e3-4d40-986b-449a2111fb8d",
      image: "/gym2.jpg",
      contactNo: "+1 234-567-8902",
    },
    {
      id: "ba8c068c-4adb-42f6-bf6b-bd09df4f4991",
      image: "/gym.jpg",
      contactNo: "+1 234-567-8902",
    },
    {
      id: "a7055a6c-d5e3-4d40-986b-449a2111fb8d",
      image: "/gym2.jpg",
      contactNo: "+1 234-567-8902",
    },
    // Add as many items as you need
  ];

  // Category state
  const [activeTab, setActiveTab] = useState<"services" | "products">(
    "services"
  );
  const [services, setServices] = useState<Category[]>([]);
  const [products, setProducts] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredItems, setFilteredItems] = useState<Category[]>([]);
  const [profile, setProfile] = useState<boolean>(true);
  const role = useCurrentRole();
  const user = useCurrentUser();
  const [showAll, setShowAll] = useState(false);
  const initialItemsCount = {
    mobile: 4, // 2 columns × 2 rows for mobile
    tablet: 6, // 3 columns × 2 rows for tablet
    desktop: 6, // 6 columns × 1 row for desktop
  };


  // If profile is false, don't render anything
  // if (!profile) return null;

  useEffect(() => {
    const checkVendorProfile = async () => {
      if (role === "USER") {
        try {
          const response = await fetch(`/api/users?id=${user?.id}`);
          const data = await response.json();

          if (data && data.length > 0) {
            const vendorData = data[0];

            if (vendorData.vendorProfileId === null) {
              setProfile(false);
            } else if (vendorData.vendorProfileId) {
              setProfile(true);
            }
          }
        } catch (error) {
          console.error("Error fetching vendor data:", error);
          // Handle error case - redirect to a default route or show error message
        }
      }
    };

    checkVendorProfile();
  }, [role]);

  useEffect(() => {}, [searchTerm, services, products, activeTab]);

  const allItems = activeTab === "services" ? services : products;

  const handleLogout = async () => {
    await signOut({ redirectTo: "/auth/login" });
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <div className="min-w-full z-50">
      {/* Navigation Bar */}
      <nav className="bg-white ">
        <div className="flex items-center justify-between p-4 sm:p-0 ">
          {/* Logo Section */}
          <div className="flex items-center space-x-2 sm:hidden">
            <Link href="/dashboard">
              <div className="flex space-x-1">
                <Image src="/icons.png" height={40} width={40} alt="Logo" />
                {/* <TicketIcon height={40} width={40} className="text-blue-600" /> */}
                <h1 className="text-blue-900 text-3xl font-bold">
                  TMS
                </h1>
              </div>
            </Link>
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-6 ">
            {!isAuthenticated ? (
              <div className=" hidden">
                <Link href="/auth/login">
                  <button className="hover:text-black">Sign In</button>
                </Link>
                <Link href="/auth/register">
                  <button className="px-4 py-2 rounded-full border border-black text-black hover:bg-black-foreground">
                    Join now
                  </button>
                </Link>
              </div>
            ) : (
              <div className="relative hidden">
                <button
                  onClick={() => setDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-black-foreground"
                >
                  <span className="text-black">{session?.user?.name}</span>
                  <svg
                    className={`w-4 h-4 text-black transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 w-48 z-50 bg-white rounded-md shadow-lg py-1">
                    <Link
                      href="/dashboard/profile"
                      onClick={(e) => {
                        setDropdownOpen(!isDropdownOpen);
                      }}
                    >
                      {/* <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-black-light">
                        Profile
                      </button> */}
                    </Link>
                    <form action={handleLogout}>
                      <button
                        className="block w-full text-left px-4 py-2  text-gray-700 hover:bg-black-light"
                        disabled={isLoading}
                      >
                        Sign Out {isLoading ? "..." : ""}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-black focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    mobileMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <>
            {/* Overlay to close the menu when clicking outside */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Sliding menu from right */}
            <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 md:hidden transform transition-transform duration-300 ease-in-out">
              <div className="flex flex-col h-full">
                {/* Menu header with close button */}
                <div className="flex items-center justify-between p-4 border-b">
                  <div className=" flex space-x-1 items-center">
                    {/* <Image src="/logo.jpg" height={40} width={40} alt="Logo" /> */}
                    <span className="font-medium text-lg text-black">
                      TMS
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Menu content */}
                <div className="flex-1 overflow-y-auto p-4">
                  {!isAuthenticated ? (
                    <div className="space-y-4">
                      <Link href="/auth/login">
                        <button className="w-full text-left py-3 border-b border-gray-100 flex items-center">
                          <svg
                            className="w-5 h-5 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                            />
                          </svg>
                          Sign In
                        </button>
                      </Link>
                      <Link href="/auth/register">
                        <button className="w-full text-left py-3 border-b border-gray-100 flex items-center">
                          <svg
                            className="w-5 h-5 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                            />
                          </svg>
                          Join now
                        </button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="py-3 border-b border-gray-100">
                        <p className="text-black font-medium">
                          {session?.user?.name}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {session?.user?.email}
                        </p>
                      </div>
                      <Link
                        href="/dashboard/profile"
                        onClick={(e) => {
                          setMobileMenuOpen(!mobileMenuOpen);
                        }}
                      >
                        {/* <button className="w-full text-left py-3 border-b border-gray-100 flex items-center">
                          <svg
                            className="w-5 h-5 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                          </svg>
                          Profile
                        </button> */}
                      </Link>
                      <form action={handleLogout}>
                        <button
                          className="w-full text-left py-3 border-b border-gray-100 flex items-center text-red-500"
                          disabled={isLoading}
                        >
                          <svg
                            className="w-5 h-5 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          Sign Out {isLoading ? "..." : ""}
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </nav>

      {/* Category Grid Section */}

      {/* <FoodCarousel items={carouselData} /> */}

    </div>
  );
}
