import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import QA from './models/qa.model.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

app.use(cors());
app.use(express.json());

mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connected to MongoDB');
        initSocket();

    })
    .catch((error) => {
        console.log("MongoDB connection error: ", error);
    });




function initSocket() {
    io.on('connection', (socket) => {
        console.log('Socket connected: ', socket.id);
        socket.on('query', async (data) => {
            const userQuery = data.query;
            try {
                //Step : Query the database for the user's question

                const dbResponse = await QA.findOne({ question: { $regex: userQuery, $options: 'i' } });
                if (dbResponse) {
                    socket.emit('response', { message: dbResponse.answer });
                } else {
                    //Step : If no answer found in the database, use Gemini to find the answer
                    socket.emit('status', { message: 'Sorry, no answer found in the database! Using Gemini to find your answer...' });
                    console.log('Emitting status message: No answer found, using Gemini...');
                    const geminiResponse = await getGeminiResponse(userQuery);
                    socket.emit('response', { message: geminiResponse });

                }
            } catch (error) {
                console.error('Error querying QA:', error.message);
                socket.emit('response', { message: "An error occurred while querying the database." });
            }
        });
    });
}

async function getGeminiResponse(userQuery) {
    if (!process.env.GEMINI_API_KEY) {
        console.error("Gemini API key and secret not found. Please set up your Gemini API key and secret in the .env file.");
        return "Gemini API key and secret not found. Please set up your Gemini API key and secret in the .env file.";
    }
    try {
        //Setting up the Google Generative AI
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({model : 'gemini-1.5-flash'});
        
        const instruction = `You are an assistant who provides concise and direct answers. Please give a short and to-the-point response to the following question:`;
        
        // Constructing the final prompt by combining the instruction and user query
        const prompt = `${instruction} ${userQuery}`;

        //Querying the model
        const result = await model.generateContent(userQuery);
        const response = await result.response;

        return await response.text() || "Sorry, Gemini could not find an answer to your question.";

    } catch (error) {
        console.error('Error querying Gemini:', error.message);
        return "An error occurred while querying Gemini.";
    }
}

server.listen(process.env.PORT || 3000, () => {
    console.log('Server running on port 3000');
});
