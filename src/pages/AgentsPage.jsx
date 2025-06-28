import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, Plus, Mail, Phone, Edit, Trash2, Eye } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth.jsx';

const AGENTS_STORAGE_KEY = 'crm_agents_data';

const initialAgentsData = [
  { id: 'agent_1', name: 'Agent Smith', email: 'smith@agency.com', phone: '(555) 001-0001', leadsGenerated: 32, conversionRate: '20%' },
  { id: 'agent_2', name: 'Agent Jones', email: 'jones@agency.com', phone: '(555) 002-0002', leadsGenerated: 55, conversionRate: '15%' },
  { id: 'agent_3', name: 'Agent Brown', email: 'brown@agency.com', phone: '(555) 003-0003', leadsGenerated: 21, conversionRate: '25%' },
];

const AgentForm = ({ open, onOpenChange, agent, onSave }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (agent) {
      setName(agent.name);
      setEmail(agent.email);
      setPhone(agent.phone);
    } else {
      setName('');
      setEmail('');
      setPhone('');
    }
  }, [agent, open]);

  const handleSubmit = () => {
    onSave({ ...agent, name, email, phone });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] glass-effect border-white/20 text-white">
        <DialogHeader>
          <DialogTitle>{agent ? 'Edit Agent' : 'Add New Agent'}</DialogTitle>
          <DialogDescription>
            {agent ? 'Update the details for this agent.' : 'Fill in the details for the new agent.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right text-gray-300">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3 bg-white/10 border-white/20" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right text-gray-300">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3 bg-white/10 border-white/20" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right text-gray-300">Phone</Label>
            <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="col-span-3 bg-white/10 border-white/20" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" className="border-white/20 hover:bg-white/10">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleSubmit} className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">Save Agent</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const AgentsPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [agentsData, setAgentsData] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);

  useEffect(() => {
    const storedAgents = localStorage.getItem(AGENTS_STORAGE_KEY);
    if (storedAgents) {
      setAgentsData(JSON.parse(storedAgents));
    } else {
      setAgentsData(initialAgentsData);
      localStorage.setItem(AGENTS_STORAGE_KEY, JSON.stringify(initialAgentsData));
    }
  }, []);

  const saveAgentsToStorage = (updatedAgents) => {
    localStorage.setItem(AGENTS_STORAGE_KEY, JSON.stringify(updatedAgents));
    setAgentsData(updatedAgents);
  };

  const handleSaveAgent = (agentData) => {
    let updatedAgents;
    if (agentData.id) {
      updatedAgents = agentsData.map(a => a.id === agentData.id ? agentData : a);
      toast({ title: "Agent Updated", description: `Agent "${agentData.name}" has been updated.` });
    } else {
      const newAgent = { ...agentData, id: `agent_${Date.now()}`, leadsGenerated: 0, conversionRate: '0%' };
      updatedAgents = [...agentsData, newAgent];
      toast({ title: "Agent Added", description: `Agent "${newAgent.name}" has been added.` });
    }
    saveAgentsToStorage(updatedAgents);
    setEditingAgent(null);
  };

  const handleDeleteAgent = (agentId) => {
    const agentToDelete = agentsData.find(a => a.id === agentId);
    const updatedAgents = agentsData.filter(a => a.id !== agentId);
    saveAgentsToStorage(updatedAgents);
    toast({ title: "Agent Deleted", description: `Agent "${agentToDelete?.name}" has been deleted.`, variant: "destructive" });
  };

  const handleViewDetails = (agent) => {
     toast({
      title: `Performance for ${agent.name}`,
      description: `Leads: ${agent.leadsGenerated}, Conversion: ${agent.conversionRate}`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gradient flex items-center">
          <Briefcase className="w-8 h-8 mr-3 text-orange-500" />
          Agent Management
        </h1>
        {user?.role === 'agency' && (
          <Button 
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            onClick={() => { setEditingAgent(null); setIsFormOpen(true); }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Agent
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agentsData.map((agent, index) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-effect border-white/10 card-hover h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-white">{agent.name}</CardTitle>
                 <CardDescription className="flex items-center text-gray-400">
                  <Mail className="w-3 h-3 mr-1.5" /> {agent.email}
                </CardDescription>
                 <CardDescription className="flex items-center text-gray-400">
                  <Phone className="w-3 h-3 mr-1.5" /> {agent.phone}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-2 text-sm">
                  <p className="text-gray-300">Leads Generated: <span className="font-semibold text-white">{agent.leadsGenerated}</span></p>
                  <p className="text-gray-300">Conversion Rate: <span className="font-semibold text-white">{agent.conversionRate}</span></p>
                </div>
              </CardContent>
              <CardContent className="pt-0">
                <div className="mt-auto flex space-x-2">
                  <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10" onClick={() => handleViewDetails(agent)}>
                    <Eye className="w-3.5 h-3.5 mr-1.5"/>Performance
                  </Button>
                  {user?.role === 'agency' && (
                    <>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-white/10" onClick={() => { setEditingAgent(agent); setIsFormOpen(true); }}>
                        <Edit className="w-3.5 h-3.5 mr-1.5"/>Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-900/20" onClick={() => handleDeleteAgent(agent.id)}>
                        <Trash2 className="w-3.5 h-3.5 mr-1.5"/>Delete
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      {agentsData.length === 0 && (
        <div className="text-center py-12">
            <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-500" />
            <p className="text-gray-300 text-lg">No Agents Yet</p>
            <p className="text-gray-500 text-sm mt-1">Click "Add New Agent" to get started.</p>
        </div>
        )}
      <AgentForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        agent={editingAgent}
        onSave={handleSaveAgent}
      />
    </motion.div>
  );
};

export default AgentsPage;