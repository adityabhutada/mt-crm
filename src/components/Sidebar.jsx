
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth.jsx';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Briefcase, 
  Settings,
  Megaphone,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['agency', 'vendor', 'agent'] },
    { name: 'Leads', path: '/leads', icon: FileText, roles: ['agency', 'vendor', 'agent'] },
    { name: 'Campaigns', path: '/campaigns', icon: Megaphone, roles: ['agency'] },
    { name: 'Vendors', path: '/vendors', icon: Users, roles: ['agency'] },
    { name: 'Agents', path: '/agents', icon: Briefcase, roles: ['agency'] },
    { name: 'Settings', path: '/settings', icon: Settings, roles: ['agency', 'vendor', 'agent'] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(user?.role));

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };


  return (
    <motion.aside
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}
      className="w-64 bg-gray-900/70 backdrop-blur-lg border-r border-white/10 flex flex-col p-4 space-y-2 sticky top-0 h-screen"
    >
      <div className="flex-grow">
        <nav className="space-y-2">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200
                 ${isActive 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                    : 'text-gray-400 hover:bg-white/10 hover:text-white'}`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="pt-2 border-t border-white/10">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-red-400 hover:bg-red-900/20 hover:text-red-300"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
