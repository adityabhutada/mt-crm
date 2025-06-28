
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth.jsx';
import { useLeads } from '@/hooks/useLeads.jsx';
import { 
  Users, 
  TrendingUp, 
  FileText, 
  Plus,
  Phone,
  Mail,
  Calendar,
  UserPlus,
  LayoutDashboard
} from 'lucide-react';
import LeadForm from '@/components/LeadForm';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

const mockCampaigns = [
  { id: 'campaign_1', name: 'Camp Lejeune Water Contamination' },
  { id: 'campaign_2', name: 'Talcum Powder Ovarian Cancer' },
  { id: 'campaign_3', name: 'Roundup Weed Killer Cancer' },
  { id: 'campaign_4', name: '3M Combat Arms Earplugs' },
];

const Dashboard = () => {
  const { user } = useAuth();
  const { leads, loading: leadsLoading } = useLeads();
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadFormProps, setLeadFormProps] = useState({});
  const { toast } = useToast();


  const getStats = () => {
    const totalLeads = leads.length;
    const newLeads = leads.filter(lead => lead.status === 'new').length;
    const qualifiedLeads = leads.filter(lead => lead.status === 'qualified').length;
    
    return { totalLeads, newLeads, qualifiedLeads };
  };

  const stats = getStats();

  const statCards = [
    {
      title: 'Total Leads',
      value: stats.totalLeads,
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'New Leads',
      value: stats.newLeads,
      icon: TrendingUp,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Qualified Leads',
      value: stats.qualifiedLeads,
      icon: FileText,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    }
  ];

  const getRoleTitle = () => {
    switch (user?.role) {
      case 'agency': return 'Agency Dashboard';
      case 'vendor': return 'Vendor Portal';
      case 'agent': return 'Agent Dashboard';
      default: return 'Dashboard';
    }
  };

  const handleAddLeadClick = () => {
    let formType = 'agency';
    if (user?.role === 'vendor') formType = 'vendor';
    if (user?.role === 'agent') formType = 'agent';
    
    setLeadFormProps({
      formType: formType,
      campaigns: mockCampaigns 
    });
    setShowLeadForm(true);
  };

  if (leadsLoading) {
    return (
      <div className="flex-1 bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-gradient flex items-center">
            <LayoutDashboard className="w-8 h-8 mr-3 text-blue-500" />
            {getRoleTitle()}
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user?.name}! Here's what's happening.
          </p>
        </div>
        {(user?.role === 'agency' || user?.role === 'vendor' || user?.role === 'agent') && (
          <Button
            onClick={handleAddLeadClick}
            className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            {user?.role === 'vendor' ? <UserPlus className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
            {user?.role === 'vendor' ? 'Submit Lead' : 'Add New Lead'}
          </Button>
        )}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="card-hover glass-effect border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-white mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
      >
        <Card className="lg:col-span-2 glass-effect border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Recent Leads Overview</CardTitle>
            <CardDescription>A quick look at the latest lead activity.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leads.slice(0, 5).map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {lead.firstName?.[0]?.toUpperCase()}{lead.lastName?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        {lead.firstName} {lead.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {lead.caseType} - {mockCampaigns.find(c => c.id === lead.campaignId)?.name || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <Badge variant={
                      lead.status === 'new' ? 'default' :
                      lead.status === 'qualified' ? 'secondary' :
                      'outline'
                    } className={
                      lead.status === 'new' ? 'bg-blue-500/80 border-blue-400' :
                      lead.status === 'qualified' ? 'bg-green-500/80 border-green-400' :
                      'border-gray-400'
                    }>
                      {lead.status}
                    </Badge>
                </div>
              ))}
               {leads.length === 0 && (
                <p className="text-muted-foreground text-center py-4">No leads found for your account yet. Add one to get started!</p>
              )}
            </div>
            {leads.length > 5 && (
              <div className="mt-6 text-center">
                <Link to="/leads">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    View All Leads
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start border-white/20 hover:bg-white/10 text-white"
              onClick={() => {
                toast({
                  title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
                });
              }}
            >
              <Phone className="w-4 h-4 mr-2" />
              Call Lead
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start border-white/20 hover:bg-white/10 text-white"
              onClick={() => {
                toast({
                  title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
                });
              }}
            >
              <Mail className="w-4 h-4 mr-2" />
              Send Email
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start border-white/20 hover:bg-white/10 text-white"
              onClick={() => {
                toast({
                  title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
                });
              }}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Follow-up
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {showLeadForm && (
        <LeadForm 
          onClose={() => setShowLeadForm(false)} 
          {...leadFormProps}
        />
      )}
    </>
  );
};

export default Dashboard;
