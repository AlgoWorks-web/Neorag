import { FaComment, FaEye, FaShareAlt, FaUsers, FaUser, FaBookmark, FaLaptop } from 'react-icons/fa';
import StatsCards from './StatsCards';
import RegionsFeeds from './RegionsFeeds';
import GeneralStats from './GeneralStats';
import CountriesTable from './CountriesTable';
import RecentUsers from './RecentUsers';
import AdminFooter from './AdminFooter';

const AdminHome = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <header className="mb-6">
        <p className="text-gray-600">Welcome back! Here's what's happening with your platform today.</p>
      </header>

      <StatsCards />
      {/* <RegionsFeeds />
      <GeneralStats />
      <CountriesTable />
      <RecentUsers /> */}
    </div>
  );
}

export default AdminHome;