
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label.jsx';
import { Settings, User, Lock, Bell, Save } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth.jsx';
import { useToast } from '@/components/ui/use-toast';

const SettingsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleFeatureRequest = (featureName) => {
    toast({
      title: `🚧 ${featureName} feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀`
    });
  };
  
  const handleSubmit = (e, featureName) => {
    e.preventDefault();
    handleFeatureRequest(featureName);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gradient flex items-center">
          <Settings className="w-8 h-8 mr-3 text-gray-400" />
          Settings
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Settings */}
        <Card className="glass-effect border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center"><User className="w-5 h-5 mr-2 text-blue-400"/>Profile Settings</CardTitle>
            <CardDescription>Update your personal information.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => handleSubmit(e, "Profile Update")} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                <Input id="name" type="text" defaultValue={user?.name} className="bg-white/10 border-white/20 text-white mt-1" />
              </div>
              <div>
                <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                <Input id="email" type="email" defaultValue={user?.email} className="bg-white/10 border-white/20 text-white mt-1" />
              </div>
              <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                <Save className="w-4 h-4 mr-2"/>Update Profile
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Password Settings */}
        <Card className="glass-effect border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center"><Lock className="w-5 h-5 mr-2 text-red-400"/>Change Password</CardTitle>
            <CardDescription>Update your account password.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => handleSubmit(e, "Password Change")} className="space-y-4">
              <div>
                <Label htmlFor="currentPassword" className="text-gray-300">Current Password</Label>
                <Input id="currentPassword" type="password" placeholder="••••••••" className="bg-white/10 border-white/20 text-white mt-1" />
              </div>
              <div>
                <Label htmlFor="newPassword" className="text-gray-300">New Password</Label>
                <Input id="newPassword" type="password" placeholder="••••••••" className="bg-white/10 border-white/20 text-white mt-1" />
              </div>
              <div>
                <Label htmlFor="confirmPassword" className="text-gray-300">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" placeholder="••••••••" className="bg-white/10 border-white/20 text-white mt-1" />
              </div>
              <Button type="submit" className="bg-red-500 hover:bg-red-600">
                <Save className="w-4 h-4 mr-2"/>Change Password
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Notification Settings - Placeholder */}
        <Card className="glass-effect border-white/10 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-white flex items-center"><Bell className="w-5 h-5 mr-2 text-yellow-400"/>Notification Settings</CardTitle>
            <CardDescription>Manage your notification preferences.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">Notification settings are not yet available.</p>
            <Button className="mt-4 bg-yellow-500 hover:bg-yellow-600" onClick={() => handleFeatureRequest("Notification Settings")}>
              Request This Feature
            </Button>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default SettingsPage;
