import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import QA from './models/qa.model.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';

dotenv.config();
const __dirname = path.resolve();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || '*', // Use an explicit frontend URL
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true,
    },
});


app.use(cors());
app.use(express.json());

// ✅ Fix: Define Root Route to Fix "Cannot GET /"
app.get('/', (req, res) => {
    res.send('Welcome to the Chatbot API! 🚀 Socket.IO is running.');
});

// ✅ Fix: Serve Frontend Only in Production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    });
}

// ✅ Fix: Initialize Socket Before MongoDB Connection
initSocket();

// ✅ Fix: MongoDB Connection Issues
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.log("MongoDB connection error: ", error));

function initSocket() {
    io.on('connection', (socket) => {
        console.log('Socket connected:', socket.id);
        const interval = setInterval(() => socket.emit('ping', { message: 'Server heartbeat' }), 25000);

        socket.on('query', async (data) => {
            try {
                const dbResponse = await QA.findOne({ question: { $regex: data.query, $options: 'i' } });
                if (dbResponse) {
                    socket.emit('response', { message: dbResponse.answer });
                } else {
                    socket.emit('status', { message: 'No answer in DB! Fetching from Gemini...' });
                    console.log('Fetching from Gemini...');
                    socket.emit('response', { message: await getGeminiResponse(data.query) });
                }
            } catch (error) {
                socket.emit('response', { message: "Error querying database." });
            }
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected:', socket.id);
            clearInterval(interval);
        });
    });
}

async function getGeminiResponse(userQuery) {
    if (!process.env.GEMINI_API_KEY) return "Gemini API key missing.";
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.0-pro' });
        const result = await model.generateContent(userQuery);
        if (!result.response) throw new Error("Invalid response from Gemini API");
        return result.response.text();
    } catch (error) {
        console.error('Gemini API error:', error.message);
        return "Error retrieving answer from Gemini.";
    }
}

server.listen(process.env.PORT || 5001, () => console.log('Server running on port 3000'));
