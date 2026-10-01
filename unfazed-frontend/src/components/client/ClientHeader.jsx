import {
  SearchIcon,
  BellIcon,
  ChatIcon
} from "../common/Icons";

function ClientHeader() {
  return (
    <header className="client-header">

      <div className="client-header-left">
        <h2>My Dashboard</h2>
        <span>Thu, 27 Sep 2026</span>
      </div>

      <div className="client-header-right">

        <div className="client-search">
          <SearchIcon size={18} />
          <span>Search Box</span>
        </div>

        <button className="client-header-icon">
          <BellIcon size={20} />
        </button>

        <button className="client-header-icon">
          <ChatIcon size={20} />
        </button>

        <span className="client-name">Alex</span>

        <div className="client-avatar">
          AK
        </div>

      </div>

    </header>
  );
}

export default ClientHeader;