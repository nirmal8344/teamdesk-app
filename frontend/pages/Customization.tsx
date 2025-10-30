import React, { useState } from 'react';
import Card from '../components/common/Card';

const Toggle: React.FC<{ label: string; enabled: boolean; onToggle: () => void; }> = ({ label, enabled, onToggle }) => (
    <div 
        onClick={onToggle}
        className="flex items-center justify-between p-4 border border-border rounded-2xl cursor-pointer hover:bg-accent"
    >
        <span className="font-semibold text-foreground">{label}</span>
        <div className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors ${enabled ? 'bg-primary' : 'bg-muted'}`}>
            <div className={`w-4 h-4 bg-white rounded-full transform transition-transform ${enabled ? 'translate-x-6' : 'translate-x-0'}`} />
        </div>
    </div>
);

const Customization: React.FC = () => {
    const [widgets, setWidgets] = useState({
        sales: true,
        aiSummary: true,
        leadSources: true,
        leadsByCountry: true,
        salesHistory: true,
        salesHeatmap: false,
        visitors: true,
    });
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

    const handleToggle = (widget: keyof typeof widgets) => {
        setWidgets(prev => ({ ...prev, [widget]: !prev[widget] }));
    };
    
    const handleSave = () => {
        setSaveStatus('saving');
        setTimeout(() => {
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        }, 1000);
    };

    const saveButtonText = () => {
        switch (saveStatus) {
            case 'saving': return 'Saving...';
            case 'saved': return 'Saved!';
            default: return 'Save Preferences';
        }
    };

  return (
    <div>
      <h1 className="text-3xl font-bold font-display text-foreground mb-8">Customization</h1>
       <Card>
            <h2 className="text-xl font-semibold text-foreground font-display mb-2">Dashboard Widgets</h2>
            <p className="text-muted-foreground mb-6">Choose which widgets to display on your dashboard.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Toggle label="Overall Sales Chart" enabled={widgets.sales} onToggle={() => handleToggle('sales')} />
                <Toggle label="AI Summary" enabled={widgets.aiSummary} onToggle={() => handleToggle('aiSummary')} />
                <Toggle label="Source of Leads" enabled={widgets.leadSources} onToggle={() => handleToggle('leadSources')} />
                <Toggle label="Leads by Country" enabled={widgets.leadsByCountry} onToggle={() => handleToggle('leadsByCountry')} />
                <Toggle label="Sales History" enabled={widgets.salesHistory} onToggle={() => handleToggle('salesHistory')} />
                <Toggle label="Sales Heatmap" enabled={widgets.salesHeatmap} onToggle={() => handleToggle('salesHeatmap')} />
                <Toggle label="Visitors Chart" enabled={widgets.visitors} onToggle={() => handleToggle('visitors')} />
            </div>

             <div className="flex justify-end mt-6">
                <button 
                    onClick={handleSave}
                    disabled={saveStatus !== 'idle'}
                    className={`bg-primary text-primary-foreground px-5 py-2 font-semibold rounded-xl shadow-lg shadow-primary/30 hover:bg-opacity-90 transition-all duration-300 ${saveStatus === 'saved' ? 'bg-success' : ''} ${saveStatus === 'saving' ? 'cursor-not-allowed opacity-70' : ''}`}
                >
                    {saveButtonText()}
                </button>
            </div>
      </Card>
    </div>
  );
};

export default Customization;