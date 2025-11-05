"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Ticket,
  ChevronRight,
  Search,
  Shield,
  BarChart2,
  Clock,
  Users,
  CheckCircle,
  MessageSquare,
  Zap,
  HeadphonesIcon,
  Menu,
  X
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function TicketSystemHomepage() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Modern color scheme: Purple (primary), teal (accent), neutral grays
  const colors = {
    primary: 'bg-purple-700 text-white',
    primaryText: 'text-purple-700',
    primaryBorder: 'border-purple-700',
    accent: 'bg-teal-500 text-white',
    accentText: 'text-teal-500',
    accentBorder: 'border-teal-500',
    dark: 'bg-gray-900 text-white',
    light: 'bg-gray-50 text-gray-900'
  };

  const features = [
    {
      icon: <Ticket className="h-6 w-6 text-purple-700" />,
      title: "Smart Ticket Management",
      description: "Automatically categorize, prioritize, and route tickets to the right team members."
    },
    {
      icon: <Clock className="h-6 w-6 text-purple-700" />,
      title: "Real-time Tracking",
      description: "Monitor ticket status, response times, and resolution progress in real-time."
    },
    {
      icon: <BarChart2 className="h-6 w-6 text-purple-700" />,
      title: "Advanced Analytics",
      description: "Get insights into team performance, customer satisfaction, and support trends."
    },
    {
      icon: <Shield className="h-6 w-6 text-purple-700" />,
      title: "Secure & Compliant",
      description: "Enterprise-grade security with role-based access and data encryption."
    }
  ];

  const howItWorks = [
    {
      number: "01",
      title: "Submit Ticket",
      description: "Customers can easily submit tickets through multiple channels - email, web form, or API."
    },
    {
      number: "02",
      title: "Smart Routing",
      description: "AI-powered system automatically assigns tickets to the most suitable team member."
    },
    {
      number: "03",
      title: "Track & Resolve",
      description: "Monitor progress, collaborate with team, and resolve tickets efficiently."
    }
  ];

  const testimonials = [
    {
      text: "TicketFlow transformed our customer support. We reduced response times by 60% and improved customer satisfaction significantly.",
      author: "Sarah Johnson",
      company: "TechCorp Solutions"
    },
    {
      text: "The analytics dashboard gives us incredible insights. We can now predict support trends and allocate resources effectively.",
      author: "Raj Patel",
      company: "Digital Innovations Ltd"
    }
  ];

  const stats = [
    { value: "99.9%", label: "Uptime SLA" },
    { value: "10K+", label: "Tickets Resolved Daily" },
    { value: "< 2min", label: "Avg Response Time" },
    { value: "500+", label: "Happy Companies" }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-md bg-purple-700 flex items-center justify-center">
                  <Ticket className="h-5 w-5 text-white" />
                </div>
                <span className="ml-2 text-lg md:text-xl font-bold text-purple-700">
                  TicketFlow
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-600 hover:text-purple-700 px-3 py-2 text-sm font-medium">
                Features
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-purple-700 px-3 py-2 text-sm font-medium">
                Pricing
              </a>
              <a href="#demo" className="text-gray-600 hover:text-purple-700 px-3 py-2 text-sm font-medium">
                Demo
              </a>
              <a href="#contact" className="text-gray-600 hover:text-purple-700 px-3 py-2 text-sm font-medium">
                Contact
              </a>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
               <Link href="/auth/login">
              <Button
                variant="outline"
                className="border-purple-700 text-purple-700 hover:bg-purple-700 hover:text-white text-sm"
              >
                Sign In
              </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-blue-800 hover:bg-blue-900 text-white text-sm">
                   Get Started
                 </Button>
               </Link>
              </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-purple-700 focus:outline-none"
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {/* {isOpen && (
          <div className="md:hidden bg-white pb-3 px-4">
            <div className="flex flex-col space-y-2 pt-2">
              <a 
                href="#features" 
                className="text-gray-600 hover:text-purple-700 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                Features
              </a>
              <a 
                href="#pricing" 
                className="text-gray-600 hover:text-purple-700 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                Pricing
              </a>
              <a 
                href="#demo" 
                className="text-gray-600 hover:text-purple-700 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                Demo
              </a>
              <a 
                href="#contact" 
                className="text-gray-600 hover:text-purple-700 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </a>

              <div className="pt-2 border-t border-gray-200">
                <Link href={'/auth/login'}>
                <Button
                  variant="outline"
                  className="w-full border-purple-700 text-purple-700 hover:bg-purple-700 hover:text-white mb-2"
                  // onClick={() => setIsOp en(false)}
                >
                  Sign In
                </Button>
</Link>
<Link href={'/auth/login'}>
                <Button 
                  className="w-full bg-purple-700 hover:bg-purple-800 text-white"
                  // onClick={() => setIsOpen(false)}
                >
                  Start Free Trial
                </Button>
</Link>
              </div>
            </div>
          </div>
        )} */}
        {isOpen && (
  <div className="md:hidden bg-white pb-3 px-4 z-50 absolute top-16 left-0 w-full shadow-lg">
    <div className="flex flex-col space-y-2 pt-2">
      {/* Links */}
      {['features', 'pricing', 'demo', 'contact'].map(section => (
        <a
          key={section}
          href={`#${section}`}
          className="text-gray-600 hover:text-purple-700 px-3 py-2 rounded-md text-base font-medium"
          onClick={() => setIsOpen(false)}
        >
          {section.charAt(0).toUpperCase() + section.slice(1)}
        </a>
      ))}

      {/* Auth Buttons */}
      <div className="pt-2 border-t border-gray-200">
        <Link href="/auth/login">
          <Button
            variant="outline"
            className="w-full border-purple-700 text-purple-700 hover:bg-purple-700 hover:text-white mb-2"
            onClick={() => setIsOpen(false)}
          >
            Sign In
          </Button>
        </Link>

        <Link href="/auth/login">
          <Button
            className="w-full bg-purple-700 hover:bg-purple-800 text-white"
            onClick={() => setIsOpen(false)}
          >
            Start Free Trial
          </Button>
        </Link>
      </div>
    </div>
  </div>
)}

      </nav>

      {/* Hero Section */}
      <section className={`relative ${colors.primary} py-20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Text Section */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Streamline Your Support with <span className="text-teal-300">Smart Ticket Management</span>
              </h1>
              <p className="mt-4 text-lg text-purple-100 max-w-2xl mx-auto lg:mx-0">
                Transform your customer support experience with AI-powered ticket routing, real-time analytics, and seamless team collaboration. Resolve tickets faster than ever before.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href={"/auth/register"}><Button
                  size="lg"
                  className="bg-teal-500 hover:bg-teal-600 text-white"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-purple-100 hover:text-white hover:bg-purple-600"
                >
                  Watch Demo
                </Button>
              </div>
            </div>

            {/* Dashboard Preview */}
            <div className="lg:w-1/2 mt-10 lg:mt-0">
              <div className="relative rounded-xl overflow-hidden shadow-2xl bg-white p-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Support Dashboard</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="text-sm text-gray-600">Live</span>
                    </div>
                  </div>
                  
                  {/* Mock Ticket Cards */}
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-900">#1234 - Login Issue</span>
                        </div>
                        <span className="text-xs text-gray-500">2 min</span>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-900">#1235 - Payment Query</span>
                        </div>
                        <span className="text-xs text-gray-500">5 min</span>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-900">#1236 - Feature Request</span>
                        </div>
                        <span className="text-xs text-gray-500">Resolved</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-900 to-transparent p-6">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-teal-300 mr-2" />
                    <span className="text-white text-sm">Real-time Updates & Smart Routing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 rounded-lg bg-gray-50">
                <p className="text-3xl font-bold text-purple-700">{stat.value}</p>
                <p className="mt-2 text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Powerful Features for Modern Support Teams
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to deliver exceptional customer support and streamline your workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
              >
                <div className="p-3 bg-purple-50 inline-flex rounded-lg mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Get Started in 3 Simple Steps
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Set up your support system in minutes and start resolving tickets efficiently.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-8 rounded-xl shadow-sm relative z-10 h-full border-t-4 border-teal-500">
                  <div className="text-4xl font-bold text-purple-700 mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-0">
                    <ChevronRight className="h-8 w-8 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section id="demo" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              See TicketFlow in Action
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Try our interactive demo to experience the power of smart ticket management.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-purple-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Ticket Query Interface</h3>
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search tickets by ID, customer, or keywords..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-red-800">High Priority</span>
                    <span className="text-xs text-red-600">24</span>
                  </div>
                  <div className="text-2xl font-bold text-red-700">15</div>
                  <div className="text-xs text-red-600">Open tickets</div>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-yellow-800">Medium Priority</span>
                    <span className="text-xs text-yellow-600">48</span>
                  </div>
                  <div className="text-2xl font-bold text-yellow-700">32</div>
                  <div className="text-xs text-yellow-600">Open tickets</div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-800">Resolved Today</span>
                    <span className="text-xs text-green-600">+12</span>
                  </div>
                  <div className="text-2xl font-bold text-green-700">89</div>
                  <div className="text-xs text-green-600">Tickets closed</div>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <Button size="lg" className="bg-purple-700 hover:bg-purple-800 text-white">
                  <Zap className="mr-2 h-5 w-5" />
                  Try Interactive Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Trusted by Support Teams Worldwide
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              See how companies are transforming their customer support with TicketFlow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm relative"
              >
                <div className="absolute top-0 left-8 -translate-y-1/2 bg-teal-500 p-3 rounded-full">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <p className="text-gray-600 italic mb-6">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-semibold">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-semibold text-gray-900">
                      {testimonial.author}
                    </p>
                    <p className="text-xs text-gray-500">
                      {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-16 ${colors.primary}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Transform Your Support Experience?</h2>
            <p className="text-lg text-purple-100 max-w-2xl mx-auto mb-8">
              Join thousands of support teams who have already streamlined their workflow with TicketFlow.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-white">
                Start Your Free Trial
              </Button>
              <Button size="lg" variant="outline" className="border-white text-purple-100 hover:text-white hover:bg-purple-600">
                <HeadphonesIcon className="mr-2 h-5 w-5" />
                Talk to Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and About */}
            <div>
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 rounded-md bg-purple-600 flex items-center justify-center">
                  <Ticket className="h-5 w-5 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold">TicketFlow</span>
              </div>
              <p className="text-gray-400 text-sm mt-2">
                The most advanced ticket management system for modern support teams. Streamline, automate, and excel.
              </p>
            </div>

            {/* Product */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white">Pricing</a></li>
                <li><a href="#demo" className="text-gray-400 hover:text-white">Demo</a></li>
                <li><a href="#api" className="text-gray-400 hover:text-white">API</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#help" className="text-gray-400 hover:text-white">Help Center</a></li>
                <li><a href="#docs" className="text-gray-400 hover:text-white">Documentation</a></li>
                <li><a href="#community" className="text-gray-400 hover:text-white">Community</a></li>
                <li><a href="#status" className="text-gray-400 hover:text-white">System Status</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#about" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#careers" className="text-gray-400 hover:text-white">Careers</a></li>
                <li><a href="#privacy" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="#terms" className="text-gray-400 hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} TicketFlow. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}