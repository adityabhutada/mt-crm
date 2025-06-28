
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth.jsx';
import { useToast } from '@/components/ui/use-toast';
import { LogIn, Scale, Users, Building, Briefcase, UserPlus } from 'lucide-react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = login(email, password);
    
    if (result.success) {
      toast({
        title: "Welcome back!",
        description: "Successfully logged in to your CRM dashboard.",
      });
    } else {
      toast({
        title: "Login failed",
        description: result.error,
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  const demoAccounts = [
    { email: 'agency@example.com', role: 'Agency Admin', icon: Building, color: 'text-blue-400' },
    { email: 'vendor1@example.com', role: 'Vendor One', icon: Users, color: 'text-green-400' },
    { email: 'agent1@example.com', role: 'Agent', icon: Briefcase, color: 'text-orange-400' }
  ];

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="glass-effect border-white/20">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4"
            >
              <Scale className="w-8 h-8 text-white" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-white">Mass Tort CRM</CardTitle>
            <CardDescription className="text-gray-300">
              Lead Management System
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                disabled={loading}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Link to="/signup" className="text-sm text-blue-300 hover:text-blue-200 hover:underline flex items-center justify-center">
                <UserPlus className="w-4 h-4 mr-1" />
                Don't have an account? Sign Up
              </Link>
            </div>

            <div className="mt-6">
              <p className="text-sm text-gray-300 text-center mb-3">Demo Accounts (password: password):</p>
              <div className="space-y-2">
                {demoAccounts.map((account, index) => (
                  <motion.button
                    key={account.email}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    onClick={() => {
                      setEmail(account.email);
                      setPassword('password');
                    }}
                    className="w-full p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <account.icon className={`w-4 h-4 ${account.color}`} />
                      <div>
                        <p className="text-sm font-medium text-white">{account.role}</p>
                        <p className="text-xs text-gray-400">{account.email}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginForm;
