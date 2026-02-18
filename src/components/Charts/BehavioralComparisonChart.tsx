import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';

export const BehavioralComparisonChart: React.FC = () => {
    const { filteredData } = useData();
    const { theme } = useTheme();

    const stats = React.useMemo(() => {
        const bots = filteredData.filter(d => d.is_bot === 1);
        const normal = filteredData.filter(d => d.is_bot === 0);

        const avg = (arr: typeof filteredData, key: keyof typeof filteredData[0]) =>
            arr.length ? arr.reduce((acc, curr) => acc + (curr[key] as number), 0) / arr.length : 0;

        return [
            {
                name: 'Pages/Session',
                Bot: avg(bots, 'page_views'),
                Normal: avg(normal, 'page_views'),
            },
            {
                name: 'Duration (s)',
                Bot: avg(bots, 'session_duration'),
                Normal: avg(normal, 'session_duration'),
            },
            {
                name: 'Clicks/Sec',
                Bot: avg(bots, 'clicks_per_second'),
                Normal: avg(normal, 'clicks_per_second'),
            },
        ];

    }, [filteredData]);

    const axisColor = theme === 'dark' ? '#9CA3AF' : '#6B7280'; // gray-400 : gray-500
    const gridColor = theme === 'dark' ? '#374151' : '#E5E7EB'; // gray-700 : gray-200

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow h-[400px] flex flex-col transition-colors duration-200">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Behavioral Comparison (Avg)</h3>
            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={stats}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                        <XAxis dataKey="name" stroke={axisColor} />
                        <YAxis stroke={axisColor} />
                        <Tooltip
                            cursor={{ fill: theme === 'dark' ? '#374151' : '#f3f4f6' }}
                            contentStyle={{
                                borderRadius: '8px',
                                border: 'none',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                backgroundColor: theme === 'dark' ? '#374151' : '#fff',
                                color: theme === 'dark' ? '#f3f4f6' : '#111827'
                            }}
                        />
                        <Legend />
                        <Bar dataKey="Normal" fill="#10b981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Bot" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
