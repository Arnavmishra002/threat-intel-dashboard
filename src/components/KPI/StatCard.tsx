import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    color: 'red' | 'blue' | 'green' | 'indigo' | 'yellow';
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, trend }) => {
    const colorClasses = {
        red: 'bg-red-50 text-red-600',
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        indigo: 'bg-indigo-50 text-indigo-600',
        yellow: 'bg-yellow-50 text-yellow-600',
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 flex items-center justify-between transition-colors duration-200">
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</p>
                <div className="mt-1 flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
                    {trend && (
                        <span className={`ml-2 text-sm font-medium ${trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {trend.isPositive ? '↑' : '↓'} {trend.value}%
                        </span>
                    )}
                </div>
            </div>
            <div className={`p-3 rounded-full ${colorClasses[color]} dark:bg-opacity-20`}>
                <Icon className="h-6 w-6" />
            </div>
        </div>
    );
};
