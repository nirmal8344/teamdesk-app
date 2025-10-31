import React, { useState, useEffect } from 'react';
import { Deal, DealStage, User } from '../types';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import { PlusIcon, DotsVerticalIcon } from '../components/icons/Icons';
import * as api from '../services/api';

const stageColors: Record<DealStage, string> = {
  [DealStage.Qualification]: 'border-t-yellow-400',
  [DealStage.NeedsAnalysis]: 'border-t-blue-400',
  [DealStage.Proposal]: 'border-t-indigo-400',
  [DealStage.Negotiation]: 'border-t-purple-400',
  [DealStage.ClosedWon]: 'border-t-green-400',
  [DealStage.ClosedLost]: 'border-t-red-400',
};

const DealCard: React.FC<{ deal: Deal; onDragStart: (e: React.DragEvent<HTMLDivElement>, dealId: string) => void }> = ({ deal, onDragStart }) => {
    return (
        <div 
            draggable 
            onDragStart={(e) => onDragStart(e, deal.id)}
            className="bg-card border border-border p-4 mb-3 rounded-2xl shadow-sm cursor-grab active:cursor-grabbing transition-transform hover:scale-105"
        >
            <div className="flex justify-between items-start">
                <h4 className="font-semibold text-foreground">{deal.title}</h4>
                 <button className="text-muted-foreground hover:text-foreground">
                    <DotsVerticalIcon className="w-5 h-5"/>
                </button>
            </div>
            <p className="text-lg font-bold text-primary my-2">${deal.value.toLocaleString()}</p>
            <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>{deal.owner.name}</span>
                <img src={deal.owner.avatar} alt={deal.owner.name} className="w-6 h-6 rounded-full" />
            </div>
        </div>
    );
};

const KanbanColumn: React.FC<{ 
    stage: DealStage; 
    deals: Deal[];
    onDragStart: (e: React.DragEvent<HTMLDivElement>, dealId: string) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>, stage: DealStage) => void;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
}> = ({ stage, deals, onDragStart, onDrop, onDragOver }) => {
    const stageTotalValue = deals.reduce((sum, deal) => sum + deal.value, 0);

    return (
        <div 
            className="bg-muted/50 rounded-2xl w-72 flex-shrink-0 flex flex-col"
            onDrop={(e) => onDrop(e, stage)}
            onDragOver={onDragOver}
        >
            <div className={`p-4 border-t-4 ${stageColors[stage]} rounded-t-2xl`}>
                <h3 className="font-semibold text-foreground">{stage} ({deals.length})</h3>
                <p className="text-sm text-muted-foreground">${stageTotalValue.toLocaleString()}</p>
            </div>
            <div className="p-2 flex-1 overflow-y-auto">
                {deals.map(deal => (
                    <DealCard key={deal.id} deal={deal} onDragStart={onDragStart} />
                ))}
            </div>
        </div>
    );
};


const AddDealForm: React.FC<{ onAddDeal: (deal: Omit<Deal, 'id' | 'createdAt' | 'owner' | 'leadId' | 'closeDate'>) => void, onClose: () => void }> = ({ onAddDeal, onClose }) => {
    const [title, setTitle] = useState('');
    const [value, setValue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddDeal({
            title,
            value: Number(value),
            stage: DealStage.Qualification,
        });
        onClose();
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="deal-title" className="block text-sm font-medium text-muted-foreground mb-1">Deal Title</label>
                <input type="text" id="deal-title" value={title} onChange={e => setTitle(e.target.value)} required className="w-full px-4 py-2 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring text-foreground" />
            </div>
            <div>
                <label htmlFor="deal-value" className="block text-sm font-medium text-muted-foreground mb-1">Value ($)</label>
                <input type="number" id="deal-value" value={value} onChange={e => setValue(e.target.value)} required className="w-full px-4 py-2 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring text-foreground" />
            </div>
            <div className="flex justify-end pt-2">
                <button type="button" onClick={onClose} className="text-foreground font-semibold py-2 px-4 rounded-xl mr-2 hover:bg-accent">Cancel</button>
                <button type="submit" className="bg-primary text-primary-foreground px-5 py-2 font-semibold rounded-xl shadow-lg shadow-primary/30 hover:bg-opacity-90 transition">Add Deal</button>
            </div>
        </form>
    );
};

const LoadingKanban: React.FC = () => (
    <div className="flex-1 flex space-x-4 overflow-x-auto pb-4 -mx-8 px-8">
        {Object.values(DealStage).map(stage => (
            <div key={stage} className="bg-muted/50 rounded-2xl w-72 flex-shrink-0 flex flex-col animate-pulse">
                <div className="p-4">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2 mt-2"></div>
                </div>
                <div className="p-2 flex-1">
                    <div className="bg-card h-24 rounded-2xl mb-3"></div>
                    <div className="bg-card h-24 rounded-2xl"></div>
                </div>
            </div>
        ))}
    </div>
);


const Deals: React.FC = () => {
    const [deals, setDeals] = useState<Deal[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                setIsLoading(true);
                const fetchedDeals = await api.getDeals();
                setDeals(fetchedDeals);
            } catch (err) {
                setError("Failed to fetch deals.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDeals();
    }, []);


    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, dealId: string) => {
        e.dataTransfer.setData("dealId", dealId);
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>, newStage: DealStage) => {
        e.preventDefault();
        const dealId = e.dataTransfer.getData("dealId");
        const originalDeals = [...deals];
        
        // Optimistic UI update
        const updatedDeals = deals.map(deal => 
            deal.id === dealId ? { ...deal, stage: newStage } : deal
        );
        setDeals(updatedDeals);

        try {
            await api.updateDeal(dealId, { stage: newStage });
        } catch (err) {
            setError("Failed to update deal. Reverting change.");
            setDeals(originalDeals); // Revert on failure
        }
    };
    
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleAddDeal = async (newDealData: Omit<Deal, 'id' | 'createdAt' | 'owner' | 'leadId' | 'closeDate'>) => {
        try {
            const addedDeal = await api.createDeal(newDealData);
            setDeals(prevDeals => [addedDeal, ...prevDeals]);
        } catch (err) {
            setError("Failed to add new deal.");
        }
    };

    const stages = Object.values(DealStage);

    return (
        <div className="h-full flex flex-col">
            <div className="flex flex-wrap gap-4 justify-between items-center mb-8">
                <h1 className="text-3xl font-bold font-display text-foreground">Deals Pipeline</h1>
                 <button onClick={() => setModalOpen(true)} className="flex items-center bg-primary text-primary-foreground px-5 py-3 font-semibold rounded-2xl shadow-lg shadow-primary/30 hover:bg-opacity-90 transition-all">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Add Deal
                </button>
            </div>
            
            {error && <div className="text-destructive text-center mb-4">{error}</div>}
            
            {isLoading ? (
                <LoadingKanban />
            ) : (
                <div className="flex-1 flex space-x-4 overflow-x-auto pb-4 -mx-8 px-8">
                    {stages.map(stage => (
                        <KanbanColumn 
                            key={stage}
                            stage={stage}
                            deals={deals.filter(deal => deal.stage === stage)}
                            onDragStart={handleDragStart}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                        />
                    ))}
                </div>
            )}
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Add New Deal">
                <AddDealForm onAddDeal={handleAddDeal} onClose={() => setModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default Deals;
