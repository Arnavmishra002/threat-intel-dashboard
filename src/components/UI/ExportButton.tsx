import React from 'react';
import { Download } from 'lucide-react';
import Papa from 'papaparse';
import { useData } from '../../context/DataContext';

export const ExportButton: React.FC = () => {
    const { filteredData } = useData();

    const handleExport = () => {
        if (filteredData.length === 0) return;

        // Convert data to CSV string
        const csv = Papa.unparse(filteredData);

        // Create a blob and trigger download
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `bot_detection_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <button
            onClick={handleExport}
            disabled={filteredData.length === 0}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 dark:focus:ring-offset-gray-900"
            title="Export filtered data to CSV"
        >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
        </button>
    );
};
