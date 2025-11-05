"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Link from "next/link";

const Navigation = () => {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";
  const user = session?.user;
  console.log("data", user);
  const handleLogout = async () => {
    await signOut({ redirectTo: "/auth/login" });
  };

  return (
    <div className="min-w-full">
      <nav className="flex items-center justify-between p-4 bg-white shadow-md">
        {/* Logo Section */}
        <div className="flex items-center space-x-2">
          <Link href="/">
            <img src="/logo.png" alt="The Muse Logo" className="h-10" />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 px-20">
          {!isAuthenticated ? (
            <>
              <Link href="/auth/register">
                <button className="px-4 py-2 rounded border border-x-primary-foreground text-primary hover:bg-primary-foreground">
                  Register
                </button>
              </Link>
              <Link href="/auth/login">
                <button className="hover:text-primary">Sign In</button>
              </Link>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-primary-foreground focus:outline-none"
                >
                  {session ? (
                    <span className="text-primary">{session?.user?.name}</span> // Safe access of session.user
                  ) : null}
                  <svg
                    className={`w-4 h-4 text-primary transition-transform ${
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
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link href="/dashboard">
                      <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-primary-light">
                        Dashboard
                      </button>
                    </Link>
                    <form action={handleLogout}>
                      <button
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-primary-light"
                        disabled={isLoading}
                      >
                        Sign Out {isLoading ? "..." : ""}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            className="text-primary focus:outline-none"
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
                  isMobileMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-primary-light p-4 space-y-4">
          {!isAuthenticated ? (
            <>
              <Link href="/auth/register">
                <button className="block w-full text-left px-4 py-2 rounded border border-primary text-primary hover:bg-[#FFF3E0]">
                  Register
                </button>
              </Link>
              <Link href="/auth/login">
                <button className="block w-full text-left hover:text-primary">
                  Sign In
                </button>
              </Link>
            </>
          ) : (
            <>
              <p className="text-primary px-4">{session?.user?.name}</p>
              <Link href="/dashboard">
                <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-primary-light">
                  Dashboard
                </button>
              </Link>
              <form action={handleLogout}>
                <button
                  className="block w-full text-left px-4 py-2 rounded border border-primary text-primary hover:bg-primary-foreground"
                  disabled={isLoading}
                >
                  Sign Out {isLoading ? "..." : ""}
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Navigation;
