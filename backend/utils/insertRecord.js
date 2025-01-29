const mongoose = require('mongoose');
const dotenv = require('dotenv');
const QA = require('../models/qa.model');
const { query } = require('express');

dotenv.config();

mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connected to MongoDB');
        const predefinedQA = [
            { question: "What is Node.js?", answer: "Node.js is a JavaScript runtime built on Chrome's V8 engine." },
            { question: "What is MongoDB?", answer: "MongoDB is a NoSQL database that stores data in JSON-like documents." },
            { question: "What is Express?", answer: "Express is a web application framework for Node.js." },
            { question: "What is Socket.IO?", answer: "Socket.IO is a JavaScript library for real-time web applications." },
            { question: "What is React?", answer: "React is a JavaScript library for building user interfaces." },
            { question: "What is JavaScript?", answer: "JavaScript is a high-level, interpreted programming language that enables interactive web pages." },
            { question: "What is MongoDB Atlas?", answer: "MongoDB Atlas is a fully managed cloud database service for MongoDB." },
            { question: "What is JWT?", answer: "JWT (JSON Web Token) is an open standard for securely transmitting information between parties as a JSON object." },
            { question: "What is an API?", answer: "An API (Application Programming Interface) allows two software programs to communicate with each other." },
            { question: "What is the DOM?", answer: "The DOM (Document Object Model) is an interface for accessing and manipulating HTML and XML documents." },
            // MAHE & MIT Related Questions
            { question: "What is Manipal Academy of Higher Education?", answer: "Manipal Academy of Higher Education (MAHE) is a private university in Manipal, India, offering a wide range of academic programs." },
            { question: "When was Manipal Academy of Higher Education established?", answer: "MAHE was established in 1953 and became a university in 2000." },
            { question: "What are the programs offered at MAHE?", answer: "MAHE offers undergraduate, postgraduate, and doctoral programs across various fields including engineering, medical sciences, humanities, and business." },
            { question: "Where is Manipal Academy of Higher Education located?", answer: "MAHE is located in Manipal, Karnataka, India." },
            { question: "What is the admission process at Manipal Academy of Higher Education?", answer: "MAHE conducts its own entrance exam called MET for undergraduate programs. For postgraduate programs, candidates are selected based on merit and entrance tests." },
            { question: "What is Manipal Institute of Technology?", answer: "Manipal Institute of Technology (MIT) is a leading engineering college under MAHE offering a wide range of undergraduate and postgraduate programs in engineering." },
            { question: "When was MIT established?", answer: "MIT was established in 1957 and is one of the top engineering institutes in India." },
            { question: "What courses are offered at MIT?", answer: "MIT offers undergraduate and postgraduate degrees in various engineering disciplines, including Computer Science, Mechanical, Civil, Electrical, and Electronics." },
            { question: "What is the Manipal Entrance Test (MET)?", answer: "The MET is an entrance exam conducted by MAHE for admission to undergraduate programs at MIT and other institutions affiliated with MAHE." },
            { question: "What is the placement record at MIT?", answer: "MIT has a strong placement record with top companies from various sectors recruiting students every year." },
        ];

        QA.insertMany(predefinedQA)
            .then(() => {
                console.log('Predefined QA records inserted successfully');
            })
            .catch((error) => {
                console.error('Error inserting predefined QA records:', error.message);
                mongoose.connection.close();
            })
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });

