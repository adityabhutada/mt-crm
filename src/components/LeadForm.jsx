
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLeads } from '@/hooks/useLeads.jsx';
import { useAuth } from '@/hooks/useAuth.jsx';
import { useToast } from '@/components/ui/use-toast';
import { X, User, Phone, Mail, FileText, Tag, Briefcase } from 'lucide-react';

const LeadForm = ({ onClose, lead = null, formType = 'agency', campaigns = [] }) => {
  const { addLead, updateLead } = useLeads();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: lead?.firstName || '',
    lastName: lead?.lastName || '',
    email: lead?.email || '',
    phone: lead?.phone || '',
    caseType: lead?.caseType || '',
    source: lead?.source || (formType === 'vendor' ? 'vendor_submitted' : formType === 'agent' ? 'agent_submitted' : 'agency_submitted'),
    notes: lead?.notes || '',
    campaignId: lead?.campaignId || (campaigns.length > 0 ? campaigns[0].id : ''),
    vendorLeadId: lead?.vendorLeadId || '', 
    agentId: lead?.agentId || (formType === 'agent' && user?.agentId ? user.agentId : ''),
  });

  useEffect(() => {
    if (formType === 'vendor' && user?.vendorId) {
      setFormData(prev => ({ ...prev, vendorId: user.vendorId, source: 'vendor_submitted' }));
    } else if (formType === 'agent' && user?.agentId) {
      setFormData(prev => ({ ...prev, agentId: user.agentId, source: 'agent_submitted' }));
    }
  }, [formType, user]);

  const caseTypes = [
    'Personal Injury',
    'Medical Malpractice',
    'Product Liability',
    'Mass Tort',
    'Class Action',
    'Workers Compensation',
    'Auto Accident',
    'Slip and Fall'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const leadData = {
        ...formData,
        vendorId: formType === 'vendor' ? user.vendorId : (lead?.vendorId || null),
        agentId: formType === 'agent' ? user.agentId : (lead?.agentId || null),
      };

      if (lead) {
        updateLead(lead.id, leadData);
        toast({
          title: "Lead updated!",
          description: "Lead information has been successfully updated.",
        });
      } else {
        addLead(leadData);
        toast({
          title: "Lead added!",
          description: "New lead has been successfully added to the system.",
        });
      }

      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl"
      >
        <Card className="glass-effect border-white/20 max-h-[90vh] flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">
              {lead ? 'Edit Lead' : 
                formType === 'vendor' ? 'Submit New Vendor Lead' :
                formType === 'agent' ? 'Add New Agent Lead' :
                'Add New Lead'}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="overflow-y-auto flex-grow">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    First Name
                  </label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Enter first name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">
                    Last Name
                  </label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Enter email address"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    Phone
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Case Type
                  </label>
                  <Select value={formData.caseType} onValueChange={(value) => handleChange('caseType', value)} required>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select case type" />
                    </SelectTrigger>
                    <SelectContent>
                      {caseTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {campaigns && campaigns.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white flex items-center">
                      <Tag className="w-4 h-4 mr-2" />
                      Campaign
                    </label>
                    <Select value={formData.campaignId} onValueChange={(value) => handleChange('campaignId', value)} required>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select campaign" />
                      </SelectTrigger>
                      <SelectContent>
                        {campaigns.map((campaign) => (
                          <SelectItem key={campaign.id} value={campaign.id}>
                            {campaign.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              
              {formType === 'vendor' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white flex items-center">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Vendor Lead ID (Optional)
                  </label>
                  <Input
                    value={formData.vendorLeadId}
                    onChange={(e) => handleChange('vendorLeadId', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Enter your internal lead ID"
                  />
                </div>
              )}

              {(formType === 'agency' || user?.role === 'agency') && (
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-white">
                    Source
                    </label>
                    <Select value={formData.source} onValueChange={(value) => handleChange('source', value)}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="agency_submitted">Agency Submitted</SelectItem>
                        <SelectItem value="vendor_submitted">Vendor Submitted</SelectItem>
                        <SelectItem value="agent_submitted">Agent Submitted</SelectItem>
                        <SelectItem value="referral">Referral</SelectItem>
                        <SelectItem value="website">Website</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
              )}


              <div className="space-y-2">
                <label className="text-sm font-medium text-white">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add any additional notes..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    lead ? 'Update Lead' : 'Submit Lead'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LeadForm;
