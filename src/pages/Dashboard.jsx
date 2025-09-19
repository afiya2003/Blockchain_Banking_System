import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { 
  Send, 
  TrendingUp, 
  Shield, 
  Activity,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useBlockchain } from '@/contexts/BlockchainContext';
import Navbar from '@/components/Navbar';
import TransferModal from '@/components/TransferModal';

const Dashboard = () => {
  const { user } = useAuth();
  const { transactions, getBlockchainStats } = useBlockchain();
  const [showTransferModal, setShowTransferModal] = useState(false);
  
  const stats = getBlockchainStats();
  const recentTransactions = transactions.slice(0, 5);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Helmet>
        <title>Dashboard - BlockBank</title>
        <meta name="description" content="Manage your blockchain banking account. View balance, transactions, and blockchain statistics." />
      </Helmet>

      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-gray-400">
              Manage your blockchain-powered banking experience
            </p>
          </div>

          {/* Balance Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card className="balance-card border-0 text-white overflow-hidden">
              <CardContent className="p-8 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium mb-2">Total Balance</p>
                    <h2 className="text-4xl font-bold mb-4">
                      {formatCurrency(user?.balance || 0)}
                    </h2>
                    <div className="flex items-center space-x-4">
                      <Button
                        onClick={() => setShowTransferModal(true)}
                        className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                        size="sm"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send Money
                      </Button>
                      <div className="flex items-center text-green-300 text-sm">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        Secured by Blockchain
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-4xl font-bold">₹</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass-effect border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">
                    Total Transactions
                  </CardTitle>
                  <Activity className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{transactions.length}</div>
                  <p className="text-xs text-gray-400">
                    Secured on blockchain
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="glass-effect border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">
                    Blockchain Blocks
                  </CardTitle>
                  <Shield className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.totalBlocks}</div>
                  <p className="text-xs text-gray-400">
                    {stats.isValid ? 'Chain Valid ✓' : 'Chain Invalid ✗'}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="glass-effect border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">
                    Account Status
                  </CardTitle>
                  <CreditCard className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">Active</div>
                  <p className="text-xs text-gray-400">
                    Fully verified account
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="glass-effect border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  Recent Transactions
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    onClick={() => window.location.href = '/transactions'}
                  >
                    View All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentTransactions.length > 0 ? (
                  <div className="space-y-4">
                    {recentTransactions.map((transaction) => (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="transaction-card rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              transaction.fromAddress === user?.email 
                                ? 'bg-red-500/20 text-red-400' 
                                : 'bg-green-500/20 text-green-400'
                            }`}>
                              {transaction.fromAddress === user?.email ? (
                                <ArrowUpRight className="w-5 h-5" />
                              ) : (
                                <ArrowDownLeft className="w-5 h-5" />
                              )}
                            </div>
                            <div>
                              <p className="text-white font-medium">
                                {transaction.fromAddress === user?.email ? 'Sent to' : 'Received from'}
                              </p>
                              <p className="text-gray-400 text-sm">
                                {transaction.fromAddress === user?.email 
                                  ? transaction.toAddress 
                                  : transaction.fromAddress}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${
                              transaction.fromAddress === user?.email 
                                ? 'text-red-400' 
                                : 'text-green-400'
                            }`}>
                              {transaction.fromAddress === user?.email ? '-' : '+'}
                              {formatCurrency(transaction.amount)}
                            </p>
                            <p className="text-gray-400 text-sm">
                              {formatDate(transaction.timestamp)}
                            </p>
                          </div>
                        </div>
                        {transaction.description && (
                          <p className="text-gray-400 text-sm mt-2 ml-13">
                            {transaction.description}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No transactions yet</p>
                    <p className="text-gray-500 text-sm">Start by sending money to someone</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      <TransferModal 
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
      />
    </div>
  );
};

export default Dashboard;