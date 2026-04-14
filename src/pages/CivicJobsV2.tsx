import { AppShell } from "../components/layout/AppShell";
import CivicJobsBoard from "../components/jobs/CivicJobsBoard";

export default function CivicJobsV2Page() {
  return (
    <AppShell
      title="Civic Jobs"
      hint="Dedicated civic employment board for Nexis, kept separate from adventure-focused work."
    >
      <CivicJobsBoard />
    </AppShell>
  );
}
