import React from 'react';

export enum LeadStatus {
  New = 'New',
  Contacted = 'Contacted',
  Proposal = 'Proposal',
  Negotiation = 'Negotiation',
  Won = 'Won',
  Lost = 'Lost',
}

export enum DealStage {
  Qualification = 'Qualification',
  NeedsAnalysis = 'Needs Analysis',
  Proposal = 'Proposal',
  Negotiation = 'Negotiation',
  ClosedWon = 'Closed-Won',
  ClosedLost = 'Closed-Lost',
}

export enum TaskPriority {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
}

export enum TaskStatus {
  ToDo = 'To Do',
  InProgress = 'In Progress',
  Done = 'Done',
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Activity {
  id:string;
  type: 'note' | 'email' | 'call' | 'meeting';
  content: string;
  date: string;
  author: User;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  tags: string[];
  avatar?: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: LeadStatus;
  source: string;
  country: string;
  owner: User;
  createdAt: string;
  activities: Activity[];
  avatar?: string;
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  stage: DealStage;
  leadId: string;
  owner: User;
  closeDate: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  assignedTo: User;
  relatedTo: {
    type: 'lead' | 'deal';
    id: string;
    name: string;
  } | null;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  createdAt: string;
}

export interface Bookmark {
  id: string;
  title: string;
  subtitle: string;
  type: 'lead' | 'deal' | 'report' | 'other';
  icon: React.ElementType;
}