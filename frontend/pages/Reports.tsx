import React, { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import * as api from '../services/api';

interface ReportSummary {
    totalLeads: number;
    conversionRate: number;
    totalRevenue: number;
    avgDealSize: number;
}

interface MonthlyRevenue {
    name: string;
    revenue: number;
}

const Reports: React.FC = () => {
    const { theme } = useTheme();
    const [summary, setSummary] = useState<ReportSummary | null>(null);
    const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const tickColor = 'hsl(var(--muted-foreground))';
    const tooltipStyle = {
        backgroundColor: 'hsl(var(--card))',
        border: `1px solid hsl(var(--border))`,
        borderRadius: '0.75rem',
        color: 'hsl(var(--foreground))'
    };

    useEffect(() => {
        const fetchReports = async () => {
            try {
                setIsLoading(true);
                const [summaryData, revenueData] = await Promise.all([
                    api.getReportSummary(),
                    api.getMonthlyRevenue(),
                ]);
                setSummary(summaryData);
                setMonthlyRevenue(revenueData);
            } catch (err) {
                setError('Failed to load report data.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchReports();
    }, []);

    if (isLoading) {
        return (
            <div>
                 <h1 className="text-3xl font-bold font-display text-foreground mb-8">Reports & Analytics</h1>
                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mt-20"></div>
            </div>
        );
    }
    
    if (error) {
        return <div className="text-center text-destructive py-20">{error}</div>;
    }

  return (
    <div>
      <h1 className="text-3xl font-bold font-display text-foreground mb-8">Reports & Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <h3 className="text-muted-foreground font-semibold">Total Leads</h3>
          <p className="text-3xl font-bold text-foreground mt-2">{summary?.totalLeads}</p>
        </Card>
        <Card>
          <h3 className="text-muted-foreground font-semibold">Conversion Rate</h3>
          <p className="text-3xl font-bold text-foreground mt-2">{summary?.conversionRate.toFixed(1)}%</p>
        </Card>
        <Card>
          <h3 className="text-muted-foreground font-semibold">Total Revenue</h3>
          <p className="text-3xl font-bold text-foreground mt-2">${summary?.totalRevenue.toLocaleString()}</p>
        </Card>
        <Card>
          <h3 className="text-muted-foreground font-semibold">Avg. Deal Size</h3>
          <p className="text-3xl font-bold text-foreground mt-2">${summary?.avgDealSize.toLocaleString()}</p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold font-display text-foreground mb-4">Monthly Revenue</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue}>
                  <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: tickColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: tickColor, fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{fill: 'hsla(var(--primary), 0.1)'}}/>
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default Reports;
