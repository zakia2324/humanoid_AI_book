import React, { useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  source_url?: string | null;
}

const ChatbotWidget: React.FC<{ backendApiUrl: string }> = ({ backendApiUrl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = () => {
    if (input.trim() === '') return;

    const userMessage: Message = { sender: 'user', text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const eventSource = new EventSource(`${backendApiUrl}/api/chat?query=${encodeURIComponent(input.trim())}`);
    
    let currentBotMessage: Message = { sender: 'bot', text: '' };
    let isNewMessage = true;

    eventSource.onmessage = (event) => {
      if (event.data === "[DONE]") {
        setIsLoading(false);
        eventSource.close();
        return;
      }

      const data = JSON.parse(event.data);

      if (data.source_url) {
        currentBotMessage.source_url = data.source_url;
      }

      if (data.answer_chunk) {
        currentBotMessage.text += data.answer_chunk;
        if (isNewMessage) {
          setMessages((prev) => [...prev, currentBotMessage]);
          isNewMessage = false;
        } else {
          setMessages((prev) => [...prev.slice(0, -1), { ...currentBotMessage }]);
        }
      }

      if (data.error) {
        currentBotMessage.text = data.error;
        if (isNewMessage) {
          setMessages((prev) => [...prev, currentBotMessage]);
        } else {
          setMessages((prev) => [...prev.slice(0, -1), { ...currentBotMessage }]);
        }
        eventSource.close();
        setIsLoading(false);
      }
    };

    eventSource.onerror = (err) => {
      console.error('EventSource failed:', err);
      const errorMessage: Message = { sender: 'bot', text: 'Sorry, something went wrong. Please try again.' };
      if (isNewMessage) {
        setMessages((prev) => [...prev, errorMessage]);
      } else {
        setMessages((prev) => [...prev.slice(0, -1), errorMessage]);
      }
      eventSource.close();
      setIsLoading(false);
    };

    eventSource.addEventListener('end', () => {
      eventSource.close();
      setIsLoading(false);
    });
  };

  return (
    <div className={`${styles.chatbotContainer} ${isOpen ? styles.open : ''}`}>
      <button className={styles.chatButton} onClick={toggleChat}>
        {isOpen ? 'X' : 'Chat'}
      </button>

      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.messages}>
            {messages.map((msg, index) => (
              <div key={index} className={`${styles.message} ${styles[msg.sender]}`}>
                <span>{msg.text}</span>
                {msg.source_url && (
                  <div>
                    <a href={msg.source_url} target="_blank" rel="noopener noreferrer">
                      🔗 Source
                    </a>
                  </div>
                )}
              </div>
            ))}
            {isLoading && <div className={styles.message}>Bot is typing...</div>}
            <div ref={messagesEndRef} />
          </div>

          <div className={styles.inputArea}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask a question..."
              disabled={isLoading}
            />
            <button onClick={sendMessage} disabled={isLoading}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;
