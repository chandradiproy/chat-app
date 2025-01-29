import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import ChatContainer from "./components/ChatContainer";
import InputBar from "./components/InputBar";
import { useQueryStore } from "./store/query.store";

function App() {
  const { initSocket } = useQueryStore();
  // const [socketUrl] = useState('http://localhost:3000');
  const socketUrl = import.meta.env.MODE === 'development' ? 'http://localhost:5001' : 'https://chat-app-1waf.onrender.com/';

  // Initialize WebSocket connection
  useEffect(()=>{
    initSocket(socketUrl);
  }, [initSocket, socketUrl]);

  return (
    <main className="flex flex-col sm:h-screen h-svh w-full dark:bg-zinc-800 bg-gray-100 items-center ">
      <Navbar/>
      <section className="flex overflow-y-auto justify-center w-full  h-full ">
        <ChatContainer/>
      </section>
       <InputBar/>
    </main>
  );
}

export default App;
