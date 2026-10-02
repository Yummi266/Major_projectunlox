import { useState, useEffect, useRef } from "react";
import axios from "axios";

function formatMessageTime(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function MessageWindow({ selectedClientId, onMessageSent }) {
  const [messages, setMessages] = useState([]);
  const [client, setClient] = useState(null);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);

  const conversationContainerRef = useRef(null);

  // Directly scroll the internal conversation container without touching the window/page
  const scrollToBottom = (behavior = "auto") => {
    if (conversationContainerRef.current) {
      conversationContainerRef.current.scrollTo({
        top: conversationContainerRef.current.scrollHeight,
        behavior,
      });
    }
  };

  // Fetch real messages for the selected client
  useEffect(() => {
    if (!selectedClientId) return;

    let isMounted = true;
    const fetchHistory = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/messages/${selectedClientId}`
        );
        if (isMounted && res.data) {
          setMessages(res.data.messages || []);
          setClient(res.data.client || null);

          // Instant scroll inside conversation only — prevents entire page jumping
          requestAnimationFrame(() => {
            scrollToBottom("auto");
          });
        }
      } catch (err) {
        console.error("Failed to load message thread:", err);
      }
    };

    fetchHistory();

    return () => {
      isMounted = false;
    };
  }, [selectedClientId]);

  // Send a real message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedClientId || sending) return;

    const textToSend = inputText.trim();
    setInputText("");
    setSending(true);

    try {
      const res = await axios.post("http://localhost:5000/api/messages", {
        clientId: selectedClientId,
        text: textToSend,
        sender: "therapist",
      });

      if (res.data?.data) {
        setMessages((prev) => [...prev, res.data.data]);

        // Smooth scroll for new sent message
        setTimeout(() => {
          scrollToBottom("smooth");
        }, 50);

        if (onMessageSent) {
          onMessageSent();
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  if (!selectedClientId) {
    return (
      <section className="message-window no-selection">
        <div className="no-selection-prompt">
          <p>Select a client conversation from the list to view and send messages.</p>
        </div>
      </section>
    );
  }

  const initials = client?.name
    ? client.name
        .split(" ")
        .filter(Boolean)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "CL";

  return (
    <section className="message-window">
      {/* Header */}
      <header className="message-window-header">
        <div className="message-client-info">
          <div className="message-avatar">{initials}</div>

          <div>
            <strong>{client?.name || "Client"}</strong>
            <span>Active client · {client?.email || ""}</span>
          </div>
        </div>
      </header>

      {/* Conversation Thread */}
      <div className="conversation" ref={conversationContainerRef}>
        <div className="conversation-date">Today</div>

        {messages.length > 0 ? (
          messages.map((item) => {
            const isTherapist = item.sender === "therapist";

            return (
              <div
                className={`message-bubble-row ${
                  isTherapist ? "therapist" : "client"
                }`}
                key={item._id}
              >
                <div className="message-bubble">
                  <p>{item.text}</p>
                  <span>{formatMessageTime(item.createdAt)}</span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="thread-empty">
            <p>No messages in this conversation yet. Send a note to get started.</p>
          </div>
        )}
      </div>

      {/* Composer */}
      <form className="message-composer" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Type a message to client..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={sending}
        />

        <button type="submit" disabled={sending || !inputText.trim()}>
          {sending ? "Sending..." : "Send"}
        </button>
      </form>
    </section>
  );
}

export default MessageWindow;
