import React from "react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-4 rounded shadow">
        <input
          type="text"
          placeholder="Search.."
          className="border px-4 py-2 rounded w-1/3"
        />
        <div className="space-x-2">
          <button className="btn">Daily</button>
          <button className="btn">Weekly</button>
          <button className="btn bg-blue-600 text-white">Monthly</button>
          <button className="btn">Custom</button>
          <button className="btn border border-blue-500 text-blue-500">Reset Filter</button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: "Total Investment Volume", value: "₹2.4Cr", change: "+15.2%" },
          { label: "Active Investor", value: "1,247", change: "+8.2%" },
          { label: "Properties Listed", value: "89", change: "+15.2%" },
          { label: "Platform Revenue", value: "₹12.8L", change: "+18.6%" },
        ].map((item, i) => (
          <div key={i} className="bg-white p-4 rounded shadow">
            <h3 className="text-sm text-gray-500">{item.label}</h3>
            <p className="text-xl font-semibold">{item.value}</p>
            <p className="text-green-500 text-sm">{item.change} from last month</p>
          </div>
        ))}
      </div>

      {/* Investment Flow and Top Performing Properties */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow col-span-2">
          <div className="flex justify-between mb-2">
            <h3 className="font-semibold">Investment Flow Analysis</h3>
            <div className="space-x-2">
              <button className="btn btn-sm">Monthly</button>
              <button className="btn btn-sm">Quarterly</button>
              <button className="btn btn-sm">Yearly</button>
            </div>
          </div>
          <div className="h-40 bg-gray-200 rounded flex items-center justify-center">
            {/* Replace with Chart.js or Recharts */}
            <span>Chart Placeholder</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Top Performing Properties</h3>
          {[
            "Gaur Apartments",
            "Green Complex",
            "Blue Harmony Tower",
            "Sky Scrapers Houses",
          ].map((prop, i) => (
            <div key={i} className="flex justify-between text-sm py-1">
              <span>{prop}</span>
              <span className="text-green-500">+92%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio, Tax, Compliance */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Portfolio Performance</h3>
          <button className="btn mb-2">Download PDF</button>
          <div className="text-sm space-y-1">
            <p>Total Portfolio Value: ₹2.4Cr</p>
            <p>Average ROI: 18.5%</p>
            <p>Rental Yield: 6.2%</p>
            <p>Capital Appreciation: 12.3%</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Tax Statements</h3>
          <button className="btn mb-2">Generate</button>
          <div className="text-sm space-y-1">
            <p>Form 16 [2024-25]: Ready</p>
            <p>Capital gains Report: Ready</p>
            <p>Dividend Income: ₹1.2L</p>
            <p>TDS Deducted: ₹18,500</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Compliance Monitoring</h3>
          <button className="btn mb-2">View Details</button>
          <div className="text-sm space-y-1">
            <p>KYC Compliance: <span className="text-green-500">88.5%</span></p>
            <p>RBI Guidelines: <span className="text-green-500">Compliant</span></p>
            <p>AML Checks: <span className="text-green-500">Passed</span></p>
            <p>Audit Status: <span className="text-red-500">Pending</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

// Tailwind CSS class `btn` should be defined globally in your styles:
// .btn { @apply px-3 py-1 rounded bg-gray-200 hover:bg-gray-300; }
// .btn-sm { @apply px-2 py-0.5 text-sm; }
