import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  ResponsiveContainer, Tooltip
} from 'recharts';
import Card from '../components/common/Card';
import { ChevronDownIcon, SortIcon, FilterIcon, DotsVerticalIcon, TrophyIcon, DownloadIcon } from '../components/icons/Icons';
import { useTheme } from '../contexts/ThemeContext';
import * as api from '../services/api';
import { Deal } from '../types';


const PURCHASE_SOURCE_COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
);

const SalesHeatmap: React.FC = () => {
    // This component remains static for now, but could be API-driven
    const days = Array.from({ length: 49 }, (_, i) => {
        const value = Math.floor(Math.random() * 1200);
        let colorClass = 'bg-muted/30';
        if (value > 900) colorClass = 'bg-primary';
        else if (value > 600) colorClass = 'bg-primary/70';
        else if (value > 300) colorClass = 'bg-primary/50';
        else if (value > 0) colorClass = 'bg-primary/30';
        return { day: i + 1, value, colorClass };
    });

    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <Card className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-md font-semibold font-display text-foreground">Sales per week</h2>
                <button className="text-xs text-muted-foreground flex items-center">Last 7 days <ChevronDownIcon className="w-4 h-4 ml-1" /></button>
            </div>
            <div className="flex-1 grid grid-cols-7 grid-rows-7 gap-2">
                {days.map(d => (
                    <div key={d.day} className={`w-full aspect-square rounded ${d.colorClass}`} title={`${d.value} sales`}></div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-2 mt-2">
                {dayLabels.map(label => <div key={label} className="text-center text-xs text-muted-foreground">{label}</div>)}
            </div>
        </Card>
    );
};


const Dashboard: React.FC = () => {
    const { theme } = useTheme();
    const [isSortOpen, setSortOpen] = useState(false);
    const [isFilterOpen, setFilterOpen] = useState(false);
    const sortRef = useRef<HTMLDivElement>(null);
    const filterRef = useRef<HTMLDivElement>(null);
    
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const data = await api.getDashboardData();
                setDashboardData(data);
            } catch (err) {
                setError("Failed to load dashboard data.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();

        const handleClickOutside = (event: MouseEvent) => {
            if (sortRef.current && !sortRef.current.contains(event.target as Node)) setSortOpen(false);
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) setFilterOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    
    const tickColor = theme === 'dark' ? 'hsl(var(--muted-foreground))' : 'hsl(var(--muted-foreground))';
    const tooltipStyle = {
        backgroundColor: 'hsl(var(--card))',
        border: `1px solid hsl(var(--border))`,
        borderRadius: '0.75rem',
        color: 'hsl(var(--foreground))'
    };
    
    if (isLoading) {
        return <div className="flex items-center justify-center h-64"><LoadingSpinner /></div>;
    }

    if (error) {
        return <div className="text-center text-destructive">{error}</div>;
    }

    const { overallSalesData, totalSales, purchaseSourceData, visitorData, countryData, salesHistoryData } = dashboardData;

    return (
        <div>
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-display text-foreground">Analytics Overview,</h1>
                    <p className="text-sm text-muted-foreground">DECEMBER 02 - 08 (9:00AM)</p>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="relative" ref={sortRef}>
                        <button onClick={() => setSortOpen(!isSortOpen)} className="flex items-center space-x-2 px-3 py-1.5 bg-card border border-border rounded-md text-sm">
                            <SortIcon className="w-4 h-4 text-muted-foreground" />
                            <span>Sort By</span>
                        </button>
                        {isSortOpen && (
                             <div className="absolute top-full right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-10 py-1">
                                <a href="#" onClick={(e) => {e.preventDefault(); setSortOpen(false);}} className="block px-4 py-2 text-sm text-muted-foreground hover:bg-accent">Date</a>
                                <a href="#" onClick={(e) => {e.preventDefault(); setSortOpen(false);}} className="block px-4 py-2 text-sm text-muted-foreground hover:bg-accent">Value</a>
                                <a href="#" onClick={(e) => {e.preventDefault(); setSortOpen(false);}} className="block px-4 py-2 text-sm text-muted-foreground hover:bg-accent">Owner</a>
                            </div>
                        )}
                    </div>
                     <div className="relative" ref={filterRef}>
                        <button onClick={() => setFilterOpen(!isFilterOpen)} className="flex items-center space-x-2 px-3 py-1.5 bg-card border border-border rounded-md text-sm">
                            <FilterIcon className="w-4 h-4 text-muted-foreground" />
                            <span>Filter By</span>
                        </button>
                        {isFilterOpen && (
                             <div className="absolute top-full right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-10 py-1">
                                <a href="#" onClick={(e) => {e.preventDefault(); setFilterOpen(false);}} className="block px-4 py-2 text-sm text-muted-foreground hover:bg-accent">All Sources</a>
                                <a href="#" onClick={(e) => {e.preventDefault(); setFilterOpen(false);}} className="block px-4 py-2 text-sm text-muted-foreground hover:bg-accent">Social Media</a>
                                <a href="#" onClick={(e) => {e.preventDefault(); setFilterOpen(false);}} className="block px-4 py-2 text-sm text-muted-foreground hover:bg-accent">Referral</a>
                            </div>
                        )}
                    </div>
                     <button className="flex items-center space-x-2 px-3 py-1.5 bg-card border border-border rounded-md text-sm">
                        <span>December, 2021</span>
                    </button>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                
                {/* Overall Sales Chart */}
                <Card className="xl:col-span-2">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Overall Sales</p>
                            <h2 className="text-2xl font-bold font-display text-foreground">${totalSales.toLocaleString()}</h2>
                        </div>
                        <div className="flex items-center space-x-4 text-xs">
                             <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 rounded-full bg-primary"></div>
                                <span>Current Week</span>
                             </div>
                              <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 rounded-full bg-secondary"></div>
                                <span>Last Week</span>
                             </div>
                        </div>
                    </div>
                    <div className="h-60">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={overallSalesData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '3 3' }} />
                                <XAxis dataKey="name" tick={{ fill: tickColor, fontSize: 10 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: tickColor, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                                <Area type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#colorSales)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Source of Purchases */}
                 <Card>
                     <h2 className="text-md font-semibold font-display text-foreground mb-4">Source of Purchases</h2>
                     <div className="h-32 w-32 mx-auto relative flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={[{ value: 100 }]} dataKey="value" cx="50%" cy="50%" outerRadius={50} innerRadius={42} fill="hsl(var(--primary))" stroke="none" startAngle={90} endAngle={-270} />
                                <Pie data={[{ value: 100 }]} dataKey="value" cx="50%" cy="50%" outerRadius={60} innerRadius={52} fill="hsl(var(--warning))" stroke="none" startAngle={90} endAngle={-90} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-bold">100%</span>
                            <span className="text-xs text-muted-foreground">-18.7%</span>
                        </div>
                     </div>
                      <div className="text-center my-3">
                         <span className="text-xs font-semibold text-destructive bg-destructive/10 px-2 py-1 rounded">* POOR SALES</span>
                      </div>
                     <div className="space-y-2 text-sm">
                        {purchaseSourceData.map((entry: any, index: number) => (
                            <div key={entry.name} className="flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: PURCHASE_SOURCE_COLORS[index]}}></div>
                                    <span>{entry.name}</span>
                                </div>
                                <span>{entry.value}%</span>
                            </div>
                        ))}
                     </div>
                </Card>

                 {/* Visitors */}
                <Card>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-md font-semibold font-display text-foreground">Visitors</h2>
                        <DotsVerticalIcon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="h-40">
                       <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={visitorData} margin={{ top: 5, right: 0, left: -30, bottom: -10 }}>
                                <XAxis dataKey="name" tick={{ fill: tickColor, fontSize: 10 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: tickColor, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                                <Tooltip contentStyle={tooltipStyle} cursor={{fill: 'hsla(var(--primary), 0.1)'}}/>
                                <Bar dataKey="visitors" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={10}/>
                           </BarChart>
                       </ResponsiveContainer>
                    </div>
                    <div className="mt-4 flex items-center space-x-3 bg-muted p-3 rounded-lg">
                        <div className="bg-success/10 p-2 rounded-full">
                            <TrophyIcon className="w-5 h-5 text-success"/>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-foreground">Congratulations</p>
                            <p className="text-xs text-muted-foreground">You've just hit a new record.</p>
                        </div>
                    </div>
                </Card>

                {/* 72 Countries */}
                <Card className="lg:col-span-2">
                     <div className="flex justify-between items-center mb-4">
                        <h2 className="text-md font-semibold font-display text-foreground">72 Countries (71063 Sales)</h2>
                        <button className="text-xs text-muted-foreground flex items-center">Last 7 days <ChevronDownIcon className="w-4 h-4 ml-1" /></button>
                    </div>
                     <div className="h-64 -ml-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={countryData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={80} tick={{ fill: tickColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={tooltipStyle} cursor={{fill: 'hsla(var(--primary), 0.1)'}}/>
                                <Bar dataKey="sales" barSize={12} radius={[0, 4, 4, 0]}>
                                    {countryData.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={index === 3 ? "hsl(var(--warning))" : "hsl(var(--primary))"} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                     </div>
                </Card>

                 {/* Sales per week */}
                 <SalesHeatmap />

                {/* Sales History */}
                <Card>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-md font-semibold font-display text-foreground">Sales History</h2>
                        <DotsVerticalIcon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="space-y-4">
                        {salesHistoryData.map((deal: Deal, index: number) => (
                             <div key={deal.id} className="flex items-center space-x-3">
                                <img src={deal.owner.avatar} alt={deal.owner.name} className="w-8 h-8 rounded-full" />
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-foreground">{deal.owner.name}</p>
                                    <p className="text-xs text-muted-foreground">United States</p>
                                </div>
                                <span className={`text-sm font-bold ${index === 1 ? 'text-blue-400' : 'text-foreground'}`}>
                                    ${deal.value.toFixed(2)}
                                </span>
                             </div>
                        ))}
                    </div>
                    <button className="mt-4 w-full flex items-center justify-center space-x-2 text-sm font-semibold text-primary hover:underline">
                        <DownloadIcon className="w-4 h-4" />
                        <span>Download</span>
                    </button>
                </Card>

            </div>
        </div>
    );
};

export default Dashboard;
