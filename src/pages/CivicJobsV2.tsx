import { AppShell } from "../components/layout/AppShell";
import CivicJobsBoard from "../components/jobs/CivicJobsBoard";

export default function CivicJobsV2Page() {
  return (
    <AppShell
      title="City Jobs"
      hint="Torn-style city employment: one passive job, one daily collection, small salary, Job Points, working-stat growth, and a few end-rank specials that actually matter."
    >
      <CivicJobsBoard />
    </AppShell>
  );
}
