import React, { useState, useEffect } from 'react';
import { Lead, LeadStatus, User } from '../types';
import { PlusIcon } from '../components/icons/Icons';
import Modal from '../components/common/Modal';
import Card from '../components/common/Card';
import ImageUpload from '../components/common/ImageUpload';
import * as api from '../services/api';

const LeadStatusBadge: React.FC<{ status: LeadStatus }> = ({ status }) => {
  const colorClasses = {
    [LeadStatus.New]: 'bg-secondary/10 text-secondary',
    [LeadStatus.Contacted]: 'bg-blue-500/10 text-blue-400',
    [LeadStatus.Proposal]: 'bg-indigo-500/10 text-indigo-400',
    [LeadStatus.Negotiation]: 'bg-purple-500/10 text-purple-400',
    [LeadStatus.Won]: 'bg-success/10 text-success',
    [LeadStatus.Lost]: 'bg-destructive/10 text-destructive',
  };
  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full ${colorClasses[status]}`}>
      {status}
    </span>
  );
};

type AddLeadData = Omit<Lead, 'id' | 'status' | 'owner' | 'createdAt' | 'activities'>;

const AddLeadForm: React.FC<{ onAddLead: (leadData: AddLeadData) => void, onClose: () => void }> = ({ onAddLead, onClose }) => {
    const [formData, setFormData] = useState({ name: '', company: '', email: '', phone: '', source: 'Website', country: 'USA' });
    const [avatar, setAvatar] = useState<string | undefined>(undefined);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddLead({
            ...formData,
            avatar,
        });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
             <ImageUpload onImageSelect={setAvatar} />
             <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
             <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Company</label>
                <input type="text" name="company" value={formData.company} onChange={handleChange} required className="w-full px-4 py-2 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
             <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
             <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Phone</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="flex justify-end pt-2">
                <button type="button" onClick={onClose} className="text-foreground font-semibold py-2 px-4 rounded-xl mr-2 hover:bg-accent">Cancel</button>
                <button type="submit" className="bg-primary text-primary-foreground px-5 py-2 font-semibold rounded-xl shadow-lg shadow-primary/30 hover:bg-opacity-90 transition">Add Lead</button>
            </div>
        </form>
    );
};


const Leads: React.FC = () => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isEmailModalOpen, setEmailModalOpen] = useState(false);
    const [isSummaryModalOpen, setSummaryModalOpen] = useState(false);
    
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [generatedContent, setGeneratedContent] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                setIsLoading(true);
                const data = await api.getLeads();
                setLeads(data);
            } catch (err) {
                setError('Failed to fetch leads.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchLeads();
    }, []);

    const handleGenerateEmail = async (lead: Lead, type: 'follow-up' | 'introduction') => {
        setSelectedLead(lead);
        setEmailModalOpen(true);
        setIsAiLoading(true);
        setGeneratedContent('');
        try {
            const email = await api.generateLeadEmail(lead.id, type);
            setGeneratedContent(email);
        } catch (err) {
            setGeneratedContent("Sorry, couldn't generate the email.");
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleSummarize = async (lead: Lead) => {
        setSelectedLead(lead);
        setSummaryModalOpen(true);
        setIsAiLoading(true);
        setGeneratedContent('');
        try {
            const summary = await api.summarizeLeadActivities(lead.id);
            setGeneratedContent(summary);
        } catch (err) {
             setGeneratedContent("Sorry, couldn't generate the summary.");
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleAddLead = async (newLeadData: AddLeadData) => {
        try {
            const newLead = await api.createLead(newLeadData);
            setLeads(prevLeads => [newLead, ...prevLeads]);
        } catch (err) {
            setError('Failed to add lead.');
        }
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <tr>
                    <td colSpan={6} className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    </td>
                </tr>
            );
        }

        if (error) {
            return <tr><td colSpan={6} className="text-center py-8 text-destructive">{error}</td></tr>;
        }

        return leads.map((lead) => (
            <tr key={lead.id} className="border-b border-border hover:bg-muted/50">
                <th scope="row" className="px-6 py-4 font-medium text-foreground whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                        <img src={lead.avatar} alt={lead.name} className="w-8 h-8 rounded-full" />
                        <span>{lead.name}</span>
                    </div>
                </th>
                <td className="px-6 py-4">{lead.company}</td>
                <td className="px-6 py-4">
                    <LeadStatusBadge status={lead.status} />
                </td>
                <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                        <img src={lead.owner.avatar} alt={lead.owner.name} className="w-7 h-7 rounded-full" />
                        <span>{lead.owner.name}</span>
                    </div>
                </td>
                <td className="px-6 py-4">{new Date(lead.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-center space-x-4">
                    <button onClick={() => handleGenerateEmail(lead, 'follow-up')} className="font-medium text-primary hover:text-secondary transition">Email</button>
                    <button onClick={() => handleSummarize(lead)} className="font-medium text-primary hover:text-secondary transition">Summary</button>
                </td>
            </tr>
        ));
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold font-display text-foreground">Leads</h1>
                <button onClick={() => setAddModalOpen(true)} className="flex items-center bg-primary text-primary-foreground px-5 py-3 font-semibold rounded-2xl shadow-lg shadow-primary/30 hover:bg-opacity-90 transition-all">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Add Lead
                </button>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-muted-foreground">
                        <thead className="text-xs text-muted-foreground uppercase border-b border-border">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-semibold">Name</th>
                                <th scope="col" className="px-6 py-4 font-semibold">Company</th>
                                <th scope="col" className="px-6 py-4 font-semibold">Status</th>
                                <th scope="col" className="px-6 py-4 font-semibold">Owner</th>
                                <th scope="col" className="px-6 py-4 font-semibold">Created At</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-center">AI Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                           {renderContent()}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} title="Add New Lead">
                <AddLeadForm onAddLead={handleAddLead} onClose={() => setAddModalOpen(false)} />
            </Modal>

            <Modal isOpen={isEmailModalOpen} onClose={() => setEmailModalOpen(false)} title={`AI Email for ${selectedLead?.name}`}>
                 {isAiLoading ? <p>Generating...</p> : <pre className="whitespace-pre-wrap bg-muted/50 p-4 rounded-lg text-sm font-sans border border-border text-foreground">{generatedContent}</pre>}
            </Modal>

            <Modal isOpen={isSummaryModalOpen} onClose={() => setSummaryModalOpen(false)} title={`AI Summary for ${selectedLead?.name}`}>
                 {isAiLoading ? <p>Generating...</p> : <p className="text-muted-foreground leading-relaxed">{generatedContent}</p>}
            </Modal>
        </div>
    );
};

export default Leads;
