import { useState, useRef, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Send } from 'lucide-react';
import { getGeminiResponse } from '@/lib/gemini';
import styles from '@/styles/Chat.module.css';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
}

export default function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [transactionsData, setTransactionsData] = useState<any>([]);
  const [brandsData, setBrandsData] = useState<any>([]);
  const [storesData, setStoresData] = useState<any>([]);

  useEffect(() => {
    Promise.all([
      fetch('/data/transactions.json').then(r => r.json()),
      fetch('/data/brand.json').then(r => r.json()),
      fetch('/data/store.json').then(r => r.json()),
    ])
      .then(([transactions, brands, stores]) => {
        setTransactionsData(transactions);
        setBrandsData(brands);
        setStoresData(stores);
        setDataLoaded(true);
      })
      .catch(err => {
        console.error('Error loading data:', err);
        setDataLoaded(true);
      });
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (message.trim() === '' || isLoading || !dataLoaded) return;

    const userMessage = {
      id: Date.now().toString(),
      text: message.trim(),
      isBot: false,
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    if (!hasStartedChat) setHasStartedChat(true);

    try {
      const response = await getGeminiResponse(
        userMessage.text,
        transactionsData,
        brandsData,
        storesData
      );

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        isBot: true,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error in chat:', error);

      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        isBot: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    'What is my carbon footprint?',
    'How can I reduce my environmental impact?',
    'Show me sustainable alternatives',
    'What are my worst purchases?',
  ];

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.chatContainer}>
          <div className={styles.header}>
            <h1 className={styles.title}>🌱 Eco Chat Assistant</h1>
            <p className={styles.subtitle}>Get personalized sustainability insights</p>
          </div>

          {!hasStartedChat && (
            <div className={styles.welcomeContainer}>
              <div className={styles.glowingIcon}>🌍</div>
              <h2 className={styles.welcomeTitle}>Welcome to Eco Chat!</h2>
              <p className={styles.welcomeText}>
                I'm here to help you understand your environmental impact and suggest ways to improve it.
              </p>
              <div className={styles.quickQuestions}>
                <p className={styles.quickQuestionsTitle}>Try asking:</p>
                <div className={styles.questionButtons}>
                  {quickQuestions.map((q, i) => (
                    <button
                      key={i}
                      className={styles.questionButton}
                      onClick={() => {
                        setMessage(q);
                        setTimeout(() => sendMessage(), 100);
                      }}
                      disabled={!dataLoaded}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className={styles.messagesContainer} ref={scrollRef}>
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`${styles.messageWrapper} ${msg.isBot ? styles.botMessage : styles.userMessage}`}
              >
                <div className={styles.messageBubble}>
                  {msg.isBot && <span className={styles.botIcon}>🤖</span>}
                  <p className={styles.messageText}>{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className={`${styles.messageWrapper} ${styles.botMessage}`}>
                <div className={styles.messageBubble}>
                  <span className={styles.botIcon}>🤖</span>
                  <div className={styles.loadingDots}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form className={styles.inputContainer} onSubmit={sendMessage}>
            <input
              type="text"
              className={styles.input}
              placeholder={dataLoaded ? "Ask about your sustainability..." : "Loading data..."}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isLoading || !dataLoaded}
            />
            <button
              type="submit"
              className={styles.sendButton}
              disabled={isLoading || message.trim() === '' || !dataLoaded}
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
