import React, { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { useData } from '../../context/DataContext';

const PRESET_CHIPS: { label: string; query: string }[] = [
    { label: '🤖 Show Bots', query: 'show bot sessions' },
    { label: '🔥 High Risk', query: 'high risk' },
    { label: '➡️ Direct Traffic', query: 'direct traffic' },
    { label: '🌏 From India', query: 'sessions from india' },
    { label: '⚡ Fast Clicks', query: 'clicks above 3' },
];

export const NLQueryBar: React.FC = () => {
    const { filters, setFilters, data, filteredData } = useData();
    const [inputValue, setInputValue] = useState(filters.searchQuery ?? '');

    const applyQuery = useCallback((query: string) => {
        setInputValue(query);
        setFilters((prev) => ({ ...prev, searchQuery: query }));
    }, [setFilters]);

    const clearQuery = useCallback(() => applyQuery(''), [applyQuery]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => applyQuery(e.target.value);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') clearQuery();
    };

    const isFiltered = inputValue.trim().length > 0;
    const total = data.length;
    const shown = filteredData.length;
    const isOverFiltered = isFiltered && total > 0 && shown / total < 0.2;

    return (
        <div className="space-y-2">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder='Search: "show bot sessions", "high risk", "from india", "clicks above 5"…'
                    className="w-full pl-10 pr-10 py-3 rounded-lg text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 focus:border-transparent shadow-sm transition-all duration-200"
                />
                {isFiltered && (
                    <button onClick={clearQuery} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
                {isFiltered && (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-200 ${isOverFiltered
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 ring-1 ring-amber-400'
                            : 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300'
                        }`}>
                        🔍 Showing {shown.toLocaleString()} of {total.toLocaleString()} sessions
                        {isOverFiltered && ' — try a broader query'}
                    </span>
                )}
                {PRESET_CHIPS.map((chip) => (
                    <button
                        key={chip.query}
                        onClick={() => applyQuery(chip.query)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150 ${inputValue === chip.query
                                ? 'bg-indigo-100 border-indigo-400 text-indigo-800 dark:bg-indigo-900/50 dark:border-indigo-500 dark:text-indigo-200'
                                : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                            }`}
                    >
                        {chip.label}
                    </button>
                ))}
            </div>
        </div>
    );
};
