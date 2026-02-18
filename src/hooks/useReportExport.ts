import { useState, useCallback } from 'react';

interface ReportMetrics {
    totalSessions: number;
    botPercentage: number;
    suspiciousSessions: number;
    avgClicksPerSecond: number;
}

interface UseReportExportReturn {
    isGenerating: boolean;
    wasSuccess: boolean;
    generateReport: (metrics: ReportMetrics) => Promise<void>;
}

function getThreatLevel(botPercentage: number): string {
    if (botPercentage >= 40) return 'CRITICAL';
    if (botPercentage >= 20) return 'ELEVATED';
    if (botPercentage >= 10) return 'MODERATE';
    return 'NORMAL';
}

function formatTimestamp(date: Date): string {
    return date.toLocaleString('en-US', { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function getFileTimestamp(date: Date): string {
    return date.toISOString().slice(0, 10);
}

export const useReportExport = (): UseReportExportReturn => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [wasSuccess, setWasSuccess] = useState(false);

    const generateReport = useCallback(async (metrics: ReportMetrics) => {
        setIsGenerating(true);
        setWasSuccess(false);

        try {
            const [html2canvasModule, jsPDFModule] = await Promise.all([
                import('html2canvas'),
                import('jspdf'),
            ]);
            const html2canvas = html2canvasModule.default;
            const jsPDF = jsPDFModule.default;

            const now = new Date();
            const threatLevel = getThreatLevel(metrics.botPercentage);

            const captureEl = document.getElementById('dashboard-capture');
            if (!captureEl) throw new Error('#dashboard-capture element not found');

            const canvas = await html2canvas(captureEl, { scale: 1.5, useCORS: true, backgroundColor: null, logging: false });
            const screenshotDataUrl = canvas.toDataURL('image/jpeg', 0.85);

            const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
            const PAGE_W = 210;
            const PAGE_H = 297;
            const MARGIN = 15;
            const CONTENT_W = PAGE_W - MARGIN * 2;

            // Header bar
            doc.setFillColor(30, 41, 59);
            doc.rect(0, 0, PAGE_W, 28, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('SecurePay Threat Monitor', MARGIN, 12);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.text('Security Incident Report — Confidential', MARGIN, 20);
            doc.text(`Generated: ${formatTimestamp(now)}`, PAGE_W - MARGIN, 12, { align: 'right' });

            // Threat level badge
            const badgeColors: Record<string, [number, number, number]> = {
                CRITICAL: [220, 38, 38], ELEVATED: [234, 88, 12], MODERATE: [202, 138, 4], NORMAL: [22, 163, 74],
            };
            const [r, g, b] = badgeColors[threatLevel] ?? [100, 100, 100];
            doc.setFillColor(r, g, b);
            doc.roundedRect(PAGE_W - MARGIN - 34, 15, 34, 9, 2, 2, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.text(threatLevel, PAGE_W - MARGIN - 17, 21, { align: 'center' });

            // KPI section
            let y = 38;
            doc.setTextColor(30, 41, 59);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text('Executive Summary', MARGIN, y);
            y += 2;
            doc.setDrawColor(99, 102, 241);
            doc.setLineWidth(0.5);
            doc.line(MARGIN, y, MARGIN + CONTENT_W, y);
            y += 7;

            const kpiRows: [string, string][] = [
                ['Total Sessions Analysed', metrics.totalSessions.toLocaleString()],
                ['Suspicious (Bot) Sessions', metrics.suspiciousSessions.toLocaleString()],
                ['Bot Traffic Percentage', `${metrics.botPercentage.toFixed(2)}%`],
                ['Avg. Clicks Per Second', metrics.avgClicksPerSecond.toFixed(3)],
                ['Threat Level', threatLevel],
            ];

            doc.setFontSize(9);
            kpiRows.forEach(([label, value], i) => {
                const rowY = y + i * 8;
                if (i % 2 === 0) { doc.setFillColor(248, 250, 252); doc.rect(MARGIN, rowY - 4, CONTENT_W, 7, 'F'); }
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(71, 85, 105);
                doc.text(label, MARGIN + 3, rowY);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(15, 23, 42);
                doc.text(value, PAGE_W - MARGIN - 3, rowY, { align: 'right' });
            });

            y += kpiRows.length * 8 + 8;

            // Screenshot section
            doc.setTextColor(30, 41, 59);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text('Dashboard Snapshot', MARGIN, y);
            y += 2;
            doc.setDrawColor(99, 102, 241);
            doc.line(MARGIN, y, MARGIN + CONTENT_W, y);
            y += 5;

            const imgRatio = canvas.width / canvas.height;
            const imgW = CONTENT_W;
            const imgH = Math.min(imgW / imgRatio, PAGE_H - y - 20);
            doc.addImage(screenshotDataUrl, 'JPEG', MARGIN, y, imgW, imgH);

            // Footer
            doc.setFillColor(248, 250, 252);
            doc.rect(0, PAGE_H - 12, PAGE_W, 12, 'F');
            doc.setTextColor(148, 163, 184);
            doc.setFontSize(7);
            doc.setFont('helvetica', 'normal');
            doc.text('Confidential — SecurePay Internal Security Team | Do not distribute', PAGE_W / 2, PAGE_H - 5, { align: 'center' });

            doc.save(`SecurePay_Report_${getFileTimestamp(now)}.pdf`);
            setWasSuccess(true);
            setTimeout(() => setWasSuccess(false), 3000);
        } catch (err) {
            console.error('Report generation failed:', err);
        } finally {
            setIsGenerating(false);
        }
    }, []);

    return { isGenerating, wasSuccess, generateReport };
};
