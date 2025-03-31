import React from 'react';
import { Users } from 'lucide-react';

const Dashboard1 = () => {


    return (
        < div className=" rounded-lg p-6 mb-6" >
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold">$45,385</h2>
                    <p className="text-gray-400">Sales this week</p>
                </div>
                <div className="text-black  flex items-center">
                    <span>12.5%</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                    </svg>
                </div>
            </div>

            {/* Chart */}
            <div className="h-64 relative">
                <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs ttext-gray-400">
                    <span>$6800</span>
                    <span>$6600</span>
                    <span>$6400</span>
                    <span>$6200</span>
                    <span>$6000</span>
                </div>

                <div className="absolute left-10 right-0 top-0 bottom-0">
                    <svg viewBox="0 0 800 200" className="w-full h-full">
                        {/* Current Period Line */}
                        <path d="M0,80 C100,60 200,20 300,50 C400,80 500,120 600,70 C700,20 800,50" fill="none" stroke="#1D4ED8" strokeWidth="2" />

                        {/* Previous Period Line */}
                        <path d="M0,110 C100,130 200,160 300,170 C400,180 500,120 600,90 C700,60 800,80" fill="none" stroke="#F97316" strokeWidth="2" />

                        {/* Data Points - Current */}
                        <circle cx="0" cy="80" r="4" fill="#1D4ED8" />
                        <circle cx="200" cy="20" r="4" fill="#1D4ED8" />
                        <circle cx="400" cy="150" r="4" fill="#1D4ED8" />
                        <circle cx="600" cy="70" r="4" fill="#1D4ED8" />
                        <circle cx="800" cy="50" r="4" fill="#1D4ED8" />

                        {/* Data Points - Previous */}
                        <circle cx="0" cy="110" r="4" fill="#F97316" />
                        <circle cx="200" cy="160" r="4" fill="#F97316" />
                        <circle cx="400" cy="180" r="4" fill="#F97316" />
                        <circle cx="600" cy="90" r="4" fill="#F97316" />
                        <circle cx="800" cy="80" r="4" fill="#F97316" />
                    </svg>
                </div>

                <div className="absolute left-10 right-0 bottom-0 flex justify-between text-xs text-gray-400">
                    <span>01 Feb</span>
                    <span>02 Feb</span>
                    <span>03 Feb</span>
                    <span>04 Feb</span>
                    <span>05 Feb</span>
                    <span>06 Feb</span>
                    <span>07 Feb</span>
                </div>
            </div>

            <div className="flex justify-center space-x-8 mt-4">
                <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-600 mr-2"></div>
                    <span className="text-sm text-gray-400">Revenue</span>
                </div>
                <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                    <span className="text-sm text-gray-400">Revenue (previous period)</span>
                </div>
            </div>

            {/* <div className="flex justify-between items-center mt-6">
                                                                                                                                       <div className="flex items-center">
                                                                                                                                                      <span>Last 7 days</span>
                                                                                                                                                      <ChevronDown size={16} className="ml-1" />
                                                                                                                                       </div>
                                                                                                                                       <div className="flex items-center text-blue-500">
                                                                                                                                                      <span>SALES REPORT</span>
                                                                                                                                                      <ChevronRight size={16} className="ml-1" />
                                                                                                                                       </div>
                                                                                                                        </div> */}
        </div >
    );
};

export default Dashboard1;