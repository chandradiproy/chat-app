import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useQueryStore } from '../store/query.store';
import { Bot, Ellipsis, User2 } from 'lucide-react';

function ChatContainer() {
  const { messages, isLoading, isSearchingByGemini, statusMessage } = useQueryStore();
  const endOfMessagesRef = useRef(null); // Ref to the end of the messages container
  const messagesEndRef = useRef(null); // Ref to the last message including statusMessage

  // Scroll to the bottom whenever messages change (including statusMessage)
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isSearchingByGemini]); // Trigger when messages or isSearchingByGemini changes

  return (
    <div className='md:w-3xl w-full pt-2 px-4 h-full relative flex flex-col justify-between overflow-y-auto'>
      <div className="space-y-4">
        {/* If no messages, show a placeholder */}
        {messages.length === 0 ? (
          <div className="text-center text-gray-500">No messages yet</div>
        ) : (
          // Display chat messages
          messages.map((message, index) => (
            <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xl p-3 rounded-lg ${message.sender === 'user' ? 'dark:bg-zinc-700 bg-gray-200 dark:text-white' : 'dark:text-gray-200 text-black'}`}
              >
                {/* Render bot's icon and message */}
                {message.sender === 'bot' ? (
                  <div className="flex items-center space-x-2 border-1 justify-center dark:border-gray-100 border-zinc-900 w-fit p-2 rounded-full">
                    <Bot size={30} className="dark:text-white text-black  " />
                  </div>
                ) : (
                  <div className="flex items-start space-x-2">
                    <User2 size={30} className="dark:text-white text-black" />
                  </div>
                )}

                {/* Render message content */}
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.text}
                </ReactMarkdown>

                {/* Show loading indicator when bot is processing */}
              </div>
            </div>
          ))
        )}

        {/* Render status message (if Gemini is searching) */}
        {isSearchingByGemini && (
          <div className=" animate-pulse text-sm text-gray-500 mb-2">
            <div className='flex items-center space-x-2 border-1 justify-center dark:border-gray-100 border-zinc-900 w-fit p-2 rounded-full'>
              <Bot size={30} className="dark:text-white text-black" />
              </div>
            {statusMessage.text}
          </div>
        )}

      </div>

      {/* This div will ensure we scroll to it */}
      <div ref={messagesEndRef} className="h-1" />
    </div>
  );
}

export default ChatContainer;
