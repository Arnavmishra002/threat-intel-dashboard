import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

const mockGeoData = [
    { country: 'USA', bots: 450, normal: 1200, risk: 'High' },
    { country: 'China', bots: 380, normal: 400, risk: 'Critical' },
    { country: 'Russia', bots: 310, normal: 150, risk: 'Critical' },
    { country: 'Brazil', bots: 120, normal: 500, risk: 'Medium' },
    { country: 'Germany', bots: 90, normal: 600, risk: 'Low' },
    { country: 'India', bots: 200, normal: 900, risk: 'Medium' },
];

export const GeoMapChart: React.FC = () => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow transition-colors duration-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                Geographic Threat Origin (Top 6)
            </h3>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        layout="vertical"
                        data={mockGeoData}
                        margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#374151" opacity={0.2} />
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="country"
                            type="category"
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            width={60}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                            itemStyle={{ color: '#F3F4F6' }}
                            cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                        />
                        <Bar dataKey="bots" name="Bot Traffic" fill="#EF4444" radius={[0, 4, 4, 0]}>
                            {mockGeoData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.risk === 'Critical' ? '#DC2626' : '#EF4444'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                * Based on IP reputation analysis (Mock Data)
            </div>
        </div>
    );
};
