import React from 'react';
import { FileDown, Loader2, CheckCircle2 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useReportExport } from '../../hooks/useReportExport';

export const ReportExporter: React.FC = () => {
    const { metrics } = useData();
    const { isGenerating, wasSuccess, generateReport } = useReportExport();

    const handleClick = () => {
        if (isGenerating) return;
        generateReport({
            totalSessions: metrics.totalSessions,
            botPercentage: metrics.botPercentage,
            suspiciousSessions: metrics.suspiciousSessions,
            avgClicksPerSecond: metrics.avgClicksPerSecond,
        });
    };

    let buttonClass = 'flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ';

    if (wasSuccess) {
        buttonClass += 'bg-emerald-100 text-emerald-700 focus:ring-emerald-500 dark:bg-emerald-900/30 dark:text-emerald-300 cursor-default';
    } else if (isGenerating) {
        buttonClass += 'bg-violet-100 text-violet-600 cursor-not-allowed opacity-80 dark:bg-violet-900/30 dark:text-violet-300';
    } else {
        buttonClass += 'bg-violet-100 text-violet-700 hover:bg-violet-200 focus:ring-violet-500 dark:bg-violet-900/30 dark:text-violet-300 dark:hover:bg-violet-900/50';
    }

    return (
        <button onClick={handleClick} disabled={isGenerating} aria-label="Export PDF report" className={buttonClass}>
            {wasSuccess ? <CheckCircle2 className="w-4 h-4 mr-2" /> : isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileDown className="w-4 h-4 mr-2" />}
            {wasSuccess ? 'Report Saved ✓' : isGenerating ? 'Generating…' : 'Export Report'}
        </button>
    );
};
