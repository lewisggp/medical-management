// Components Imports
import DashboardLayout from '@/components/layout/DashboardLayout';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default MainLayout;
