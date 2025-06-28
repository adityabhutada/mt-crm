import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth.jsx';
import { X, User, Phone, Mail, FileText, Tag, Briefcase, CalendarDays, Edit, Info, CheckCircle, AlertTriangle } from 'lucide-react';

const LeadDetailModal = ({ lead, campaigns, onClose, onEdit, onStatusChange }) => {
  const { user } = useAuth();
  const canEditStatus = user?.role === 'agency' || user?.role === 'agent';

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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const campaignName = campaigns.find(c => c.id === lead.campaignId)?.name || 'N/A';

  const leadStatusOptions = ['new', 'contacted', 'qualified', 'converted', 'rejected'];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-2xl"
      >
        <Card className="glass-effect border-white/20 max-h-[90vh] flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-white">{lead.firstName} {lead.lastName}</CardTitle>
                <CardDescription>Lead Details</CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {onEdit && (user?.role === 'agency' || user?.role === 'agent' || user?.role === 'vendor') && (
                <Button variant="outline" size="icon" onClick={onEdit} className="text-white hover:bg-white/20 border-white/20">
                  <Edit className="w-4 h-4" />
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="overflow-y-auto flex-grow space-y-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <InfoItem icon={Mail} label="Email" value={lead.email} />
              <InfoItem icon={Phone} label="Phone" value={lead.phone} />
              <InfoItem icon={FileText} label="Case Type" value={lead.caseType} />
              <InfoItem icon={Tag} label="Campaign" value={campaignName} />
              <InfoItem icon={CalendarDays} label="Date Added" value={formatDate(lead.createdAt)} />
              <InfoItem icon={Info} label="Source" value={lead.source || 'N/A'} />
              {lead.vendorLeadId && <InfoItem icon={Briefcase} label="Vendor Lead ID" value={lead.vendorLeadId} />}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                Status
              </label>
              {canEditStatus ? (
                <Select
                  value={lead.status}
                  onValueChange={(newStatus) => onStatusChange(lead.id, newStatus)}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {leadStatusOptions.map(status => (
                      <SelectItem key={status} value={status}>
                        <span className="capitalize">{status}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Badge className={`${getStatusColor(lead.status)} text-base px-3 py-1`}>
                  {lead.status}
                </Badge>
              )}
            </div>

            {lead.notes && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-white flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2 text-yellow-400" />
                  Notes
                </label>
                <p className="text-gray-300 bg-white/5 p-3 rounded-md border border-white/10 whitespace-pre-wrap">
                  {lead.notes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="space-y-1">
    <label className="text-xs font-medium text-gray-400 flex items-center">
      <Icon className="w-3.5 h-3.5 mr-2" />
      {label}
    </label>
    <p className="text-sm text-white truncate">{value || 'N/A'}</p>
  </div>
);

export default LeadDetailModal;