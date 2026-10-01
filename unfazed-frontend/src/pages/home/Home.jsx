import "../../styles/home.css";

import Navbar from "../../components/home/Navbar";
import Hero from "../../components/home/Hero";
import HowItWorks from "../../components/home/HowItWorks";
import Therapists from "../../components/home/Therapists";
import Pricing from "../../components/home/Pricing";
import BottomCTA from "../../components/home/BottomCTA";

import { ShieldLockIcon, LicensedDoctorIcon, MoonClockIcon } from "../../components/common/Icons";

function Home() {
  return (
    <div className="home-page">

      <Navbar />

      <main>
        <Hero />

        <section className="trust-strip">
          <div className="trust-item">
            <ShieldLockIcon size={16} />
            <span>End-to-end encrypted</span>
          </div>
          <div className="trust-item">
            <LicensedDoctorIcon size={16} />
            <span>Licensed therapists</span>
          </div>
          <div className="trust-item">
            <MoonClockIcon size={16} />
            <span>Evening and weekend slots</span>
          </div>
        </section>

        <HowItWorks />

        <Therapists />

        <Pricing />

        <BottomCTA />
      </main>

    </div>
  );
}

export default Home;