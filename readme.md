﻿# Chat App

This is a React-based chat application that displays user and bot messages dynamically. Its is designed to answer a predefined question (and answer) store in the mongoDB database, and if the question/answer not found in the database, it uses Gemini to generate the answer for that question. It features a real-time chat interface, supports markdown formatting, and provides a status message when searching via Gemini.

### Sample Questions

```sh
 1."What is Node.js?"
 2."What is MongoDB?"
 3."What is Express?"
 4."What is Socket.IO?"
 5."What is React?"
```

## Features
- Real-time chat interface
- Displays messages from both user and bot
- Supports markdown rendering with `react-markdown` and `remark-gfm`
- Status message when question is not found in the database and Gemini is used to generate the answer.
- Auto-scrolls to the latest message
- Loading indicator for bot responses

## Technologies Used
### Backend ( Deployed on Render )
- Node.js
- Express.js

### Frontend ( Deployed on firebase )
- React
- Tailwind CSS
- Lucide Icons
- Zustand (State Management)
- React Markdown
- Socket.io - client
### Databse
- MongoDB

## Installation

### Prerequisites
Ensure you have Node.js installed.

### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/chandradiproy/chat-app.git
   cd chat-app
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```

## File Structure
```
/
|── backend
|   |── models
|   |   |── qa.model.js
|   |── utils
|   |   |── insertRecord.js
|   |── .env
|   |── index.js
|── frontend
|   │── src
|       │   ├── components
|       │   │   ├── ChatContainer.js
|       │   ├── store
|       │   │   ├── query.store.js
|       │   ├── App.js
|       │   ├── main.js
|       │── public
|       │── package.json
|       │── README.md    
```

## Usage
- The chat interface automatically scrolls to the latest message.
- If `isSearchingByGemini` is true, a bot icon appears with the status message.
- Messages are displayed dynamically based on the sender (`user` or `bot`).


