import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { SessionData, FilterState, DashboardMetrics } from '../types/data';
import { loadData } from '../utils/csvLoader';

interface DataContextType {
    data: SessionData[];
    filteredData: SessionData[];
    loading: boolean;
    filters: FilterState;
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
    metrics: DashboardMetrics;
    maxDataDuration: number;
    addData: (newSession: SessionData) => void;
}

const defaultFilters: FilterState = {
    isBot: 'all',
    minDuration: 0,
    maxDuration: 1000,
    trafficSource: [],
    searchQuery: '',
};

const DataContext = createContext<DataContextType | undefined>(undefined);

function matchesNLQuery(item: SessionData, query: string): boolean {
    if (!query.trim()) return true;
    const q = query.toLowerCase();

    if ((q.includes('bot') || q.includes('suspicious')) && item.is_bot !== 1) return false;
    if ((q.includes('human') || q.includes('normal') || q.includes('legit')) && item.is_bot !== 0) return false;

    if (q.includes('direct') && item.traffic_source !== 'Direct') return false;
    if (q.includes('organic') && item.traffic_source !== 'Organic') return false;
    if (q.includes('social') && item.traffic_source !== 'Social') return false;
    if (q.includes('paid') && item.traffic_source !== 'Paid') return false;
    if (q.includes('referral') && item.traffic_source !== 'Referral') return false;

    if ((q.includes('high anomaly') || q.includes('high risk')) && item.anomaly < 0.75) return false;
    if ((q.includes('low anomaly') || q.includes('low risk')) && item.anomaly >= 0.4) return false;

    const countryMap: Record<string, string> = {
        india: 'IN', us: 'US', usa: 'US', 'united states': 'US',
        germany: 'DE', brazil: 'BR', russia: 'RU', china: 'CN',
        uk: 'GB', france: 'FR', canada: 'CA', australia: 'AU',
        japan: 'JP', netherlands: 'NL',
    };
    for (const [name, code] of Object.entries(countryMap)) {
        if (q.includes(name) && item.country !== code) return false;
    }

    const clickAbove = q.match(/clicks?(?:\s+per\s+second)?\s+above\s+(\d+(?:\.\d+)?)/);
    if (clickAbove && item.clicks_per_second <= parseFloat(clickAbove[1])) return false;

    const clickBelow = q.match(/clicks?(?:\s+per\s+second)?\s+below\s+(\d+(?:\.\d+)?)/);
    if (clickBelow && item.clicks_per_second >= parseFloat(clickBelow[1])) return false;

    return true;
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [data, setData] = useState<SessionData[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<FilterState>(defaultFilters);

    useEffect(() => {
        loadData()
            .then((loaded) => { setData(loaded); setLoading(false); })
            .catch((err) => { console.error('Failed to load data:', err); setLoading(false); });
    }, []);

    const addData = useCallback((newSession: SessionData) => {
        setData((prev) => {
            const next = [newSession, ...prev];
            return next.length > 2000 ? next.slice(0, 2000) : next;
        });
    }, []);

    const maxDataDuration = useMemo(
        () => Math.max(...data.map((d) => d.session_duration), 1000),
        [data]
    );

    const filteredData = useMemo(() => {
        const q = filters.searchQuery?.toLowerCase() ?? '';
        const lastNMatch = q.match(/last\s+(\d+)\s+sessions?/);
        const lastN = lastNMatch ? parseInt(lastNMatch[1]) : null;

        let result = data.filter((item) => {
            if (filters.isBot === 'bot' && item.is_bot !== 1) return false;
            if (filters.isBot === 'normal' && item.is_bot !== 0) return false;
            if (item.session_duration < filters.minDuration) return false;
            if (item.session_duration > filters.maxDuration) return false;
            if (filters.trafficSource.length > 0 && !filters.trafficSource.includes(item.traffic_source)) return false;
            if (!matchesNLQuery(item, q)) return false;
            return true;
        });

        if (lastN !== null) result = result.slice(0, lastN);
        return result;
    }, [data, filters]);

    const metrics = useMemo<DashboardMetrics>(() => {
        const totalSessions = filteredData.length;
        const suspiciousSessions = filteredData.filter((d) => d.is_bot === 1).length;
        const botPercentage = totalSessions > 0 ? (suspiciousSessions / totalSessions) * 100 : 0;
        const sum = (key: keyof SessionData) =>
            filteredData.reduce((acc, curr) => acc + (curr[key] as number), 0);
        return {
            totalSessions,
            suspiciousSessions,
            botPercentage,
            avgDuration: totalSessions > 0 ? sum('session_duration') / totalSessions : 0,
            avgPageViews: totalSessions > 0 ? sum('page_views') / totalSessions : 0,
            avgBounceRate: totalSessions > 0 ? sum('bounce_rate') / totalSessions : 0,
            avgClicksPerSecond: totalSessions > 0 ? sum('clicks_per_second') / totalSessions : 0,
        };
    }, [filteredData]);

    return (
        <DataContext.Provider value={{ data, filteredData, loading, filters, setFilters, metrics, maxDataDuration, addData }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = (): DataContextType => {
    const context = useContext(DataContext);
    if (context === undefined) throw new Error('useData must be used within a DataProvider');
    return context;
};
