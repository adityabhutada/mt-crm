import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Plus, Mail, Phone, Edit, Trash2, Eye, Briefcase } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth.jsx';

const VENDORS_STORAGE_KEY = 'crm_vendors_data';

const initialVendorsData = [
  { id: 'vendor_1', name: 'Vendor One', email: 'contact@vendorone.com', phone: '(555) 111-1111', vendorCode: 'VONE001', leadsSubmitted: 45, activeCampaigns: 2 },
  { id: 'vendor_2', name: 'TopLeads Co.', email: 'sales@topleads.co', phone: '(555) 222-2222', vendorCode: 'TOPL002', leadsSubmitted: 120, activeCampaigns: 3 },
  { id: 'vendor_new', name: 'Fresh Prospects Inc.', email: 'info@freshprospects.com', phone: '(555) 333-3333', vendorCode: 'FRSH003', leadsSubmitted: 78, activeCampaigns: 1 },
];

const VendorForm = ({ open, onOpenChange, vendor, onSave }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [vendorCode, setVendorCode] = useState('');

  useEffect(() => {
    if (vendor) {
      setName(vendor.name);
      setEmail(vendor.email);
      setPhone(vendor.phone);
      setVendorCode(vendor.vendorCode || '');
    } else {
      setName('');
      setEmail('');
      setPhone('');
      setVendorCode(`V${Date.now().toString().slice(-4)}`); 
    }
  }, [vendor, open]);

  const handleSubmit = () => {
    onSave({ ...vendor, name, email, phone, vendorCode });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] glass-effect border-white/20 text-white">
        <DialogHeader>
          <DialogTitle>{vendor ? 'Edit Vendor' : 'Add New Vendor'}</DialogTitle>
          <DialogDescription>
            {vendor ? 'Update the details for this vendor.' : 'Fill in the details for the new vendor.'}
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="vendorCode" className="text-right text-gray-300">Vendor Code</Label>
            <Input id="vendorCode" value={vendorCode} onChange={(e) => setVendorCode(e.target.value)} className="col-span-3 bg-white/10 border-white/20" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" className="border-white/20 hover:bg-white/10">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleSubmit} className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600">Save Vendor</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const VendorsPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [vendorsData, setVendorsData] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);

  useEffect(() => {
    const storedVendors = localStorage.getItem(VENDORS_STORAGE_KEY);
    if (storedVendors) {
      setVendorsData(JSON.parse(storedVendors));
    } else {
      setVendorsData(initialVendorsData);
      localStorage.setItem(VENDORS_STORAGE_KEY, JSON.stringify(initialVendorsData));
    }
  }, []);

  const saveVendorsToStorage = (updatedVendors) => {
    localStorage.setItem(VENDORS_STORAGE_KEY, JSON.stringify(updatedVendors));
    setVendorsData(updatedVendors);
  };

  const handleSaveVendor = (vendorData) => {
    let updatedVendors;
    if (vendorData.id) {
      updatedVendors = vendorsData.map(v => v.id === vendorData.id ? vendorData : v);
      toast({ title: "Vendor Updated", description: `Vendor "${vendorData.name}" has been updated.` });
    } else {
      const newVendor = { ...vendorData, id: `vendor_${Date.now()}`, leadsSubmitted: 0, activeCampaigns: 0 };
      updatedVendors = [...vendorsData, newVendor];
      toast({ title: "Vendor Added", description: `Vendor "${newVendor.name}" has been added.` });
    }
    saveVendorsToStorage(updatedVendors);
    setEditingVendor(null);
  };

  const handleDeleteVendor = (vendorId) => {
    const vendorToDelete = vendorsData.find(v => v.id === vendorId);
    const updatedVendors = vendorsData.filter(v => v.id !== vendorId);
    saveVendorsToStorage(updatedVendors);
    toast({ title: "Vendor Deleted", description: `Vendor "${vendorToDelete?.name}" has been deleted.`, variant: "destructive" });
  };

  const handleViewDetails = (vendor) => {
    toast({
      title: `Details for ${vendor.name}`,
      description: `Email: ${vendor.email}, Phone: ${vendor.phone}, Code: ${vendor.vendorCode}`,
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
          <Users className="w-8 h-8 mr-3 text-green-500" />
          Vendor Management
        </h1>
        {user?.role === 'agency' && (
          <Button 
            className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
            onClick={() => { setEditingVendor(null); setIsFormOpen(true); }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Vendor
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendorsData.map((vendor, index) => (
          <motion.div
            key={vendor.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-effect border-white/10 card-hover h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-white">{vendor.name}</CardTitle>
                <CardDescription className="flex items-center text-gray-400">
                  <Mail className="w-3 h-3 mr-1.5" /> {vendor.email}
                </CardDescription>
                 <CardDescription className="flex items-center text-gray-400">
                  <Phone className="w-3 h-3 mr-1.5" /> {vendor.phone}
                </CardDescription>
                <CardDescription className="flex items-center text-gray-400">
                  <Briefcase className="w-3 h-3 mr-1.5" /> Code: {vendor.vendorCode}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-2 text-sm">
                  <p className="text-gray-300">Leads Submitted: <span className="font-semibold text-white">{vendor.leadsSubmitted}</span></p>
                  <p className="text-gray-300">Active Campaigns: <span className="font-semibold text-white">{vendor.activeCampaigns}</span></p>
                </div>
              </CardContent>
              <CardContent className="pt-0">
                <div className="mt-auto flex space-x-2">
                  <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10" onClick={() => handleViewDetails(vendor)}>
                    <Eye className="w-3.5 h-3.5 mr-1.5"/>View
                  </Button>
                  {user?.role === 'agency' && (
                    <>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-white/10" onClick={() => { setEditingVendor(vendor); setIsFormOpen(true); }}>
                        <Edit className="w-3.5 h-3.5 mr-1.5"/>Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-900/20" onClick={() => handleDeleteVendor(vendor.id)}>
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
      {vendorsData.length === 0 && (
        <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-500" />
            <p className="text-gray-300 text-lg">No Vendors Yet</p>
            <p className="text-gray-500 text-sm mt-1">Click "Add New Vendor" to get started.</p>
        </div>
        )}
      <VendorForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        vendor={editingVendor}
        onSave={handleSaveVendor}
      />
    </motion.div>
  );
};

export default VendorsPage;