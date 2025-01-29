import React, { useRef } from "react";
import { useQueryStore } from "../store/query.store";  // Import zustand store
import { LoaderCircle, Send } from "lucide-react";

function InputBar() {
  const { isLoading, getInfo } = useQueryStore();
  const [value, setValue] = React.useState("");
  const textareaRef = useRef(null);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const handleInputChange = (e) => {
    onChange(e); // Pass the change event to the parent component
    // Auto-resize the textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set to content height
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      // Call getInfo from zustand store to send the user input via WebSocket
      getInfo(value);
      setValue(""); // Reset the input field
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex items-center p-2 dark:bg-zinc-700 bg-gray-200 md:w-3xl w-full sm:min-h-24 min-h-14 mb-2 rounded-4xl"
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleInputChange}
        placeholder="Type your message..."
        className="flex-grow px-4 py-2 dark:border-0 dark:text-gray-200 text-zinc-900 border border-gray-300 rounded-lg resize-none border-none focus:outline-none"
        rows="1"
        style={{
          maxHeight: "100px", // Limit the max height
          overflowY: "auto", // Add a scrollbar when content exceeds max height
        }}
        disabled={isLoading}
      />
      <button
        type="submit"
        className={`size-12 flex justify-center items-center text-white font-semibold rounded-full dark:bg-gray-100 bg-zinc-800 hover:cursor-pointer dark:hover:bg-zinc-200 hover:bg-zinc-700`}
        disabled={isLoading}
      >
        {isLoading ? (
          <LoaderCircle
            className="animate-spin dark:text-black text-white"
            size={20}
          />
        ) : (
          <Send className="dark:text-black text-white" size={20} />
        )}
      </button>
    </form>
  );
}

export default InputBar;
