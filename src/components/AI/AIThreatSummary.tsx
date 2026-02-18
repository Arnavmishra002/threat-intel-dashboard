import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { AlertTriangle, BrainCircuit } from 'lucide-react';

export const AIThreatSummary: React.FC = () => {
    const { filteredData, metrics } = useData();

    // Mock AI Analysis Logic
    const insights = useMemo(() => {
        const topBotSource = filteredData
            .filter(d => d.is_bot === 1)
            .reduce((acc, curr) => {
                acc[curr.traffic_source] = (acc[curr.traffic_source] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

        // Find source with max bots
        let maxSource = 'None';
        let maxCount = 0;
        Object.entries(topBotSource).forEach(([source, count]) => {
            if (count > maxCount) {
                maxCount = count;
                maxSource = source;
            }
        });

        // Determine threat level
        const botPercent = metrics.botPercentage;
        let threatLevel = 'LOW';
        let color = 'text-green-600 dark:text-green-400';
        let borderColor = 'border-green-200 dark:border-green-800';

        if (botPercent > 40) {
            threatLevel = 'CRITICAL';
            color = 'text-red-700 dark:text-red-400';
            borderColor = 'border-red-200 dark:border-red-800';
        } else if (botPercent > 20) {
            threatLevel = 'ELEVATED';
            color = 'text-orange-600 dark:text-orange-400';
            borderColor = 'border-orange-200 dark:border-orange-800';
        }

        return {
            maxSource,
            maxCount,
            threatLevel,
            color,
            borderColor,
            totalSessions: filteredData.length
        };
    }, [filteredData, metrics]);

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-4 mb-6 transition-colors duration-200 ${insights.borderColor}`}>
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                    <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                        <BrainCircuit className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                            AI Security Analyst
                            <span className="ml-2 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                                BETA
                            </span>
                        </h3>
                        <span className={`text-sm font-bold px-3 py-1 rounded-full bg-opacity-10 ${insights.color.replace('text-', 'bg-')} ${insights.color}`}>
                            {insights.threatLevel} THREAT LEVEL
                        </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                        <p>
                            <span className="font-medium text-gray-900 dark:text-white">Analysis:</span> Detected <span className="font-mono">{metrics.suspiciousSessions}</span> suspicious sessions out of {metrics.totalSessions} active sessions.
                        </p>
                        {insights.maxSource !== 'None' && (
                            <p>
                                <AlertTriangle className="w-4 h-4 inline mr-1 text-orange-500" />
                                <span className="font-medium text-gray-900 dark:text-white">Primary Vector:</span> Unusual bot activity detected from <span className="font-bold">{insights.maxSource}</span> traffic source ({insights.maxCount} alerts).
                            </p>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            Recommendation: {insights.threatLevel === 'CRITICAL' ? 'Immediate IP blocking recommended for high-velocity sources.' : 'Monitor traffic spikes. No immediate action required.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
