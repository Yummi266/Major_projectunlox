import { useState, useEffect } from "react";
import axios from "axios";
import { SearchIcon } from "../common/Icons";

function formatContactTime(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function MessageContacts({ selectedClientId, onSelectClient, refreshKey }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch real client conversations from MongoDB
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/messages/conversations"
        );
        if (res.data?.conversations && Array.isArray(res.data.conversations)) {
          setContacts(res.data.conversations);

          // Default to the first client if none selected
          if (!selectedClientId && res.data.conversations.length > 0) {
            onSelectClient(res.data.conversations[0].clientId);
          }
        } else {
          setContacts([]);
        }
      } catch (err) {
        console.error("Failed to load conversations:", err);
        setContacts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [refreshKey]);

  const filteredContacts = contacts.filter((contact) => {
    const query = searchQuery.toLowerCase();
    return (
      contact.name.toLowerCase().includes(query) ||
      (contact.lastMessage || "").toLowerCase().includes(query)
    );
  });

  return (
    <aside className="message-contacts">
      <div className="contacts-header">
        <h2>Conversations</h2>
        <span className="contacts-badge">
          {contacts.length} {contacts.length === 1 ? "client" : "clients"}
        </span>
      </div>

      <div className="message-search">
        <SearchIcon size={14} className="message-search-icon" />
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="contact-list">
        {loading ? (
          <div className="contacts-empty-state">
            <p>Loading conversations...</p>
          </div>
        ) : filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => {
            const isActive = contact.clientId === selectedClientId;

            return (
              <button
                type="button"
                className={`contact-item ${isActive ? "active" : ""}`}
                key={contact.clientId}
                onClick={() => onSelectClient(contact.clientId)}
              >
                <div className="contact-avatar">{contact.initials}</div>

                <div className="contact-details">
                  <div className="contact-top">
                    <strong>{contact.name}</strong>
                    <span>{formatContactTime(contact.lastTime)}</span>
                  </div>

                  <div className="contact-bottom">
                    <p>{contact.lastMessage}</p>

                    {contact.unread > 0 && (
                      <span className="unread-count">{contact.unread}</span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        ) : (
          <div className="contacts-empty-state">
            <p>
              {searchQuery
                ? `No conversations match "${searchQuery}"`
                : "No clients registered yet."}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}

export default MessageContacts;
