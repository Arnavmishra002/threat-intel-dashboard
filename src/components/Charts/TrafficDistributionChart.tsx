import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';

export const TrafficDistributionChart: React.FC = () => {
    const { metrics } = useData();
    const { theme } = useTheme();

    const data = [
        { name: 'Normal', value: metrics.totalSessions - metrics.suspiciousSessions, color: '#10b981' }, // emerald-500
        { name: 'Bot', value: metrics.suspiciousSessions, color: '#ef4444' }, // red-500
    ];

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow h-[400px] flex flex-col transition-colors duration-200">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Traffic Distribution</h3>
            <div className="flex-1 w-full min-h-0"> {/* Allow chart to shrink */}
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke={theme === 'dark' ? '#1f2937' : '#fff'} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: any) => [`${value} Sessions`, 'Count']}
                            contentStyle={{
                                borderRadius: '8px',
                                border: 'none',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                backgroundColor: theme === 'dark' ? '#374151' : '#fff',
                                color: theme === 'dark' ? '#f3f4f6' : '#111827'
                            }}
                        />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
