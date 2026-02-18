import React, { useState } from 'react';
import { FilterSidebar } from '../Filters/FilterSidebar';
import { Menu, Play, Pause } from 'lucide-react';
import { ThemeToggle } from '../UI/ThemeToggle';
import { ReportExporter } from '../Reporting/ReportExporter';
import { useRealTimeSimulation } from '../../hooks/useRealTimeSimulation';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLive, setIsLive] = useState(false);
    useRealTimeSimulation(isLive);

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden transition-colors duration-200">
            <div className="hidden md:flex md:flex-shrink-0">
                <div className="flex flex-col w-64">
                    <FilterSidebar />
                </div>
            </div>

            {sidebarOpen && (
                <div className="fixed inset-0 z-40 flex md:hidden">
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
                    <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800">
                        <FilterSidebar />
                    </div>
                </div>
            )}

            <div className="flex flex-col w-0 flex-1 overflow-hidden">
                <div className="flex items-center justify-between md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
                    <button
                        className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:text-gray-400 dark:hover:text-white"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <Menu className="h-6 w-6" aria-hidden="true" />
                    </button>
                    <div className="pr-4"><ThemeToggle /></div>
                </div>

                <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white transition-colors">SecurePay Threat Monitor</h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Real-time Fraud & Bot Detection System</p>
                            </div>
                            <div className="hidden md:flex items-center space-x-4">
                                <button
                                    onClick={() => setIsLive(!isLive)}
                                    className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLive
                                            ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300'
                                            : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300'
                                        }`}
                                >
                                    {isLive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                                    {isLive ? 'Stop Live Mode' : 'Start Live Mode'}
                                </button>
                                <ReportExporter />
                                <ThemeToggle />
                            </div>
                        </div>
                    </div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-2 pb-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
