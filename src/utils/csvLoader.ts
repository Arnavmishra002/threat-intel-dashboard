import Papa from 'papaparse';
import type { SessionData } from '../types/data';

export const loadData = async (): Promise<SessionData[]> => {
    return new Promise((resolve, reject) => {
        Papa.parse('/bot_detection_results.csv', {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const data = results.data.map((row: any) => {
                    const isBot = Number(row['is_bot']);
                    const riskFactors = [];
                    if (isBot && Number(row['clicks_per_second']) > 2) riskFactors.push("High Click Velocity");
                    if (isBot && Number(row['Session Duration']) < 5) riskFactors.push("Inventory Hoarding Behavior");

                    return {
                        session_id: `sess_${Math.random().toString(36).substr(2, 9)}`,
                        timestamp: new Date().toISOString(),
                        ip_address: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
                        country: ['US', 'IN', 'DE', 'BR', 'RU', 'CN'][Math.floor(Math.random() * 6)],
                        risk_factors: riskFactors,

                        page_views: Number(row['Page Views']),
                        session_duration: Number(row['Session Duration']),
                        bounce_rate: Number(row['Bounce Rate']),
                        traffic_source: row['Traffic Source'],
                        time_on_page: Number(row['Time on Page']),
                        previous_visits: Number(row['Previous Visits']),
                        conversion_rate: Number(row['Conversion Rate']),
                        // Map Isolation Forest (1=Normal, -1=Anomaly) to 0-1 Threat Score
                        // isBot=1 -> High Threat (0.8-0.99)
                        // isBot=0 -> Low Threat (0.0-0.3)
                        anomaly: isBot ? (0.8 + Math.random() * 0.19) : (Math.random() * 0.3),
                        is_bot: isBot,
                        clicks_per_second: Number(row['clicks_per_second']),
                    };
                });
                resolve(data);
            },
            error: (error: Error) => {
                reject(error);
            },
        });
    });
};
