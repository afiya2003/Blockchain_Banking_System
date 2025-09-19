import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { KeyRound, User, Mail, Shield, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';

const SecurityPage = () => {
  const { user, updateUser, updatePassword } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    const result = await updateUser({ name });
    if (result.success) {
      toast({
        title: "Profile Updated",
        description: "Your name has been successfully updated.",
      });
    }
    setIsUpdatingProfile(false);
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirmation do not match.",
        variant: "destructive",
      });
      return;
    }
    if (!newPassword) {
        toast({
            title: "Password Required",
            description: "New password cannot be empty.",
            variant: "destructive",
        });
        return;
    }
    setIsUpdatingPassword(true);
    const result = await updatePassword(currentPassword, newPassword);
    if (result.success) {
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
    setIsUpdatingPassword(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Helmet>
        <title>Security - BlockBank</title>
        <meta name="description" content="Manage your account security settings, update your profile, and change your password." />
      </Helmet>

      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Security & Profile</h1>
            <p className="text-gray-400">Manage your account settings and personal information</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card className="glass-effect border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center"><User className="mr-2"/> Profile Information</CardTitle>
                  <CardDescription>Update your personal details.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <Input id="email" type="email" value={user?.email || ''} className="pl-10 bg-gray-800/30 border-gray-600 text-gray-400" readOnly />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="pl-10 bg-gray-800/50 border-gray-600 text-white" />
                      </div>
                    </div>
                    <Button type="submit" disabled={isUpdatingProfile} className="w-full bg-gradient-to-r from-blue-500 to-purple-600">
                      {isUpdatingProfile ? 'Updating...' : 'Update Profile'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <Card className="glass-effect border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center"><KeyRound className="mr-2"/> Change Password</CardTitle>
                  <CardDescription>For your security, we recommend choosing a strong password.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordUpdate} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input id="currentPassword" type={showCurrent ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="pl-10 pr-10 bg-gray-800/50 border-gray-600 text-white" required />
                        <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"><Eye className="w-5 h-5"/></button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input id="newPassword" type={showNew ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="pl-10 pr-10 bg-gray-800/50 border-gray-600 text-white" required />
                        <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"><Eye className="w-5 h-5"/></button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input id="confirmPassword" type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pl-10 pr-10 bg-gray-800/50 border-gray-600 text-white" required />
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"><Eye className="w-5 h-5"/></button>
                      </div>
                    </div>
                    <Button type="submit" disabled={isUpdatingPassword} className="w-full bg-gradient-to-r from-blue-500 to-purple-600">
                      {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SecurityPage;