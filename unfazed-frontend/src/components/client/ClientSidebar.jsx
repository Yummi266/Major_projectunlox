import {
  HomeIcon,
  CalendarIcon,
  ChatIcon,
  JournalIcon,
  ExerciseIcon,
  InvoiceIcon,
  SettingsIcon
} from "../common/Icons";

function ClientSidebar() {
  return (
    <aside className="client-sidebar">

      <div className="client-brand">
        <div className="client-brand-icon">U</div>
        <span>Unfazed</span>
      </div>

      <div className="client-nav-section">
        <span className="client-nav-title">CARE</span>

        <nav className="client-nav">

          <div className="client-nav-item active">
            <HomeIcon size={19} />
            <span>Home</span>
          </div>

          <div className="client-nav-item">
            <CalendarIcon size={19} />
            <span>Sessions</span>
          </div>

          <div className="client-nav-item">
            <ChatIcon size={19} />
            <span>Messages</span>
          </div>

          <div className="client-nav-item">
            <JournalIcon size={19} />
            <span>Journal</span>
          </div>

          <div className="client-nav-item">
            <ExerciseIcon size={19} />
            <span>Exercises</span>
          </div>

        </nav>
      </div>

      <div className="client-nav-section account-section">
        <span className="client-nav-title">ACCOUNT</span>

        <nav className="client-nav">

          <div className="client-nav-item">
            <InvoiceIcon size={19} />
            <span>Invoices</span>
          </div>

          <div className="client-nav-item">
            <SettingsIcon size={19} />
            <span>Settings</span>
          </div>

        </nav>
      </div>

    </aside>
  );
}

export default ClientSidebar;