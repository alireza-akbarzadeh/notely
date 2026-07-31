import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { Header } from "@/components/layout/header";

export default function DashboardPage() {
  return (
    <>
      <Header title="Dashboard" subtitle="Overview of your trading activity" />
      <DashboardOverview />
    </>
  );
}
