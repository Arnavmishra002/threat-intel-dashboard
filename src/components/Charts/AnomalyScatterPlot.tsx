import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';

export const AnomalyScatterPlot: React.FC = () => {
    const { filteredData } = useData();
    const { theme } = useTheme();

    // Create two separate data series for legend and coloring
    const botData = filteredData.filter(d => d.is_bot === 1);
    const normalData = filteredData.filter(d => d.is_bot === 0);

    // Performance optimization: sample normal data if too large
    const displayNormalData = normalData.length > 500 ? normalData.filter((_, i) => i % 2 === 0) : normalData;

    const axisColor = theme === 'dark' ? '#9CA3AF' : '#6B7280'; // gray-400 : gray-500
    const gridColor = theme === 'dark' ? '#374151' : '#E5E7EB'; // gray-700 : gray-200

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow h-[400px] flex flex-col transition-colors duration-200">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Anomaly Detection: Duration vs Page Views</h3>
            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                        margin={{
                            top: 20,
                            right: 20,
                            bottom: 20,
                            left: 20,
                        }}
                    >
                        <CartesianGrid stroke={gridColor} />
                        <XAxis type="number" dataKey="session_duration" name="Duration" unit="s" stroke={axisColor} />
                        <YAxis type="number" dataKey="page_views" name="Page Views" stroke={axisColor} />
                        <Tooltip
                            cursor={{ strokeDasharray: '3 3' }}
                            contentStyle={{
                                borderRadius: '8px',
                                border: 'none',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                backgroundColor: theme === 'dark' ? '#374151' : '#fff',
                                color: theme === 'dark' ? '#f3f4f6' : '#111827'
                            }}
                        />
                        <Legend />
                        <Scatter name="Normal" data={displayNormalData} fill="#10b981" fillOpacity={0.6} />
                        <Scatter name="Bot" data={botData} fill="#ef4444" shape="cross" />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
