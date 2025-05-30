import React from 'react';
import { Users, BookOpen, Gem, Bell, Settings, LogOut, Eye, Share2, MessageCircle } from 'lucide-react';

function Admindashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col justify-between">
        <div>
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Welcome, <span className="font-bold">Admin</span></h2>
          </div>
          <nav className="p-4 space-y-2">
            <div className="text-sm font-semibold text-gray-600 uppercase mb-2">Dashboard</div>
            <a href="#" className="flex items-center p-2 rounded-md bg-blue-100 text-blue-600 font-medium">
              <Users className="w-5 h-5 mr-3" /> Overview
            </a>
            <a href="#" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md">
              <Users className="w-5 h-5 mr-3" /> Users
            </a>
            <a href="#" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md">
              <BookOpen className="w-5 h-5 mr-3" /> Courses
            </a>
            <a href="#" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md">
              <Gem className="w-5 h-5 mr-3" /> Plans
            </a>
            <a href="#" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md">
              <Bell className="w-5 h-5 mr-3" /> Reports
            </a>
          </nav>
        </div>
        <div className="p-4 border-t">
          <a href="#" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md">
            <Settings className="w-5 h-5 mr-3" /> Settings
          </a>
          <a href="#" className="flex items-center p-2 text-red-600 hover:bg-red-100 rounded-md mt-2">
            <LogOut className="w-5 h-5 mr-3" /> Logout
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome back! Here's what's happening with your platform today.</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-red-500 text-white p-4 rounded-md shadow-md flex items-center justify-between">
            <div className="flex items-center">
              <MessageCircle className="w-6 h-6 mr-3" />
              <span>Messages</span>
            </div>
            <span className="text-2xl font-bold">52</span>
          </div>
          <div className="bg-blue-500 text-white p-4 rounded-md shadow-md flex items-center justify-between">
            <div className="flex items-center">
              <Eye className="w-6 h-6 mr-3" />
              <span>Views</span>
            </div>
            <span className="text-2xl font-bold">99</span>
          </div>
          <div className="bg-teal-500 text-white p-4 rounded-md shadow-md flex items-center justify-between">
            <div className="flex items-center">
              <Share2 className="w-6 h-6 mr-3" />
              <span>Shares</span>
            </div>
            <span className="text-2xl font-bold">23</span>
          </div>
          <div className="bg-orange-500 text-white p-4 rounded-md shadow-md flex items-center justify-between">
            <div className="flex items-center">
              <Users className="w-6 h-6 mr-3" />
              <span>Users</span>
            </div>
            <span className="text-2xl font-bold">50</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-md shadow">
            <h2 className="font-semibold text-gray-800 mb-4">Regions</h2>
            <div className="h-48 bg-gray-200 flex items-center justify-center rounded">Map Placeholder</div>
          </div>
          <div className="bg-white p-4 rounded-md shadow">
            <h2 className="font-semibold text-gray-800 mb-4">Feeds</h2>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between items-center text-gray-700">
                <div className="flex items-center space-x-2"><Users className="w-4 h-4" /><span>New record, over 90 views.</span></div>
                <span className="text-gray-500">10 mins</span>
              </li>
              <li className="flex justify-between items-center text-gray-700">
                <div className="flex items-center space-x-2"><Bell className="w-4 h-4 text-red-500" /><span>Database error.</span></div>
                <span className="text-gray-500">15 mins</span>
              </li>
              <li className="flex justify-between items-center text-gray-700">
                <div className="flex items-center space-x-2"><Users className="w-4 h-4 text-yellow-500" /><span>New record, over 40 users.</span></div>
                <span className="text-gray-500">17 mins</span>
              </li>
              <li className="flex justify-between items-center text-gray-700">
                <div className="flex items-center space-x-2"><MessageCircle className="w-4 h-4 text-pink-500" /><span>New comments.</span></div>
                <span className="text-gray-500">25 mins</span>
              </li>
              <li className="flex justify-between items-center text-gray-700">
                <div className="flex items-center space-x-2"><BookOpen className="w-4 h-4 text-blue-500" /><span>Check transactions.</span></div>
                <span className="text-gray-500">28 mins</span>
              </li>
              <li className="flex justify-between items-center text-gray-700">
                <div className="flex items-center space-x-2"><Settings className="w-4 h-4 text-red-500" /><span>CPU overload.</span></div>
                <span className="text-gray-500">35 mins</span>
              </li>
              <li className="flex justify-between items-center text-gray-700">
                <div className="flex items-center space-x-2"><Share2 className="w-4 h-4 text-green-500" /><span>New shares.</span></div>
                <span className="text-gray-500">39 mins</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Admindashboard;
