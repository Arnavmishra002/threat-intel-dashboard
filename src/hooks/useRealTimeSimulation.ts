import { useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';
import type { SessionData } from '../types/data';

export const useRealTimeSimulation = (isActive: boolean) => {
    const { addData } = useData();
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isActive) {
            intervalRef.current = setInterval(() => {
                const isBot = Math.random() < 0.3; // 30% chance of bot
                const clicks = isBot ? (Math.random() * 5 + 2) : (Math.random() * 1.5);
                const duration = Math.random() * (isBot ? 2 : 20);

                const riskFactors = [];
                if (isBot && clicks > 2) riskFactors.push("High Click Velocity");
                if (isBot && duration < 5) riskFactors.push("Inventory Hoarding Behavior");

                const newSession: SessionData = {
                    session_id: `live_${Math.random().toString(36).substr(2, 9)}`,
                    timestamp: new Date().toISOString(),
                    ip_address: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
                    country: ['US', 'IN', 'DE', 'BR', 'RU', 'CN'][Math.floor(Math.random() * 6)],
                    risk_factors: riskFactors,

                    page_views: Math.floor(Math.random() * 10) + 1,
                    session_duration: duration,
                    bounce_rate: Math.random(),
                    traffic_source: ["Organic", "Paid", "Social", "Direct"][Math.floor(Math.random() * 4)],
                    time_on_page: Math.random() * 10,
                    previous_visits: Math.floor(Math.random() * 5),
                    conversion_rate: isBot ? 0.01 : 0.15,
                    // Anomaly Score: 0.0-1.0 (High = Threat)
                    anomaly: isBot ? (0.85 + Math.random() * 0.14) : (Math.random() * 0.25),
                    is_bot: isBot ? 1 : 0,
                    clicks_per_second: clicks,
                };

                addData(newSession);
            }, 1000); // New session every second
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isActive, addData]);
};
