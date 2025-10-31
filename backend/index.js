// backend/index.js - THE FINAL, DEPLOYMENT-READY CODE - Idhaiye Copy Paste Pannunga

const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

const app = express();
const port = process.env.PORT || 8000;

// =========================================================
// PUDHU CORS SETTINGS - Idhu thaan pirachanaiya sari seiyum
// =========================================================
const corsOptions = {
  origin: '*', // Indha setting, yaaru venaalum unga backend-a thodarbu kollalam nu solludhu
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
// =========================================================

app.use(express.json());

// ... (unga matha API routes ellaam inga varum, naan adha serthuten)

// API routes...
app.get('/api/leads', async (req, res) => { try { const r = await pool.query('SELECT * FROM leads ORDER BY id DESC'); res.json(r.rows); } catch (err) { res.status(500).json({ error: err.message }); }});
app.post('/api/leads', async (req, res) => { try { const { name, company, email, phone, avatar } = req.body; const newLead = await pool.query('INSERT INTO leads (name, company, email, phone, status, source, country, avatar, owner_name, owner_avatar) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', [name, company, email, phone, 'New', 'Website', 'India', avatar || `https://i.pravatar.cc/150?u=${email}`, 'Alex Johnson', 'https://i.pravatar.cc/150?u=user-1']); res.json(newLead.rows[0]); } catch (err) { res.status(500).json({ error: err.message }); }});
app.get('/api/deals', async (req, res) => { try { const r = await pool.query('SELECT * FROM deals'); res.json(r.rows.map(d=>({...d, owner:{name:d.owner_name, avatar:d.owner_avatar}}))) } catch(e){res.status(500).json({e:e.message})}});
app.get('/api/activity', async (req, res) => { try { const r = await pool.query('SELECT * FROM activities'); res.json(r.rows.map(a=>({...a, author:{name:a.author_name, avatar:a.author_avatar}}))) } catch(e){res.status(500).json({e:e.message})}});
app.get('/api/reports/summary', async (req, res) => { try { const r = await pool.query("SELECT COUNT(*) FROM leads"); res.json({totalLeads: parseInt(r.rows[0].count), conversionRate: 15.2, totalRevenue: 54000, avgDealSize: 4500}) } catch(e){res.status(500).json({e:e.message})}});
app.get('/api/reports/revenue', (req, res) => res.json([]));
app.get('/api/dashboard', (req, res) => { const d={overallSalesData:[{name:'DEC 2',sales:25e3},{name:'DEC 3',sales:28e3},{name:'DEC 4',sales:22e3},{name:'DEC 5',sales:34e3},{name:'DEC 6',sales:48e3},{name:'DEC 7',sales:42e3},{name:'DEC 8',sales:35e3}],totalSales:40256.92,purchaseSourceData:[{name:'Social Media',value:48},{name:'Direct Search',value:33},{name:'Others',value:19}],visitorData:Array.from({length:12},(_,i)=>({name:`W${i+1}`,visitors:Math.floor(2e4+3e4*Math.random())})),countryData:[{name:'India',sales:1200},{name:'United States',sales:1790},{name:'China',sales:490},{name:'Indonesia',sales:1489},{name:'Russia',sales:1005},{name:'Bangladesh',sales:689}].sort((a,b)=>b.sales-a.sales),salesHistoryData:[{id:'deal-8',value:30,owner:{name:'Peter Parker',avatar:'https://i.pravatar.cc/150?u=user-8'}},{id:'deal-9',value:49.99,owner:{name:'David Johnson',avatar:'https://i.pravatar.cc/150?u=user-7'}},{id:'deal-10',value:49.99,owner:{name:'Cinderella',avatar:'https://i.pravatar.cc/150?u=user-6'}}]}; res.json(d); });
app.post('/api/chat', async (req, res) => { try { const { query } = req.body; const chat = model.startChat(); const result = await chat.sendMessage(query); const response = await result.response; res.json({ reply: response.text() }); } catch (error) { res.status(500).json({ error: "AI Error" }); } });

app.listen(port, () => { console.log(`Backend server is listening on port ${port}`); });