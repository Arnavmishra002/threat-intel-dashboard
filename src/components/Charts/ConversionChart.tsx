import React from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const ConversionChart: React.FC = () => {
    const { filteredData } = useData();
    const { theme } = useTheme();

    const data = React.useMemo(() => {
        const bots = filteredData.filter(d => d.is_bot === 1);
        const normal = filteredData.filter(d => d.is_bot === 0);

        const calcConversion = (arr: typeof filteredData) =>
            arr.length ? (arr.reduce((acc, curr) => acc + curr.conversion_rate, 0) / arr.length) * 100 : 0;

        return [
            { name: 'Normal Traffic', value: calcConversion(normal), color: '#10b981' },
            { name: 'Bot Traffic', value: calcConversion(bots), color: '#ef4444' },
        ];
    }, [filteredData]);

    const axisColor = theme === 'dark' ? '#9CA3AF' : '#6B7280';
    const gridColor = theme === 'dark' ? '#374151' : '#E5E7EB';

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow h-[400px] flex flex-col transition-colors duration-200">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Avg. Conversion Rate (%)</h3>
            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                        <XAxis dataKey="name" stroke={axisColor} />
                        <YAxis unit="%" stroke={axisColor} />
                        <Tooltip
                            cursor={{ fill: theme === 'dark' ? '#374151' : '#f3f4f6' }}
                            formatter={(value: any) => [`${value?.toFixed(2)}%`, 'Conversion Rate']}
                            contentStyle={{
                                borderRadius: '8px',
                                border: 'none',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                backgroundColor: theme === 'dark' ? '#374151' : '#fff',
                                color: theme === 'dark' ? '#f3f4f6' : '#111827'
                            }}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
