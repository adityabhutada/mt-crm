import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Megaphone, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth.jsx';

const CAMPAIGNS_STORAGE_KEY = 'crm_campaigns_data';

const initialCampaignsData = [
  { id: 'campaign_1', name: 'Camp Lejeune Water Contamination', status: 'Active', description: 'Campaign for victims of contaminated water at Camp Lejeune.' },
  { id: 'campaign_2', name: 'Talcum Powder Ovarian Cancer', status: 'Active', description: 'Targeting individuals affected by talcum powder related ovarian cancer.' },
  { id: 'campaign_3', name: 'Roundup Weed Killer Cancer', status: 'Paused', description: 'For those who developed cancer after exposure to Roundup.' },
  { id: 'campaign_4', name: '3M Combat Arms Earplugs', status: 'Active', description: 'Addressing hearing loss issues for veterans using 3M earplugs.' },
];

const CampaignForm = ({ open, onOpenChange, campaign, onSave }) => {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('Active');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (campaign) {
      setName(campaign.name);
      setStatus(campaign.status);
      setDescription(campaign.description);
    } else {
      setName('');
      setStatus('Active');
      setDescription('');
    }
  }, [campaign, open]);

  const handleSubmit = () => {
    onSave({ ...campaign, name, status, description });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] glass-effect border-white/20 text-white">
        <DialogHeader>
          <DialogTitle>{campaign ? 'Edit Campaign' : 'Create New Campaign'}</DialogTitle>
          <DialogDescription>
            {campaign ? 'Update the details for this campaign.' : 'Fill in the details for the new campaign.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right text-gray-300">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3 bg-white/10 border-white/20" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right text-gray-300">Description</Label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3 bg-white/10 border-white/20 rounded-md p-2 h-24" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right text-gray-300">Status</Label>
            <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className="col-span-3 bg-white/10 border-white/20 rounded-md p-2">
              <option value="Active">Active</option>
              <option value="Paused">Paused</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" className="border-white/20 hover:bg-white/10">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleSubmit} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">Save Campaign</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


const CampaignsPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [campaignsData, setCampaignsData] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [viewingCampaign, setViewingCampaign] = useState(null);


  useEffect(() => {
    const storedCampaigns = localStorage.getItem(CAMPAIGNS_STORAGE_KEY);
    if (storedCampaigns) {
      setCampaignsData(JSON.parse(storedCampaigns));
    } else {
      setCampaignsData(initialCampaignsData);
      localStorage.setItem(CAMPAIGNS_STORAGE_KEY, JSON.stringify(initialCampaignsData));
    }
  }, []);

  const saveCampaignsToStorage = (updatedCampaigns) => {
    localStorage.setItem(CAMPAIGNS_STORAGE_KEY, JSON.stringify(updatedCampaigns));
    setCampaignsData(updatedCampaigns);
  };

  const handleSaveCampaign = (campaignData) => {
    let updatedCampaigns;
    if (campaignData.id) {
      updatedCampaigns = campaignsData.map(c => c.id === campaignData.id ? campaignData : c);
      toast({ title: "Campaign Updated", description: `Campaign "${campaignData.name}" has been updated.` });
    } else {
      const newCampaign = { ...campaignData, id: `campaign_${Date.now()}` };
      updatedCampaigns = [...campaignsData, newCampaign];
      toast({ title: "Campaign Created", description: `Campaign "${newCampaign.name}" has been created.` });
    }
    saveCampaignsToStorage(updatedCampaigns);
    setEditingCampaign(null);
  };

  const handleDeleteCampaign = (campaignId) => {
    const campaignToDelete = campaignsData.find(c => c.id === campaignId);
    const updatedCampaigns = campaignsData.filter(c => c.id !== campaignId);
    saveCampaignsToStorage(updatedCampaigns);
    toast({ title: "Campaign Deleted", description: `Campaign "${campaignToDelete?.name}" has been deleted.`, variant: "destructive" });
  };
  
  const handleViewDetails = (campaign) => {
     toast({
      title: `Details for ${campaign.name}`,
      description: campaign.description || "No description available.",
    });
    setViewingCampaign(campaign);
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gradient flex items-center">
          <Megaphone className="w-8 h-8 mr-3 text-purple-500" />
          Campaign Management
        </h1>
        {user?.role === 'agency' && (
          <Button 
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            onClick={() => { setEditingCampaign(null); setIsFormOpen(true); }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Campaign
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaignsData.map((campaign, index) => (
          <motion.div
            key={campaign.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-effect border-white/10 card-hover h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-white">{campaign.name}</CardTitle>
                <CardDescription>
                  Status: <span className={campaign.status === 'Active' ? 'text-green-400' : campaign.status === 'Paused' ? 'text-yellow-400' : 'text-gray-400'}>{campaign.status}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">{campaign.description || "No description provided."}</p>
              </CardContent>
              <CardContent className="pt-0">
                 <div className="mt-auto flex space-x-2">
                  <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10" onClick={() => handleViewDetails(campaign)}>
                    <Eye className="w-3.5 h-3.5 mr-1.5"/>View
                  </Button>
                  {user?.role === 'agency' && (
                    <>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-white/10" onClick={() => { setEditingCampaign(campaign); setIsFormOpen(true); }}>
                        <Edit className="w-3.5 h-3.5 mr-1.5"/>Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-900/20" onClick={() => handleDeleteCampaign(campaign.id)}>
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
       {campaignsData.length === 0 && (
        <div className="text-center py-12">
            <Megaphone className="w-16 h-16 mx-auto mb-4 text-gray-500" />
            <p className="text-gray-300 text-lg">No Campaigns Yet</p>
            <p className="text-gray-500 text-sm mt-1">Click "Create New Campaign" to get started.</p>
        </div>
        )}
      <CampaignForm 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen} 
        campaign={editingCampaign} 
        onSave={handleSaveCampaign} 
      />
    </motion.div>
  );
};

export default CampaignsPage;