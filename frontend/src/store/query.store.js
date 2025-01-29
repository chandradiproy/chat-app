import { create } from "zustand";
import io from "socket.io-client";

export const useQueryStore = create((set, get) => ({
  isLoading: false,
  messages: [],
  socket: null,
  statusMessage: [],
  isSearchingByGemini: false,
  

  // Initialize Socket.io connection
  initSocket: (socketUrl) => {
    const socket = io(socketUrl, {
      transports: ['websocket'], // Use only WebSockets
      withCredentials: true, // Send credentials with cross-origin requests
    }); // Use Socket.io client to connect

    // Listen for successful connection
    socket.on('connect', () => {
      console.log('Socket.io connected');
    });

    // Handle connection errors
    socket.on('connect_error', (error) => {
      console.error('Socket.io connection error:', error);
    });
    socket.on('status', (data) => {
      //console.log('Status:', data.message);  // Handle the status message from the server
      set({ statusMessage: {text: data.message, sender:"bot"}, isSearchingByGemini: true});
    })

    // Handle incoming messages (response from backend)
    socket.on('response', (data) => {
      if (data.message) {
        // Add bot response to messages
        set((state) => ({
          messages: [
            ...state.messages,
            { text: data.message, sender: "bot" },
          ],
        }));
        set({ isLoading: false, isSearchingByGemini:false }); // Stop loading once message is received
      }
      if (data.status) {
        // Handle status messages like 'Using Gemini'
        set((state) => ({
          messages: [
            ...state.messages,
            { text: data.status, sender: "bot" },
          ],
        }));
      }
    });


    // Store the socket in Zustand store for later use
    set({ socket });
  },

  // Function to send the user query
  getInfo: async (user_input) => {
    // Add user input to messages first
    set((state) => ({
      isLoading: true,
      messages: [...state.messages, { text: user_input, sender: "user" }],
    }));

    const socket = get().socket;
    if (socket && socket.connected) {
      // Send query to the backend via Socket.io
      socket.emit('query', { query: user_input });
    } else {
      // Handle case where Socket.io is not connected
      console.error('Socket.io is not connected.');
      set((state) => ({
        messages: [
          ...state.messages,
          { text: 'Socket.io is not connected. Try again later.', sender: 'bot' },
        ],
      }));
      set({ isLoading: false });
    }
  },
}));
