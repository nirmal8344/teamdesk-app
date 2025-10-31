// frontend/services/api.ts - FINAL CODE - Idhaiye Copy Paste Pannunga

import {
  User, Lead, Deal, Contact, Task, Product, Bookmark, Activity,
  LeadStatus, DealStage, TaskPriority, TaskStatus
} from '../types';
import {
  users, contacts, tasks, products, initialBookmarks
} from '../constants/dummyData';

// --- Namma Backend Server Address ---
// Deployment-ku munnadi idha unga Render URL-ku maathanum
const API_URL = 'https://teamdesk-backend-nirmal.onrender.com/api';

// --- MOCK API LATENCY (Dummy Data-kku mattum) ---
const LATENCY = 500;
const simulateRequest = <T,>(data: T): Promise<T> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), LATENCY);
  });
};

// --- LEADS APIS (Backend-kooda pesum) ---
export const getLeads = async (): Promise<Lead[]> => {
    const response = await fetch(`${API_URL}/leads`);
    if (!response.ok) throw new Error('Failed to fetch leads from backend');
    const data = await response.json();
    return data.map((lead: any) => ({
        id: lead.id.toString(),
        name: lead.name,
        company: lead.company,
        email: lead.email,
        phone: lead.phone,
        status: lead.status as LeadStatus,
        source: lead.source,
        country: lead.country,
        avatar: lead.avatar,
        createdAt: lead.createdAt || new Date().toISOString(),
        activities: [],
        owner: {
            id: `user-${lead.owner_name}`, name: lead.owner_name,
            email: 'dummy@email.com', avatar: lead.owner_avatar,
        }
    }));
};

export const createLead = async (leadData: Omit<Lead, 'id' | 'status' | 'owner' | 'createdAt' | 'activities'>): Promise<Lead> => {
    const response = await fetch(`${API_URL}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
    });
    if (!response.ok) {
        throw new Error('Failed to create lead');
    }
    const newLeadFromDB = await response.json();
    return {
        ...newLeadFromDB,
        id: newLeadFromDB.id.toString(),
        owner: {
             id: `user-${newLeadFromDB.owner_name}`, name: newLeadFromDB.owner_name,
             email: 'dummy@email.com', avatar: newLeadFromDB.owner_avatar
        },
        activities: []
    }
};

// --- DEALS APIS (Backend-kooda pesum) ---
export const getDeals = async (): Promise<Deal[]> => {
    const response = await fetch(`${API_URL}/deals`);
    if (!response.ok) throw new Error('Failed to fetch deals from backend');
    return await response.json();
};

// --- DASHBOARD API (Backend-kooda pesum) ---
export const getDashboardData = async () => {
    const response = await fetch(`${API_URL}/dashboard`);
    if (!response.ok) {
        return { overallSalesData: [], totalSales: 0, purchaseSourceData: [], visitorData: [], countryData: [], salesHistoryData: [] };
    }
    return await response.json();
};

// --- ACTIVITY FEED API (Backend-kooda pesum) ---
export const getActivityFeed = async (): Promise<Activity[]> => {
    const response = await fetch(`${API_URL}/activity`);
    if (!response.ok) return [];
    return await response.json();
};

// --- REPORTS APIS (Backend-kooda pesum) ---
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

// --- AI CHAT API (Backend-kooda pesum) ---
export const postChatMessage = async (query: string): Promise<string> => {
    const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query }) // query-a anupurom
    });

    if (!response.ok) {
        return "Sorry, I'm having trouble connecting right now.";
    }

    const data = await response.json();
    return data.reply; // AI-oda unmaiyaana bathil
};


// =================================================================================
// Inga irundhu keela irukura functions innum DUMMY data-va thaan use pannum.
// =================================================================================

// --- DUMMY FALLBACK FUNCTIONS ---
const dummyDeal: Deal = { id: 'deal-dummy', title: 'Dummy Deal', value: 0, stage: DealStage.Qualification, leadId: 'lead-dummy', owner: users[0], closeDate: '', createdAt: '' };

export const updateDeal = async (dealId: string, updates: Partial<Deal>): Promise<Deal> => simulateRequest(dummyDeal);
export const createDeal = async (dealData: Omit<Deal, 'id'|'createdAt'|'owner'|'leadId'|'closeDate'>): Promise<Deal> => simulateRequest(dummyDeal);
export const getCurrentUser = (): Promise<User> => simulateRequest(users[0]);
export const getUsers = (): Promise<User[]> => simulateRequest(users);
export const updateUser = async (userId: string, userData: Partial<User>): Promise<User> => {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex > -1) { users[userIndex] = { ...users[userIndex], ...userData }; return simulateRequest(users[userIndex]); }
    throw new Error('User not found');
};
export const createUser = async (userData: Omit<User, 'id'>): Promise<User> => {
    const newUser: User = { id: `user-${Date.now()}`, ...userData, avatar: userData.avatar || `https://i.pravatar.cc/150?u=${Date.now()}` };
    users.unshift(newUser);
    return simulateRequest(newUser);
};
export const getContacts = (): Promise<Contact[]> => simulateRequest(contacts);
export const createContact = async (contactData: Omit<Contact, 'id'>): Promise<Contact> => {
    const newContact: Contact = { id: `contact-${Date.now()}`, ...contactData, avatar: contactData.avatar || `https://i.pravatar.cc/150?u=${Date.now()}` };
    contacts.unshift(newContact);
    return simulateRequest(newContact);
};
export const updateContact = async (contactId: string, updates: Omit<Contact, 'id'>): Promise<Contact> => {
    const contactIndex = contacts.findIndex(c => c.id === contactId);
    if (contactIndex > -1) { contacts[contactIndex] = { ...contacts[contactIndex], ...updates }; return simulateRequest(contacts[contactIndex]); }
    throw new Error('Contact not found');
};
export const getTasks = (): Promise<Task[]> => simulateRequest(tasks);
export const createTask = async (taskData: Pick<Task, 'title'|'dueDate'>): Promise<Task> => {
    const newTask: Task = { id: `task-${Date.now()}`, ...taskData, priority: TaskPriority.Medium, status: TaskStatus.ToDo, assignedTo: users[0], relatedTo: null, };
    tasks.unshift(newTask);
    return simulateRequest(newTask);
};
export const getProducts = (): Promise<Product[]> => simulateRequest(products);
export const createProduct = async (productData: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
    const newProduct: Product = { id: `prod-${Date.now()}`, ...productData, createdAt: new Date().toISOString() };
    products.unshift(newProduct);
    return simulateRequest(newProduct);
};
export const getBookmarks = (): Promise<Bookmark[]> => simulateRequest(initialBookmarks);
export const createBookmark = async (bookmarkData: Omit<Bookmark, 'id' | 'icon'>): Promise<Bookmark> => {
    const newBookmark: Bookmark = { id: `bm-${Date.now()}`, ...bookmarkData, icon: () => null };
    initialBookmarks.unshift(newBookmark);
    return simulateRequest(newBookmark);
};
export const generateLeadEmail = async (leadId: string, type: 'follow-up'|'introduction'): Promise<string> => simulateRequest("Dummy Email");
export const summarizeLeadActivities = async (leadId: string): Promise<string> => simulateRequest("Dummy Summary");