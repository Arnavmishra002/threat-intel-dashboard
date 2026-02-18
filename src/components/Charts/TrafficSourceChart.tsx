import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';

export const TrafficSourceChart: React.FC = () => {
    const { filteredData } = useData();
    const { theme } = useTheme();

    const data = React.useMemo(() => {
        const sources = Array.from(new Set(filteredData.map(d => d.traffic_source)));

        return sources.map(source => {
            const sourceData = filteredData.filter(d => d.traffic_source === source);
            const botCount = sourceData.filter(d => d.is_bot === 1).length;
            const normalCount = sourceData.filter(d => d.is_bot === 0).length;

            return {
                name: source,
                Bot: botCount,
                Normal: normalCount,
                Total: botCount + normalCount
            };
        }).sort((a, b) => b.Total - a.Total); // Sort by total volume
    }, [filteredData]);

    const axisColor = theme === 'dark' ? '#9CA3AF' : '#6B7280';
    const gridColor = theme === 'dark' ? '#374151' : '#E5E7EB';

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow h-[400px] flex flex-col transition-colors duration-200">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Traffic Source Breakdown</h3>
            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />
                        <XAxis type="number" stroke={axisColor} />
                        <YAxis dataKey="name" type="category" stroke={axisColor} width={80} />
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
                        <Bar dataKey="Normal" stackId="a" fill="#10b981" />
                        <Bar dataKey="Bot" stackId="a" fill="#ef4444" radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
