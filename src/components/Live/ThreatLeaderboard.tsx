import React, { useEffect, useState } from 'react';
import { Bot, User, Clock } from 'lucide-react';
import { useData } from '../../context/DataContext';

function getTimeAgo(dateString: string): string {
    const seconds = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000);
    if (seconds < 1) return 'Just now';
    return `${seconds}s ago`;
}

function anomalyColor(score: number): { bar: string; text: string; } {
    if (score >= 0.7) return { bar: 'bg-red-500', text: 'text-red-500' };
    if (score >= 0.4) return { bar: 'bg-amber-400', text: 'text-amber-500' };
    return { bar: 'bg-emerald-500', text: 'text-emerald-500' };
}

function countryFlag(code: string): string {
    if (!code || code.length !== 2) return '🌐';
    const codePoints = [...code.toUpperCase()].map((c) => 127397 + c.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}

export const ThreatLeaderboard: React.FC = () => {
    const { filteredData } = useData();
    const [, setNow] = useState(Date.now());

    // Update relative time every second
    useEffect(() => {
        const t = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(t);
    }, []);

    // Get latest 10 sessions (Filtered data is already sorted new -> old)
    const recentSessions = filteredData.slice(0, 10);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <ActivityIcon /> Live Traffic Feed
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">Real-time session analysis</p>
                </div>
                <span className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Live
                </span>
            </div>

            <div className="divide-y divide-gray-50 dark:divide-gray-700/60">
                {recentSessions.length === 0 ? (
                    <div className="py-10 text-center text-sm text-gray-400">Waiting for traffic...</div>
                ) : (
                    recentSessions.map((session) => {
                        const { bar, text } = anomalyColor(session.anomaly);
                        const isHighRisk = session.anomaly >= 0.7;

                        return (
                            <div key={session.session_id} className={`px-3 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors`}>
                                {/* Icon Status */}
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isHighRisk ? 'bg-red-100 dark:bg-red-900/30' : 'bg-emerald-100 dark:bg-emerald-900/30'}`}>
                                    {isHighRisk ? (
                                        <Bot className="w-4 h-4 text-red-500 dark:text-red-400" />
                                    ) : (
                                        <User className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-mono text-gray-600 dark:text-gray-300 truncate max-w-[100px]" title={session.session_id}>
                                            {session.session_id.slice(0, 8)}...
                                        </span>
                                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {getTimeAgo(session.timestamp)}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full transition-all duration-500 ${bar}`} style={{ width: `${session.anomaly * 100}%` }} />
                                        </div>
                                        <span className={`text-[10px] font-bold ${text} w-8 text-right`}>{(session.anomaly * 100).toFixed(0)}%</span>
                                    </div>
                                </div>

                                {/* Flag */}
                                <div className="flex-shrink-0 text-lg opacity-80" title={session.country}>
                                    {countryFlag(session.country)}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900/40 border-t border-gray-100 dark:border-gray-700">
                <p className="text-xs text-center text-gray-400">Monitoring incoming sessions...</p>
            </div>
        </div>
    );
};

const ActivityIcon = () => (
    <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);
