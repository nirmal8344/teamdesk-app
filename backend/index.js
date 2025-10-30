// backend/index.js - THE COMPLETE & FINAL LOCAL CODE

const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

const app = express();
const port = process.env.PORT || 8000; // Deployment-ku idhu mukkiyam

app.use(cors());
app.use(express.json());

// --- Leads API ---
app.get('/api/leads', async (req, res) => {
  try {
    const allLeads = await pool.query('SELECT * FROM leads ORDER BY id DESC');
    res.json(allLeads.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/leads', async (req, res) => {
    try {
        const { name, company, email, phone, avatar } = req.body;
        const newLead = await pool.query(
            'INSERT INTO leads (name, company, email, phone, status, source, country, avatar, owner_name, owner_avatar) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [name, company, email, phone, 'New', 'Website', 'India', avatar || `https://i.pravatar.cc/150?u=${email}`, 'Alex Johnson', 'https://i.pravatar.cc/150?u=user-1']
        );
        res.json(newLead.rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- Deals API (Unmaiyaana data-voda) ---
app.get('/api/deals', async (req, res) => {
  try {
    const allDeals = await pool.query('SELECT * FROM deals ORDER BY id DESC');
    // Frontend-ku etha maari owner object-a format panrom
    const formattedDeals = allDeals.rows.map(deal => ({
        ...deal,
        owner: { name: deal.owner_name, avatar: deal.owner_avatar }
    }));
    res.json(formattedDeals);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- Activity Feed API (Unmaiyaana data-voda) ---
app.get('/api/activity', async (req, res) => {
    try {
        const allActivities = await pool.query('SELECT * FROM activities ORDER BY date DESC');
        // Frontend-ku etha maari author object-a format panrom
        const formattedActivities = allActivities.rows.map(act => ({
            ...act,
            author: { name: act.author_name, avatar: act.author_avatar }
        }));
        res.json(formattedActivities);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- Reports API (Unmaiyaana data-voda) ---
app.get('/api/reports/summary', async (req, res) => {
    try {
        const totalLeadsRes = await pool.query("SELECT COUNT(*) FROM leads");
        const totalRevenueRes = await pool.query("SELECT SUM(value) FROM deals WHERE stage = 'Closed-Won'"); // Ippo-thaiku stage illa, so 0 varum
        
        res.json({
            totalLeads: parseInt(totalLeadsRes.rows[0].count, 10),
            conversionRate: 15.2, // Sample
            totalRevenue: parseFloat(totalRevenueRes.rows[0].sum) || 54000, // Sample
            avgDealSize: 4500, // Sample
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Matha APIs...
app.get('/api/dashboard', (req, res) => res.json({})); // Dashboard frontend-laye handle aagatum
app.get('/api/reports/revenue', (req, res) => res.json([]));

// --- AI Chat API ---
app.post('/api/chat', async (req, res) => {
    try {
        const { query } = req.body;
        const chat = model.startChat();
        const result = await chat.sendMessage(query);
        const response = await result.response;
        res.json({ reply: response.text() });
    } catch (error) { res.status(500).json({ error: "AI Error" }); }
});

app.listen(port, () => {
  console.log(`Backend server is listening on port ${port}`);
});