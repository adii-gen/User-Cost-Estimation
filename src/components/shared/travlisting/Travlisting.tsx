import React from 'react';

const MakeMyTripClone = () => {
  return (
    <div className="w-full bg-gray-100 relative">
      {/* Background image */}
      <div className="absolute inset-0 bg-gray-800 h-64 opacity-90 z-0"></div>
      
      {/* Header */}
      {/* <div className="relative z-10 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <img src="/api/placeholder/40/40" alt="MakeMyTrip" className="h-8" />
          <span className="text-white font-bold text-xl ml-2">makeMyTrip</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="bg-yellow-500 text-white px-3 py-2 rounded flex items-center">
            <img src="/api/placeholder/24/24" alt="Property" className="h-6 mr-2" />
            <div className="text-left">
              <div className="text-sm font-semibold">List Your Property</div>
              <div className="text-xs">Grow your business!</div>
            </div>
          </div>
          
          <div className="bg-blue-600 text-white px-3 py-2 rounded flex items-center">
            <img src="/api/placeholder/24/24" alt="myBiz" className="h-6 mr-2" />
            <div className="text-left">
              <div className="text-sm font-semibold">Introducing myBiz</div>
              <div className="text-xs">Business Travel Solution</div>
            </div>
          </div>
          
          <div className="text-white flex items-center">
            <img src="/api/placeholder/24/24" alt="My Trips" className="h-6 mr-2" />
            <div className="text-left">
              <div className="text-sm font-semibold">My Trips</div>
              <div className="text-xs">Manage your bookings</div>
            </div>
          </div>
          
          <div className="bg-blue-500 text-white px-3 py-2 rounded-full">
            <div className="flex items-center">
              <img src="/api/placeholder/24/24" alt="Login" className="h-6 mr-2" />
              <span>Login or Create Account</span>
            </div>
          </div>
          
          <div className="text-white flex items-center">
            <img src="/api/placeholder/20/20" alt="flag" className="h-5 mr-1" />
            <span>INR</span>
            <span className="mx-2">|</span>
            <span>English</span>
          </div>
        </div>
      </div> */}
      
      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Travel options */}
        <div className="bg-white rounded-lg p-4 shadow-md">
          <div className="flex justify-between">
            <div className="flex items-center flex-col text-blue-500 border-b-2 border-blue-500">
              <img src="/flight.webp" alt="Flights" className="mb-1 h-20" />
              <span className="text-sm">Flights</span>
            </div>
            <div className="flex items-center flex-col text-gray-600">
              <img src="/api/placeholder/24/24" alt="Hotels" className="mb-1" />
              <span className="text-sm">Hotels</span>
            </div>
            {/* <div className="flex items-center flex-col text-gray-600">
              <img src="/api/placeholder/24/24" alt="Homestays" className="mb-1" />
              <span className="text-sm">Homestays & Villas</span>
            </div> */}
            <div className="flex items-center flex-col text-gray-600">
              <img src="/api/placeholder/24/24" alt="Holiday" className="mb-1" />
              <span className="text-sm">Holiday Packages</span>
            </div>
            {/* <div className="flex items-center flex-col text-gray-600">
              <img src="/api/placeholder/24/24" alt="Trains" className="mb-1" />
              <span className="text-sm">Trains</span>
            </div> */}
            {/* <div className="flex items-center flex-col text-gray-600">
              <img src="/api/placeholder/24/24" alt="Buses" className="mb-1" />
              <span className="text-sm">Buses</span>
            </div> */}
            {/* <div className="flex items-center flex-col text-gray-600">
              <img src="/api/placeholder/24/24" alt="Cabs" className="mb-1" />
              <span className="text-sm">Cabs</span>
            </div>
            <div className="flex items-center flex-col text-gray-600">
              <img src="/api/placeholder/24/24" alt="Forex" className="mb-1" />
              <span className="text-sm">Forex Card & Currency</span>
            </div>
            <div className="flex items-center flex-col text-gray-600">
              <img src="/api/placeholder/24/24" alt="Insurance" className="mb-1" />
              <span className="text-sm">Travel Insurance</span>
            </div> */}
          </div>
          
          {/* Flight search form */}
          <div className="mt-6">
            <div className="flex items-center mb-4">
              <div className="flex items-center mr-6">
                <input type="radio" id="oneWay" name="tripType" className="mr-2 h-5 w-5 accent-blue-500" checked />
                <label htmlFor="oneWay" className="text-gray-900">One Way</label>
              </div>
              <div className="flex items-center mr-6">
                <input type="radio" id="roundTrip" name="tripType" className="mr-2 h-5 w-5 accent-blue-500" />
                <label htmlFor="roundTrip" className="text-gray-900">Round Trip</label>
              </div>
              <div className="flex items-center">
                <input type="radio" id="multiCity" name="tripType" className="mr-2 h-5 w-5 accent-blue-500" />
                <label htmlFor="multiCity" className="text-gray-900">Multi City</label>
              </div>
              
              <div className="ml-auto text-gray-600">
                Book International and Domestic Flights
              </div>
            </div>
            
            <div className="grid grid-cols-5 gap-2 mb-6">
              <div className="bg-white border rounded p-4">
                <div className="text-gray-500 text-sm mb-1">From</div>
                <div className="text-2xl font-bold">Delhi</div>
                <div className="text-xs text-gray-500">DEL, Delhi Airport India</div>
              </div>
              
              <div className="bg-white border rounded p-4 relative">
                <div className="absolute left-0 top-1/2 -translate-x-1/2 transform">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-500">↔</span>
                  </div>
                </div>
                <div className="text-gray-500 text-sm mb-1">To</div>
                <div className="text-2xl font-bold">Bengaluru</div>
                <div className="text-xs text-gray-500">BLR, Bengaluru International Airport</div>
              </div>
              
              <div className="bg-white border rounded p-4">
                <div className="text-gray-500 text-sm mb-1">Departure</div>
                <div className="text-2xl font-bold">23</div>
                <div className="text-xs text-gray-500">Mar'25</div>
                <div className="text-sm text-gray-500">Sunday</div>
              </div>
              
              <div className="bg-white border rounded p-4">
                <div className="text-gray-500 text-sm mb-1">Return</div>
                <div className="text-sm text-gray-400">Tap to add a return date for bigger discounts</div>
              </div>
              
              <div className="bg-white border rounded p-4">
                <div className="text-gray-500 text-sm mb-1">Travellers & Class</div>
                <div className="text-2xl font-bold">1</div>
                <div className="text-xs text-gray-500">Traveller</div>
                <div className="text-sm text-gray-500">Economy/Premium Economy</div>
              </div>
            </div>
            
            {/* Fare types */}
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <span className="text-gray-700 mr-2">Select a special fare</span>
                <span className="bg-green-400 text-green-800 text-xs px-2 py-0.5 rounded">EXTRA SAVINGS</span>
              </div>
              
              <div className="grid grid-cols-5 gap-2">
                <label className="border rounded p-3 bg-white cursor-pointer flex items-start border-blue-400">
                  <input type="radio" name="fareType" className="mt-1 mr-2 h-4 w-4 accent-blue-500" checked />
                  <div>
                    <div className="text-gray-800">Regular</div>
                    <div className="text-xs text-gray-500">Regular fares</div>
                  </div>
                </label>
                
                <label className="border rounded p-3 bg-white cursor-pointer flex items-start">
                  <input type="radio" name="fareType" className="mt-1 mr-2 h-4 w-4 accent-blue-500" />
                  <div>
                    <div className="text-gray-800">Student</div>
                    <div className="text-xs text-gray-500">Extra discounts/baggage</div>
                  </div>
                </label>
                
                <label className="border rounded p-3 bg-white cursor-pointer flex items-start">
                  <input type="radio" name="fareType" className="mt-1 mr-2 h-4 w-4 accent-blue-500" />
                  <div>
                    <div className="text-gray-800">Senior Citizen</div>
                    <div className="text-xs text-gray-500">Up to ₹ 600 off</div>
                  </div>
                </label>
                
                <label className="border rounded p-3 bg-white cursor-pointer flex items-start">
                  <input type="radio" name="fareType" className="mt-1 mr-2 h-4 w-4 accent-blue-500" />
                  <div>
                    <div className="text-gray-800">Armed Forces</div>
                    <div className="text-xs text-gray-500">Up to ₹ 600 off</div>
                  </div>
                </label>
                
                <label className="border rounded p-3 bg-white cursor-pointer flex items-start">
                  <input type="radio" name="fareType" className="mt-1 mr-2 h-4 w-4 accent-blue-500" />
                  <div>
                    <div className="text-gray-800">Doctor and Nurses</div>
                    <div className="text-xs text-gray-500">Up to ₹ 600 off</div>
                  </div>
                </label>
              </div>
            </div>
            
            {/* Search button */}
            <div className="flex justify-center">
              <button className="bg-blue-500 text-white font-bold py-3 px-16 rounded-full uppercase text-lg">
                SEARCH
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom explore more */}
      <div className="relative z-10 text-center mt-4 pb-4">
        <button className="text-white bg-transparent border-b border-white flex items-center mx-auto">
          Explore More <span className="ml-1">▼</span>
        </button>
      </div>
    </div>
  );
};

export default MakeMyTripClone;