export interface SessionData {
    session_id: string; // [NEW] Unique ID
    timestamp: string; // [NEW] ISO string
    ip_address: string; // [NEW]
    country: string; // [NEW]
    risk_factors: string[]; // [NEW]

    page_views: number;
    session_duration: number;
    bounce_rate: number;
    traffic_source: string;
    time_on_page: number;
    previous_visits: number;
    conversion_rate: number;
    anomaly: number; // 1 or -1
    is_bot: number; // 1 = Bot, 0 = Normal
    clicks_per_second: number;
}

export interface DashboardMetrics {
    totalSessions: number;
    suspiciousSessions: number;
    botPercentage: number;
    avgDuration: number;
    avgPageViews: number;
    avgBounceRate: number;
    avgClicksPerSecond: number;
}

export interface FilterState {
    isBot: 'all' | 'bot' | 'normal';
    minDuration: number;
    maxDuration: number;
    trafficSource: string[];
    searchQuery: string; // [NEW]
}
