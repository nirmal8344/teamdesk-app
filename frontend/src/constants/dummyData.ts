import { User, Lead, Deal, Contact, Task, Product, Bookmark, LeadStatus, DealStage, TaskPriority, TaskStatus } from '../types';
import { LeadsIcon, DealsIcon, ReportsIcon } from '../components/icons/Icons';

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const threeDaysAgo = new Date(today);
threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
const lastWeek = new Date(today);
lastWeek.setDate(lastWeek.getDate() - 7);


export const users: User[] = [
  { id: 'user-1', name: 'Alex Johnson', email: 'alex@example.com', avatar: 'https://i.pravatar.cc/150?u=user-1' },
  { id: 'user-2', name: 'Maria Garcia', email: 'maria@example.com', avatar: 'https://i.pravatar.cc/150?u=user-2' },
  { id: 'user-3', name: 'James Smith', email: 'james@example.com', avatar: 'https://i.pravatar.cc/150?u=user-3' },
  { id: 'user-4', name: 'Alfie Turner', email: 'alfie@example.com', avatar: 'https://i.pravatar.cc/150?u=user-4' },
  { id: 'user-5', name: 'Bella Poarch', email: 'bella@example.com', avatar: 'https://i.pravatar.cc/150?u=user-5' },
  { id: 'user-6', name: 'Cinderella', email: 'cindy@example.com', avatar: 'https://i.pravatar.cc/150?u=user-6' },
  { id: 'user-7', name: 'David Johnson', email: 'david@example.com', avatar: 'https://i.pravatar.cc/150?u=user-7' },
  { id: 'user-8', name: 'Peter Parker', email: 'peter@example.com', avatar: 'https://i.pravatar.cc/150?u=user-8' },
];

export const contacts: Contact[] = [
  { id: 'contact-1', name: 'John Doe', email: 'john.doe@brighttech.com', phone: '123-456-7890', company: 'BrightTech', tags: ['Client', 'VIP'], avatar: 'https://i.pravatar.cc/150?u=contact-1' },
  { id: 'contact-2', name: 'Jane Miller', email: 'jane.miller@solutioncorp.com', phone: '234-567-8901', company: 'SolutionCorp', tags: ['Prospect'], avatar: 'https://i.pravatar.cc/150?u=contact-2' },
  { id: 'contact-3', name: 'Sam Wilson', email: 'sam.wilson@webwizards.io', phone: '345-678-9012', company: 'WebWizards', tags: ['Vendor'], avatar: 'https://i.pravatar.cc/150?u=contact-3' },
];

export const leads: Lead[] = [
  {
    id: 'lead-1',
    name: 'Sarah Lee',
    company: 'Innovate LLC',
    email: 'sarah.lee@innovatellc.com',
    phone: '456-789-0123',
    status: LeadStatus.Proposal,
    source: 'Social Media',
    country: 'India',
    owner: users[0],
    createdAt: lastWeek.toISOString(),
    avatar: 'https://i.pravatar.cc/150?u=lead-1',
    activities: [
        { id: 'act-1', type: 'meeting', content: 'Initial discovery call', date: lastWeek.toISOString(), author: users[0] },
        { id: 'act-2', type: 'email', content: 'Sent follow-up email with proposal', date: threeDaysAgo.toISOString(), author: users[0] },
    ]
  },
  {
    id: 'lead-2',
    name: 'Michael Chen',
    company: 'Data Dynamics',
    email: 'michael.chen@datadynamics.com',
    phone: '567-890-1234',
    status: LeadStatus.Negotiation,
    source: 'Referral',
    country: 'United States',
    owner: users[1],
    createdAt: '2023-10-12T11:00:00Z',
    avatar: 'https://i.pravatar.cc/150?u=lead-2',
    activities: [
        { id: 'act-3', type: 'call', content: 'Discussed pricing and terms', date: '2023-10-20T16:00:00Z', author: users[1] },
    ]
  },
  {
    id: 'lead-3',
    name: 'Emily Carter',
    company: 'Creative Solutions',
    email: 'emily.carter@creativesolutions.com',
    phone: '678-901-2345',
    status: LeadStatus.New,
    source: 'Direct Search',
    country: 'China',
    owner: users[0],
    createdAt: today.toISOString(),
    avatar: 'https://i.pravatar.cc/150?u=lead-3',
    activities: []
  },
  {
    id: 'lead-4',
    name: 'David Rodriguez',
    company: 'Quantum Leap Inc.',
    email: 'david.r@quantumleap.com',
    phone: '789-012-3456',
    status: LeadStatus.Contacted,
    source: 'Social Media',
    country: 'Indonesia',
    owner: users[2],
    createdAt: yesterday.toISOString(),
    avatar: 'https://i.pravatar.cc/150?u=lead-4',
    activities: []
  },
  {
    id: 'lead-5',
    name: 'Jessica Wong',
    company: 'NextGen AI',
    email: 'jess.wong@nextgen.ai',
    phone: '012-345-6789',
    status: LeadStatus.Won,
    source: 'Others',
    country: 'Russia',
    owner: users[1],
    createdAt: lastWeek.toISOString(),
    avatar: 'https://i.pravatar.cc/150?u=lead-5',
    activities: []
  },
   {
    id: 'lead-6',
    name: 'Chris Evans',
    company: 'Star Tech',
    email: 'chris.e@startech.com',
    phone: '111-222-3333',
    status: LeadStatus.New,
    source: 'Direct Search',
    country: 'Bangladesh',
    owner: users[2],
    createdAt: today.toISOString(),
    avatar: 'https://i.pravatar.cc/150?u=lead-6',
    activities: []
  },
];

