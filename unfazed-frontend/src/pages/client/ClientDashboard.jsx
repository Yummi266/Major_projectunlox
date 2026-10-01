import ClientSidebar from "../../components/client/ClientSidebar";
import ClientHeader from "../../components/client/ClientHeader";
import UpcomingSession from "../../components/client/UpcomingSession";
import PackageProgress from "../../components/client/PackageProgress";
import FeelingCheckIn from "../../components/client/FeelingCheckIn";
import TodaysExercise from "../../components/client/TodaysExercise";
import TherapistMessage from "../../components/client/TherapistMessage";
import LatestInvoice from "../../components/client/LatestInvoice";

import "../../styles/client-dashboard.css";

function ClientDashboard() {
  return (
    <div className="client-dashboard">
      <ClientSidebar />

      <div className="client-main">
        <ClientHeader />

        <main className="client-content">

          <section className="client-greeting">
            <span>Thursday evening</span>
            <h1>Good evening, Alex. You're doing great.</h1>
          </section>

          <section className="client-top-row">
            <UpcomingSession />
            <PackageProgress />
          </section>

          <section className="feeling-section">
            <FeelingCheckIn />
          </section>

          <section className="client-bottom-row">
            <TodaysExercise />
            <TherapistMessage />
            <LatestInvoice />
          </section>

        </main>
      </div>
    </div>
  );
}

export default ClientDashboard;