import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { useLeads } from '@/hooks/useLeads.jsx';
import { useAuth } from '@/hooks/useAuth.jsx';
import { useToast } from '@/components/ui/use-toast';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Phone, 
  Mail,
  UserCheck,
  FileText,
  Plus,
  Eye
} from 'lucide-react';
import LeadForm from '@/components/LeadForm';
import LeadDetailModal from '@/components/LeadDetailModal';

const mockCampaigns = [
  { id: 'campaign_1', name: 'Camp Lejeune Water Contamination' },
  { id: 'campaign_2', name: 'Talcum Powder Ovarian Cancer' },
  { id: 'campaign_3', name: 'Roundup Weed Killer Cancer' },
  { id: 'campaign_4', name: '3M Combat Arms Earplugs' },
];

const LeadTable = ({ showAddButton = true }) => {
  const { leads, updateLead, deleteLead, loading: leadsLoading } = useLeads();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [campaignFilter, setCampaignFilter] = useState('all');
  const [editingLead, setEditingLead] = useState(null);
  const [viewingLead, setViewingLead] = useState(null);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadFormProps, setLeadFormProps] = useState({});


  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'contacted': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'qualified': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'converted': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const filteredLeads = leads.filter(lead => {
    const name = `${lead.firstName} ${lead.lastName}`.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      name.includes(searchLower) ||
      (lead.email && lead.email.toLowerCase().includes(searchLower)) ||
      (lead.caseType && lead.caseType.toLowerCase().includes(searchLower));
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesCampaign = campaignFilter === 'all' || lead.campaignId === campaignFilter;
    
    return matchesSearch && matchesStatus && matchesCampaign;
  });

  const handleStatusChange = (leadId, newStatus) => {
    if (user?.role === 'agency' || user?.role === 'agent') {
      updateLead(leadId, { status: newStatus });
      toast({
        title: "Status updated",
        description: `Lead status changed to ${newStatus}`,
      });
    } else {
      toast({
        title: "Permission Denied",
        description: "You do not have permission to change lead status.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteLead = (leadId) => {
    if (user?.role === 'agency') {
      deleteLead(leadId);
      toast({
        title: "Lead deleted",
        description: "Lead has been removed from the system",
        variant: "destructive"
      });
    } else {
       toast({
        title: "Permission Denied",
        description: "You do not have permission to delete leads.",
        variant: "destructive",
      });
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
    setEditingLead(null);
    setShowLeadForm(true);
  };
  
  const handleEditLeadClick = (lead) => {
    setEditingLead(lead);
    setLeadFormProps({ lead: lead, campaigns: mockCampaigns, formType: user.role });
    setShowLeadForm(true);
  };

  const handleViewLeadClick = (lead) => {
    setViewingLead(lead);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const canEditStatus = user?.role === 'agency' || user?.role === 'agent';

  if (leadsLoading) {
    return (
      <div className="flex-1 bg-background flex items-center justify-center py-10">
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
      <Card className="glass-effect border-white/10">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-white flex items-center"><FileText className="w-6 h-6 mr-2 text-blue-400"/>All Leads</CardTitle>
              <CardDescription>Manage and track all your leads.</CardDescription>
            </div>
            {showAddButton && (user?.role === 'agency' || user?.role === 'vendor' || user?.role === 'agent') && (
              <Button
                onClick={handleAddLeadClick}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 w-full md:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                {user?.role === 'vendor' ? 'Submit New Lead' : 'Add New Lead'}
              </Button>
            )}
          </div>
          <div className="mt-6 flex flex-col md:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name, email, case type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 w-full"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={campaignFilter} onValueChange={setCampaignFilter}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white w-full md:w-56">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by campaign" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Campaigns</SelectItem>
                {mockCampaigns.map(campaign => (
                  <SelectItem key={campaign.id} value={campaign.id}>{campaign.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-gray-300">Name</TableHead>
                  <TableHead className="text-gray-300 hidden md:table-cell">Contact</TableHead>
                  <TableHead className="text-gray-300">Case Type</TableHead>
                  <TableHead className="text-gray-300 hidden lg:table-cell">Campaign</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300 hidden md:table-cell">Date Added</TableHead>
                  <TableHead className="text-gray-300 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead, index) => (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className="border-white/10 hover:bg-white/5 cursor-pointer"
                    onClick={() => handleViewLeadClick(lead)}
                  >
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
                          <span className="text-white text-sm font-semibold">
                            {lead.firstName?.[0]?.toUpperCase()}{lead.lastName?.[0]?.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-white truncate max-w-[150px]">
                            {lead.firstName} {lead.lastName}
                          </p>
                          <p className="text-xs text-gray-400 md:hidden">{lead.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-300">
                          <Mail className="w-3 h-3 mr-1.5 shrink-0" />
                          <span className="truncate max-w-[180px]">{lead.email}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-300">
                          <Phone className="w-3 h-3 mr-1.5 shrink-0" />
                          {lead.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-white truncate max-w-[150px]">{lead.caseType}</span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="text-gray-300 truncate max-w-[200px]">{mockCampaigns.find(c => c.id === lead.campaignId)?.name || 'N/A'}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(lead.status)} whitespace-nowrap`}>
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="text-gray-300 whitespace-nowrap">
                        {formatDate(lead.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/10">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700 text-white" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenuItem 
                            onClick={() => handleViewLeadClick(lead)}
                            className="hover:!bg-gray-800 focus:!bg-gray-800 cursor-pointer"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleEditLeadClick(lead)}
                            className="hover:!bg-gray-800 focus:!bg-gray-800 cursor-pointer"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Lead
                          </DropdownMenuItem>
                          {canEditStatus && (
                            <>
                              <DropdownMenuSeparator className="bg-gray-700"/>
                              <DropdownMenuItem 
                                onClick={() => handleStatusChange(lead.id, 'contacted')}
                                className="hover:!bg-gray-800 focus:!bg-gray-800 cursor-pointer"
                              >
                                <Phone className="w-4 h-4 mr-2" />
                                Mark Contacted
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleStatusChange(lead.id, 'qualified')}
                                className="hover:!bg-gray-800 focus:!bg-gray-800 cursor-pointer"
                              >
                                <UserCheck className="w-4 h-4 mr-2" />
                                Mark Qualified
                              </DropdownMenuItem>
                            </>
                          )}
                          {(user?.role === 'agency') && (
                            <>
                              <DropdownMenuSeparator className="bg-gray-700"/>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteLead(lead.id)}
                                className="text-red-400 hover:!bg-red-900/20 focus:!bg-red-900/20 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Lead
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredLeads.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-300 text-lg">No leads found</p>
              <p className="text-gray-500 text-sm mt-1">
                {searchTerm || statusFilter !== 'all' || campaignFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Start by adding your first lead or check back later!'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {showLeadForm && (
        <LeadForm 
          {...leadFormProps}
          lead={editingLead}
          onClose={() => { setShowLeadForm(false); setEditingLead(null); }} 
        />
      )}
      {viewingLead && (
        <LeadDetailModal
          lead={viewingLead}
          campaigns={mockCampaigns}
          onClose={() => setViewingLead(null)}
          onEdit={() => {
            handleEditLeadClick(viewingLead);
            setViewingLead(null);
          }}
          onStatusChange={handleStatusChange}
        />
      )}
    </>
  );
};

export default LeadTable;