export const deals: Deal[] = [
  { id: 'deal-1', title: 'Website Redesign Project', value: 15000, stage: DealStage.Proposal, leadId: 'lead-1', owner: users[0], closeDate: '2023-11-30', createdAt: '2023-11-01' },
  { id: 'deal-2', title: 'Data Analytics Platform', value: 25000, stage: DealStage.Negotiation, leadId: 'lead-2', owner: users[1], closeDate: '2023-11-15', createdAt: '2023-10-20' },
  { id: 'deal-3', title: 'Marketing Campaign', value: 8000, stage: DealStage.Qualification, leadId: 'lead-4', owner: users[2], closeDate: '2023-12-10', createdAt: '2023-11-05' },
  { id: 'deal-4', title: 'Cloud Migration Service', value: 35000, stage: DealStage.ClosedWon, leadId: 'lead-x', owner: users[0], closeDate: threeDaysAgo.toISOString(), createdAt: '2023-10-15' },
  { id: 'deal-5', title: 'Mobile App Development', value: 45000, stage: DealStage.NeedsAnalysis, leadId: 'lead-y', owner: users[1], closeDate: '2023-12-28', createdAt: '2023-11-10' },
  { id: 'deal-6', title: 'CRM Setup', value: 39.92, stage: DealStage.ClosedWon, leadId: 'lead-z1', owner: users[3], closeDate: today.toISOString(), createdAt: lastWeek.toISOString() },
  { id: 'deal-7', title: 'Social Media Mgmt', value: 199.99, stage: DealStage.ClosedWon, leadId: 'lead-z2', owner: users[4], closeDate: today.toISOString(), createdAt: lastWeek.toISOString() },
  { id: 'deal-8', title: 'New Landing Page', value: 30.00, stage: DealStage.ClosedWon, leadId: 'lead-z3', owner: users[5], closeDate: yesterday.toISOString(), createdAt: lastWeek.toISOString() },
  { id: 'deal-9', title: 'SEO Consulting', value: 49.99, stage: DealStage.ClosedWon, leadId: 'lead-z4', owner: users[6], closeDate: yesterday.toISOString(), createdAt: lastWeek.toISOString() },
  { id: 'deal-10', title: 'Blog Content', value: 49.99, stage: DealStage.ClosedWon, leadId: 'lead-z5', owner: users[7], closeDate: threeDaysAgo.toISOString(), createdAt: lastWeek.toISOString() },

];

export const tasks: Task[] = [
  { id: 'task-1', title: 'Follow up with Sarah Lee', priority: TaskPriority.High, status: TaskStatus.ToDo, dueDate: '2023-10-28', assignedTo: users[0], relatedTo: { type: 'lead', id: 'lead-1', name: 'Sarah Lee' } },
  { id: 'task-2', title: 'Prepare contract for Data Dynamics', priority: TaskPriority.High, status: TaskStatus.InProgress, dueDate: '2023-10-29', assignedTo: users[1], relatedTo: { type: 'deal', id: 'deal-2', name: 'Data Analytics Platform' } },
  { id: 'task-3', title: 'Schedule demo with David Rodriguez', priority: TaskPriority.Medium, status: TaskStatus.ToDo, dueDate: '2023-11-02', assignedTo: users[2], relatedTo: { type: 'lead', id: 'lead-4', name: 'David Rodriguez' } },
  { id: 'task-4', title: 'Update quarterly report', priority: TaskPriority.Low, status: TaskStatus.Done, dueDate: '2023-10-25', assignedTo: users[0], relatedTo: null },
];

export const products: Product[] = [
  { id: 'prod-1', name: 'Standard Website Package', price: 15000, category: 'Web Development', createdAt: '2023-01-15' },
  { id: 'prod-2', name: 'Analytics Dashboard License', price: 5000, category: 'Software', createdAt: '2023-02-20' },
  { id: 'prod-3', name: 'Monthly Marketing Retainer', price: 8000, category: 'Marketing', createdAt: '2023-03-10' },
  { id: 'prod-4', name: 'Cloud Setup & Migration', price: 35000, category: 'Services', createdAt: '2023-04-05' },
];

export const initialBookmarks: Bookmark[] = [
  { id: 'bm-1', title: 'Sarah Lee - Innovate LLC', subtitle: 'Status: Proposal', type: 'lead', icon: LeadsIcon },
  { id: 'bm-2', title: 'Website Redesign Project', subtitle: 'Value: $15,000', type: 'deal', icon: DealsIcon },
  { id: 'bm-3', title: 'Q4 Sales Performance', subtitle: 'Generated Oct 28, 2023', type: 'report', icon: ReportsIcon },
  { id: 'bm-4', title: 'Michael Chen - Data Dynamics', subtitle: 'Status: Negotiation', type: 'lead', icon: LeadsIcon },
];