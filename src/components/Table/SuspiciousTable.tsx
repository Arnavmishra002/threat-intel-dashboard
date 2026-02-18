import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { SessionDetailModal } from '../UI/SessionDetailModal';
import type { SessionData } from '../../types/data';

export const SuspiciousTable: React.FC = () => {
    const { filteredData } = useData();
    const [selectedSession, setSelectedSession] = useState<SessionData | null>(null);

    const topSuspicious = React.useMemo(() => {
        return filteredData
            .filter(d => d.is_bot === 1)
            .sort((a, b) => b.clicks_per_second - a.clicks_per_second)
            .slice(0, 20);
    }, [filteredData]);

    if (topSuspicious.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow h-96 flex items-center justify-center text-gray-500 dark:text-gray-400 transition-colors duration-200">
                No suspicious sessions found in current selection.
            </div>
        )
    }

    return (
        <>
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg transition-colors duration-200">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                        Top 20 Suspicious Sessions (High Click Rate)
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Click on a row to investigate session details.
                    </p>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    ID (Index)
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Clicks/Sec
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Duration
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Page Views
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Traffic Source
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {topSuspicious.map((session, idx) => (
                                <tr
                                    key={idx}
                                    onClick={() => setSelectedSession(session)}
                                    className="hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        #{idx + 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600 dark:text-red-400">
                                        {session.clicks_per_second.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {session.session_duration.toFixed(1)}s
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {session.page_views}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {session.traffic_source}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <SessionDetailModal
                session={selectedSession}
                onClose={() => setSelectedSession(null)}
            />
        </>
    );
};
