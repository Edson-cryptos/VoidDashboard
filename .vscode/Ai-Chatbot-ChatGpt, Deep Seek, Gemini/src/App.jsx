import { Chat } from "./components/chat/chat";
import styles from "./App.module.css";
import { useState } from "react";

function App() {
  const [messages,  setMessages] = useState();

  return (
    <div className={styles.App}> 
      <header className={styles.hearder}>
        <img className={styles.logo}  src="/chatbot.png"></img>
        <h2 className={styles.title}>AI CHATBOT</h2>
      </header>
      <div className={styles.chatContainer}>
        <Chat messages={messages} />
      </div>
    </div>
  );
}

const MESSAGES [
 {
  role: user
 }
]
export default App;
