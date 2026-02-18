import React from 'react';
import { useData } from '../../context/DataContext';
import { Filter, AlertTriangle, CheckCircle, Smartphone } from 'lucide-react';
import clsx from 'clsx';

export const FilterSidebar: React.FC = () => {
    const { filters, setFilters, data, maxDataDuration } = useData();

    // Get unique traffic sources from data
    // Using Set to get unique values, but need to ensure data is loaded first
    const trafficSources = React.useMemo(() => {
        const sources = new Set(data.map(d => d.traffic_source));
        return Array.from(sources);
    }, [data]);

    const toggleSource = (source: string) => {
        setFilters(prev => {
            const current = prev.trafficSource;
            if (current.includes(source)) {
                return { ...prev, trafficSource: current.filter(s => s !== source) };
            } else {
                return { ...prev, trafficSource: [...current, source] };
            }
        });
    };

    return (
        <div className="flex flex-col h-full border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200">
            <div className="flex items-center justify-center h-16 flex-shrink-0 px-4 bg-indigo-600 dark:bg-indigo-900">
                <h1 className="text-xl font-bold text-white tracking-wider">SECUREPAY</h1>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
                <nav className="flex-1 px-4 py-6 space-y-8">

                    {/* Bot Status Filter */}
                    <div>
                        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center">
                            <Filter className="w-4 h-4 mr-2" />
                            Bot Status
                        </h3>
                        <div className="space-y-2">
                            <button
                                onClick={() => setFilters(prev => ({ ...prev, isBot: 'all' }))}
                                className={clsx(
                                    "w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                    filters.isBot === 'all'
                                        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-200"
                                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                )}
                            >
                                All Traffic
                            </button>
                            <button
                                onClick={() => setFilters(prev => ({ ...prev, isBot: 'bot' }))}
                                className={clsx(
                                    "w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                    filters.isBot === 'bot'
                                        ? "bg-red-50 text-red-700 dark:bg-red-900/50 dark:text-red-200"
                                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                )}
                            >
                                <AlertTriangle className="w-4 h-4 mr-2" />
                                Suspicious (Bots)
                            </button>
                            <button
                                onClick={() => setFilters(prev => ({ ...prev, isBot: 'normal' }))}
                                className={clsx(
                                    "w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                    filters.isBot === 'normal'
                                        ? "bg-green-50 text-green-700 dark:bg-green-900/50 dark:text-green-200"
                                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                )}
                            >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Normal Traffic
                            </button>
                        </div>
                    </div>

                    {/* Traffic Source Filter */}
                    <div>
                        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center">
                            <Smartphone className="w-4 h-4 mr-2" />
                            Traffic Source
                        </h3>
                        <div className="space-y-2">
                            {trafficSources.map(source => (
                                <label key={source} className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={filters.trafficSource.length === 0 || filters.trafficSource.includes(source)}
                                        onChange={() => toggleSource(source)}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{source}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Duration Slider */}
                    <div>
                        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                            Session Duration
                        </h3>
                        <div className="px-2">
                            <input
                                type="range"
                                min="0"
                                max={maxDataDuration}
                                value={filters.maxDuration}
                                onChange={(e) => setFilters(prev => ({ ...prev, maxDuration: Number(e.target.value) }))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:bg-gray-700"
                            />
                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                                <span>0s</span>
                                <span>{filters.maxDuration}s</span>
                            </div>
                        </div>
                    </div>

                </nav>
            </div>
        </div>
    );
};
