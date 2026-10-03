import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MessageSquareIcon, SendIcon, ShieldLockIcon } from "../common/Icons";

function formatMessageTime(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function ClientMessageWindow({ clientId, therapistInfo, onMessageSent }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  const conversationContainerRef = useRef(null);

  const scrollToBottom = (behavior = "auto") => {
    if (conversationContainerRef.current) {
      conversationContainerRef.current.scrollTo({
        top: conversationContainerRef.current.scrollHeight,
        behavior,
      });
    }
  };

  useEffect(() => {
    if (!clientId) return;

    let isMounted = true;
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/messages/${clientId}`);
        if (isMounted && res.data) {
          setMessages(res.data.messages || []);
          requestAnimationFrame(() => {
            scrollToBottom("auto");
          });
        }
      } catch (err) {
        console.error("Failed to load client message thread:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHistory();

    // Poll every 8 seconds for new incoming messages from therapist
    const interval = setInterval(fetchHistory, 8000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [clientId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !clientId || sending) return;

    const textToSend = inputText.trim();
    setInputText("");
    setSending(true);

    try {
      const res = await axios.post("http://localhost:5000/api/messages", {
        clientId,
        text: textToSend,
        sender: "client",
      });

      if (res.data?.data) {
        setMessages((prev) => [...prev, res.data.data]);
        setTimeout(() => {
          scrollToBottom("smooth");
        }, 50);

        if (onMessageSent) {
          onMessageSent();
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send message to therapist.");
    } finally {
      setSending(false);
    }
  };

  const therapistName = therapistInfo?.name || "Therapist";
  const therapistSpec = therapistInfo?.specialization || "Relationship Counseling & CBT";
  const initials = therapistName
    .replace(/^Dr\.\s*/i, "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "TW";

  return (
    <article className="client-chat-card">
      <header className="client-chat-header">
        <div className="therapist-chat-info">
          <div className="therapist-chat-avatar">{initials}</div>
          <div className="therapist-chat-meta">
            <h3>{therapistName}</h3>
            <p>{therapistSpec}</p>
          </div>
        </div>

        <div className="chat-security-badge" title="Clinical communications are encrypted and private">
          <span className="dot"></span>
          <span>Online · Secure & Encrypted</span>
        </div>
      </header>

      <div className="client-chat-thread" ref={conversationContainerRef}>
        <div className="thread-divider">
          <span>Encrypted Clinical Channel</span>
        </div>

        {loading ? (
          <div className="empty-chat-state">
            <p>Loading secure conversation history...</p>
          </div>
        ) : messages.length > 0 ? (
          messages.map((item) => {
            const isTherapist = item.sender === "therapist";

            return (
              <div
                className={`chat-msg-row ${isTherapist ? "therapist" : "client"}`}
                key={item._id}
              >
                <div className="chat-bubble">
                  <p>{item.text}</p>
                  <div className="chat-bubble-footer">
                    <span>{formatMessageTime(item.createdAt)}</span>
                    {!isTherapist && <span>✓✓</span>}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-chat-state">
            <h4>Start your conversation</h4>
            <p>
              Leave reflections, check-in thoughts, or questions between sessions for {therapistName}.
            </p>
          </div>
        )}
      </div>

      <form className="client-chat-composer" onSubmit={handleSend}>
        <input
          type="text"
          placeholder={`Message ${therapistName}...`}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={sending}
        />
        <button type="submit" disabled={sending || !inputText.trim()}>
          {sending ? "Sending..." : "Send"}
        </button>
      </form>
    </article>
  );
}

export default ClientMessageWindow;
