import React from 'react';
import { DataProvider, useData } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import { DashboardLayout } from './components/Layout/DashboardLayout';
import { StatCard } from './components/KPI/StatCard';
import { TrafficDistributionChart } from './components/Charts/TrafficDistributionChart';
import { BehavioralComparisonChart } from './components/Charts/BehavioralComparisonChart';
import { AnomalyScatterPlot } from './components/Charts/AnomalyScatterPlot';
import { TrafficSourceChart } from './components/Charts/TrafficSourceChart';
import { ConversionChart } from './components/Charts/ConversionChart';
import { SuspiciousTable } from './components/Table/SuspiciousTable';
import { Users, AlertOctagon, Activity, Clock } from 'lucide-react';
import { AIThreatSummary } from './components/AI/AIThreatSummary';
import { GeoMapChart } from './components/Charts/GeoMapChart';
import { NLQueryBar } from './components/Search/NLQueryBar';
import { ThreatLeaderboard } from './components/Live/ThreatLeaderboard';

const DashboardContent: React.FC = () => {
    const { metrics, loading } = useData();

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600" />
            </div>
        );
    }

    return (
        <div className="flex gap-6">
            <div className="flex-1 space-y-6" id="dashboard-capture">
                <NLQueryBar />
                <AIThreatSummary />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="Total Sessions" value={metrics.totalSessions.toLocaleString()} icon={Users} color="blue" />
                    <StatCard title="Suspicious Sessions" value={metrics.suspiciousSessions.toLocaleString()} icon={AlertOctagon} color="red" />
                    <StatCard title="Bot Percentage" value={`${metrics.botPercentage.toFixed(1)}%`} icon={Activity} color={metrics.botPercentage > 10 ? 'red' : 'green'} />
                    <StatCard title="Avg Duration" value={`${metrics.avgDuration.toFixed(1)}s`} icon={Clock} color="indigo" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <TrafficDistributionChart />
                    <BehavioralComparisonChart />
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Advanced Analytics</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        <TrafficSourceChart />
                        <GeoMapChart />
                        <ConversionChart />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <SuspiciousTable />
                    <AnomalyScatterPlot />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-8 dark:bg-blue-900/20 dark:border-blue-800 transition-colors duration-200">
                    <h4 className="text-md font-semibold text-blue-800 mb-2 dark:text-blue-300">Security Context: Payment Gateway Protection</h4>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">
                        This dashboard monitors traffic to <strong>SecurePay's checkout endpoints</strong>. The analysis focuses on detecting automated scripts attempting:
                    </p>
                    <ul className="list-disc list-inside text-sm text-blue-600 dark:text-blue-400 mt-1 ml-2">
                        <li><strong>Card Cracking / Credential Stuffing:</strong> Indicated by high velocity clicks (Clicks/Sec &gt; 2.0).</li>
                        <li><strong>Inventory Hoarding:</strong> Indicated by short durations but high page views.</li>
                    </ul>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                        <span className="font-semibold">Detection Logic:</span> Anomalies are flagged using an Isolation Forest algorithm (5% contamination).
                        Sessions with <code>is_bot: 1</code> show statistically significant deviations in behavioral patterns.
                    </p>
                </div>
            </div>

            <div className="hidden xl:block w-80 flex-shrink-0">
                <div className="sticky top-6">
                    <ThreatLeaderboard />
                </div>
            </div>
        </div>
    );
};

function App() {
    return (
        <ThemeProvider>
            <DataProvider>
                <DashboardLayout>
                    <DashboardContent />
                </DashboardLayout>
            </DataProvider>
        </ThemeProvider>
    );
}

export default App;
