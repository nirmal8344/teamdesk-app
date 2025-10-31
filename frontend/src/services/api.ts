// frontend/src/services/api.ts - THE COMPLETE & FULLY CORRECTED CODE - Copy and Paste This

import {
  User, Lead, Deal, Contact, Task, Product, Bookmark, Activity,
  LeadStatus, DealStage, TaskPriority, TaskStatus
} from '../types';
import {
  users, tasks, products, initialBookmarks
} from '../constants/dummyData';

// --- Namma Backend Server Address ---
const API_URL = 'https://teamdesk-backend-nirmal.onrender.com/api';

// --- MOCK API LATENCY (Only for Dummy Data) ---
const LATENCY = 500;
const simulateRequest = <T,>(data: T): Promise<T> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), LATENCY);
  });
};

// --- REAL APIs (Connect to Backend) ---

export const getLeads = async (): Promise<Lead[]> => {
    const response = await fetch(`${API_URL}/leads`);
    if (!response.ok) throw new Error('Failed to fetch leads from backend');
    const data = await response.json();
    return data.map((lead: any) => ({
        ...lead, id: lead.id.toString(), createdAt: lead.createdAt || new Date().toISOString(), activities: [],
        owner: { id: `user-${lead.owner_name}`, name: lead.owner_name, email: 'dummy@email.com', avatar: lead.owner_avatar }
    }));
};

export const createLead = async (leadData: Omit<Lead, 'id' | 'status' | 'owner' | 'createdAt' | 'activities'>): Promise<Lead> => {
    const response = await fetch(`${API_URL}/leads`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(leadData)
    });
    if (!response.ok) { throw new Error('Failed to create lead'); }
    const newLeadFromDB = await response.json();
    return {
        ...newLeadFromDB, id: newLeadFromDB.id.toString(),
        owner: { id: `user-${newLeadFromDB.owner_name}`, name: newLeadFromDB.owner_name, email: 'dummy@email.com', avatar: newLeadFromDB.owner_avatar },
        activities: []
    }
};

export const getDeals = async (): Promise<Deal[]> => {
    const response = await fetch(`${API_URL}/deals`);
    if (!response.ok) throw new Error('Failed to fetch deals from backend');
    return await response.json();
};

export const getContacts = async (): Promise<Contact[]> => {
    const response = await fetch(`${API_URL}/contacts`);
    if (!response.ok) throw new Error('Failed to fetch contacts');
    return await response.json();
};

export const getDashboardData = async () => {
    const response = await fetch(`${API_URL}/dashboard`);
    if (!response.ok) { return { overallSalesData: [], totalSales: 0, purchaseSourceData: [], visitorData: [], countryData: [], salesHistoryData: [] }; }
    return await response.json();
};

export const getActivityFeed = async (): Promise<Activity[]> => {
    const response = await fetch(`${API_URL}/activity`);
    if (!response.ok) return [];
    return await response.json();
};

export const getReportSummary = async () => {
    const response = await fetch(`${API_URL}/reports/summary`);
    if (!response.ok) return { totalLeads: 0, conversionRate: 0, totalRevenue: 0, avgDealSize: 0 };
    return await response.json();
};

export const getMonthlyRevenue = async () => {
    const response = await fetch(`${API_URL}/reports/revenue`);
    if (!response.ok) return [];
    return await response.json();
};

export const postChatMessage = async (query: string): Promise<string> => {
    const response = await fetch(`${API_URL}/chat`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: query })
    });
    if (!response.ok) { return "Sorry, I'm having trouble connecting right now."; }
    const data = await response.json();
    return data.reply;
};

// =================================================================================
// DUMMY FUNCTIONS SECTION
// These functions still use dummy data.
// =================================================================================

const dummyDeal: Deal = { id: 'deal-dummy', title: 'Dummy Deal', value: 0, stage: DealStage.Qualification, leadId: 'lead-dummy', owner: users[0], closeDate: '', createdAt: '' };
const dummyContact: Contact = { id: 'contact-dummy', name: 'Dummy', email: 'dummy@dummy.com', phone: '', company: '', tags: [] };

export const updateDeal = async (dealId: string, updates: Partial<Deal>): Promise<Deal> => simulateRequest(dummyDeal);
export const createDeal = async (dealData: Omit<Deal, 'id'|'createdAt'|'owner'|'leadId'|'closeDate'>): Promise<Deal> => simulateRequest(dummyDeal);
export const getCurrentUser = (): Promise<User> => simulateRequest(users[0]);
export const getUsers = (): Promise<User[]> => simulateRequest(users);
export const updateUser = async (userId: string, userData: Partial<User>): Promise<User> => { const i = users.findIndex(u=>u.id===userId); if(i>-1){users[i]={...users[i], ...userData}; return simulateRequest(users[i]);} throw new Error('User not found'); };
export const createUser = async (userData: Omit<User, 'id'>): Promise<User> => { const nU:User={id:`user-${Date.now()}`,...userData,avatar:userData.avatar||`https://i.pravatar.cc/150?u=${Date.now()}`}; users.unshift(nU); return simulateRequest(nU); };

// CORRECTED DUMMY CONTACT FUNCTIONS
export const createContact = async (contactData: Omit<Contact, 'id'>): Promise<Contact> => simulateRequest(dummyContact);
export const updateContact = async (contactId: string, updates: Omit<Contact, 'id'>): Promise<Contact> => simulateRequest(dummyContact);

export const getTasks = (): Promise<Task[]> => simulateRequest(tasks);
export const createTask = async (taskData: Pick<Task, 'title'|'dueDate'>): Promise<Task> => { const nT:Task={id:`task-${Date.now()}`,...taskData,priority:TaskPriority.Medium,status:TaskStatus.ToDo,assignedTo:users[0],relatedTo:null,}; tasks.unshift(nT); return simulateRequest(nT); };
export const getProducts = (): Promise<Product[]> => simulateRequest(products);
export const createProduct = async (productData: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => { const nP:Product={id:`prod-${Date.now()}`,...productData,createdAt:new Date().toISOString()}; products.unshift(nP); return simulateRequest(nP); };
export const getBookmarks = (): Promise<Bookmark[]> => simulateRequest(initialBookmarks);
export const createBookmark = async (bookmarkData: Omit<Bookmark, 'id' | 'icon'>): Promise<Bookmark> => { const nB:Bookmark={id:`bm-${Date.now()}`,...bookmarkData,icon:()=>null}; initialBookmarks.unshift(nB); return simulateRequest(nB); };
export const generateLeadEmail = async (leadId: string, type: 'follow-up'|'introduction'): Promise<string> => simulateRequest("Dummy Email");
export const summarizeLeadActivities = async (leadId: string): Promise<string> => simulateRequest("Dummy Summary");