
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth.jsx';

const initialMockLeads = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '(555) 123-4567',
    caseType: 'Personal Injury',
    status: 'new',
    source: 'agency_submitted',
    vendorId: null,
    agentId: null,
    assignedFirm: null,
    createdAt: '2025-06-15T10:30:00Z',
    notes: 'Car accident case, potential high value',
    campaignId: 'campaign_1'
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@email.com',
    phone: '(555) 987-6543',
    caseType: 'Medical Malpractice',
    status: 'qualified',
    source: 'vendor_submitted',
    vendorId: 'vendor_1',
    agentId: null,
    assignedFirm: null,
    createdAt: '2025-06-14T14:20:00Z',
    notes: 'Hospital negligence case',
    campaignId: 'campaign_2',
    vendorLeadId: 'VN001'
  },
  {
    id: 3,
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike.johnson@email.com',
    phone: '(555) 456-7890',
    caseType: 'Product Liability',
    status: 'contacted',
    source: 'vendor_submitted',
    vendorId: 'vendor_2',
    agentId: null,
    assignedFirm: null,
    createdAt: '2025-06-13T09:15:00Z',
    notes: 'Defective product injury',
    campaignId: 'campaign_3',
    vendorLeadId: 'VN002'
  },
  {
    id: 4,
    firstName: 'Sarah',
    lastName: 'Wilson',
    email: 'sarah.wilson@email.com',
    phone: '(555) 321-0987',
    caseType: 'Mass Tort',
    status: 'converted',
    source: 'agency_submitted',
    vendorId: null,
    agentId: null,
    assignedFirm: null,
    createdAt: '2025-06-12T16:45:00Z',
    notes: 'Class action pharmaceutical case',
    campaignId: 'campaign_4'
  },
  {
    id: 5,
    firstName: 'David',
    lastName: 'Brown',
    email: 'david.brown@email.com',
    phone: '(555) 111-2222',
    caseType: 'Auto Accident',
    status: 'new',
    source: 'agent_submitted',
    vendorId: null,
    agentId: 'agent_1', 
    assignedFirm: null,
    createdAt: '2025-06-16T11:00:00Z',
    notes: 'Rear-end collision, client has whiplash.',
    campaignId: 'campaign_1'
  }
];

export const useLeads = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const getStoredLeads = useCallback(() => {
    const savedLeads = localStorage.getItem('crm_leads');
    if (savedLeads) {
        const parsedLeads = JSON.parse(savedLeads);
        return parsedLeads.map(lead => {
            const { value, ...rest } = lead;
            return rest;
        });
    }
    return initialMockLeads.map(lead => {
        const { value, ...rest } = lead;
        return rest;
    });
  }, []);

  const storeLeads = useCallback((leadsToStore) => {
    localStorage.setItem('crm_leads', JSON.stringify(leadsToStore));
  }, []);

  useEffect(() => {
    const loadLeads = () => {
      setLoading(true);
      
      setTimeout(() => {
        let allLeads = getStoredLeads();
        if (allLeads.length === 0 && initialMockLeads.length > 0) {
          allLeads = initialMockLeads.map(lead => {
            const { value, ...rest } = lead;
            return rest;
          });
          storeLeads(allLeads);
        }
        
        let filteredLeads = allLeads;
        
        if (user?.role === 'vendor') {
          filteredLeads = allLeads.filter(lead => lead.vendorId === user.vendorId);
        } else if (user?.role === 'agent') {
          filteredLeads = allLeads.filter(lead => lead.agentId === user.agentId);
        }
        
        setLeads(filteredLeads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        setLoading(false);
      }, 500);
    };

    if (user) {
      loadLeads();
    }
  }, [user, getStoredLeads, storeLeads]);

  const addLead = (leadData) => {
    const { value, ...restOfLeadData } = leadData;
    const newLead = {
      ...restOfLeadData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: 'new',
      vendorId: user?.role === 'vendor' ? user.vendorId : leadData.vendorId,
      agentId: user?.role === 'agent' ? user.agentId : leadData.agentId,
    };

    const allLeads = getStoredLeads();
    const updatedLeads = [...allLeads, newLead];
    storeLeads(updatedLeads);
    
    if (user?.role === 'agency' || 
        (user?.role === 'vendor' && newLead.vendorId === user.vendorId) ||
        (user?.role === 'agent' && newLead.agentId === user.agentId)) {
      setLeads(prev => [...prev, newLead].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    }
  };

  const updateLead = (leadId, updates) => {
    const { value, ...restOfUpdates } = updates;
    const allLeads = getStoredLeads();
    const updatedLeadsStored = allLeads.map(lead => 
      lead.id === leadId ? { ...lead, ...restOfUpdates } : lead
    );
    storeLeads(updatedLeadsStored);

    setLeads(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, ...restOfUpdates } : lead
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  };

  const deleteLead = (leadId) => {
    const allLeads = getStoredLeads();
    const updatedLeads = allLeads.filter(lead => lead.id !== leadId);
    storeLeads(updatedLeads);

    setLeads(prev => prev.filter(lead => lead.id !== leadId));
  };

  return {
    leads,
    loading,
    addLead,
    updateLead,
    deleteLead
  };
};
