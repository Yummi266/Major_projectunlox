import { useState } from "react";
import DashboardSidebar from "../../components/therapist/DashboardSidebar";
import DashboardHeader from "../../components/therapist/DashboardHeader";
import NotesToolbar from "../../components/therapist/NotesToolbar";
import NotesList from "../../components/therapist/NotesList";
import AddNoteModal from "../../components/therapist/AddNoteModal";
import "../../styles/dashboard.css";
import "../../styles/notes.css";

function Notes() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleNoteAdded = () => {
    setRefreshKey((prev) => prev + 1);
    setIsAddModalOpen(false);
  };

  return (
    <div className="dashboard-page">
      <DashboardSidebar />

      <div className="dashboard-main">
        <DashboardHeader />

        <main className="notes-content">
          <NotesToolbar onNewNote={() => setIsAddModalOpen(true)} />
          <NotesList
            refreshKey={refreshKey}
            onNewNote={() => setIsAddModalOpen(true)}
          />
        </main>
      </div>

      {isAddModalOpen && (
        <AddNoteModal
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={handleNoteAdded}
        />
      )}
    </div>
  );
}

export default Notes;
