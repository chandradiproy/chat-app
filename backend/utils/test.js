// On the client side (browser)
import { io } from "socket.io-client";  // Import the socket.io client
const socket = io('http://localhost:3000');  // Replace with your server URL

// Send a query to the backend when the user asks a question
function askQuestion(userQuery) {
    socket.emit('query', { query: userQuery });  // Send user query to the server
}

// Listen for the server's response
socket.on('status', (data) => {
    console.log('Status:', data.message);  // Handle the status message from the server
});
socket.on('response', (data) => {

    console.log('Answer:', data.message);  // Handle the response from the server
});

// Example of triggering a question
askQuestion("What is Node.js?");
