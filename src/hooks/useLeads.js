
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export const useLeads = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock leads data
  const mockLeads = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      phone: '(555) 123-4567',
      caseType: 'Personal Injury',
      status: 'new',
      source: 'agency',
      vendorId: null,
      assignedFirm: null,
      value: 5000,
      createdAt: '2024-01-15T10:30:00Z',
      notes: 'Car accident case, potential high value'
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@email.com',
      phone: '(555) 987-6543',
      caseType: 'Medical Malpractice',
      status: 'qualified',
      source: 'vendor',
      vendorId: 'vendor_1',
      assignedFirm: 'firm_1',
      value: 12000,
      createdAt: '2024-01-14T14:20:00Z',
      notes: 'Hospital negligence case'
    },
    {
      id: 3,
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike.johnson@email.com',
      phone: '(555) 456-7890',
      caseType: 'Product Liability',
      status: 'contacted',
      source: 'vendor',
      vendorId: 'vendor_2',
      assignedFirm: null,
      value: 8000,
      createdAt: '2024-01-13T09:15:00Z',
      notes: 'Defective product injury'
    },
    {
      id: 4,
      firstName: 'Sarah',
      lastName: 'Wilson',
      email: 'sarah.wilson@email.com',
      phone: '(555) 321-0987',
      caseType: 'Mass Tort',
      status: 'converted',
      source: 'agency',
      vendorId: null,
      assignedFirm: 'firm_1',
      value: 15000,
      createdAt: '2024-01-12T16:45:00Z',
      notes: 'Class action pharmaceutical case'
    }
  ];

  useEffect(() => {
    const loadLeads = () => {
      setLoading(true);
      
      // Simulate API delay
      setTimeout(() => {
        const savedLeads = localStorage.getItem('crm_leads');
        let allLeads = savedLeads ? JSON.parse(savedLeads) : mockLeads;
        
        // Filter leads based on user role
        let filteredLeads = allLeads;
        
        if (user?.role === 'vendor') {
          filteredLeads = allLeads.filter(lead => lead.vendorId === user.vendorId);
        } else if (user?.role === 'firm') {
          filteredLeads = allLeads.filter(lead => lead.assignedFirm === user.firmId);
        }
        
        setLeads(filteredLeads);
        setLoading(false);
      }, 500);
    };

    if (user) {
      loadLeads();
    }
  }, [user]);

  const addLead = (leadData) => {
    const newLead = {
      ...leadData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: 'new'
    };

    const savedLeads = localStorage.getItem('crm_leads');
    const allLeads = savedLeads ? JSON.parse(savedLeads) : mockLeads;
    const updatedLeads = [...allLeads, newLead];
    
    localStorage.setItem('crm_leads', JSON.stringify(updatedLeads));
    
    // Update local state if user can see this lead
    if (user?.role === 'agency' || 
        (user?.role === 'vendor' && newLead.vendorId === user.vendorId) ||
        (user?.role === 'firm' && newLead.assignedFirm === user.firmId)) {
      setLeads(prev => [...prev, newLead]);
    }
  };

  const updateLead = (leadId, updates) => {
    const savedLeads = localStorage.getItem('crm_leads');
    const allLeads = savedLeads ? JSON.parse(savedLeads) : mockLeads;
    const updatedLeads = allLeads.map(lead => 
      lead.id === leadId ? { ...lead, ...updates } : lead
    );
    
    localStorage.setItem('crm_leads', JSON.stringify(updatedLeads));
    setLeads(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, ...updates } : lead
    ));
  };

  const deleteLead = (leadId) => {
    const savedLeads = localStorage.getItem('crm_leads');
    const allLeads = savedLeads ? JSON.parse(savedLeads) : mockLeads;
    const updatedLeads = allLeads.filter(lead => lead.id !== leadId);
    
    localStorage.setItem('crm_leads', JSON.stringify(updatedLeads));
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
