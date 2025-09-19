import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useBlockchain } from '@/contexts/BlockchainContext';
import Navbar from '@/components/Navbar';
import TransferModal from '@/components/TransferModal';

const TransactionsPage = () => {
  const { user } = useAuth();
  const { transactions } = useBlockchain();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showTransferModal, setShowTransferModal] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.toAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.fromAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.description && transaction.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = 
      filterType === 'all' ||
      (filterType === 'sent' && transaction.fromAddress === user?.email) ||
      (filterType === 'received' && transaction.toAddress === user?.email);

    return matchesSearch && matchesFilter;
  });

  const totalSent = transactions
    .filter(t => t.fromAddress === user?.email)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalReceived = transactions
    .filter(t => t.toAddress === user?.email)
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Helmet>
        <title>Transactions - BlockBank</title>
        <meta name="description" content="View and manage all your blockchain transactions. Track your sending and receiving history." />
      </Helmet>

      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Transaction History</h1>
              <p className="text-gray-400">Track all your blockchain transactions</p>
            </div>
            <Button
              onClick={() => setShowTransferModal(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Send Money
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="glass-effect border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">
                    Total Transactions
                  </CardTitle>
                  <span className="text-blue-400 font-bold">#</span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{transactions.length}</div>
                  <p className="text-xs text-gray-400">All time</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass-effect border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">
                    Total Sent
                  </CardTitle>
                  <ArrowUpRight className="h-4 w-4 text-red-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-400">{formatCurrency(totalSent)}</div>
                  <p className="text-xs text-gray-400">Outgoing transfers</p>
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
                    Total Received
                  </CardTitle>
                  <ArrowDownLeft className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">{formatCurrency(totalReceived)}</div>
                  <p className="text-xs text-gray-400">Incoming transfers</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <Card className="glass-effect border-gray-700">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={filterType === 'all' ? 'default' : 'outline'}
                      onClick={() => setFilterType('all')}
                      size="sm"
                      className={filterType === 'all' ? 'bg-blue-600' : 'border-gray-600 text-gray-300'}
                    >
                      All
                    </Button>
                    <Button
                      variant={filterType === 'sent' ? 'default' : 'outline'}
                      onClick={() => setFilterType('sent')}
                      size="sm"
                      className={filterType === 'sent' ? 'bg-red-600' : 'border-gray-600 text-gray-300'}
                    >
                      Sent
                    </Button>
                    <Button
                      variant={filterType === 'received' ? 'default' : 'outline'}
                      onClick={() => setFilterType('received')}
                      size="sm"
                      className={filterType === 'received' ? 'bg-green-600' : 'border-gray-600 text-gray-300'}
                    >
                      Received
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Transactions List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="glass-effect border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Transactions ({filteredTransactions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredTransactions.length > 0 ? (
                  <div className="space-y-4">
                    {filteredTransactions.map((transaction, index) => (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="transaction-card rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              transaction.fromAddress === user?.email 
                                ? 'bg-red-500/20 text-red-400' 
                                : 'bg-green-500/20 text-green-400'
                            }`}>
                              {transaction.fromAddress === user?.email ? (
                                <ArrowUpRight className="w-6 h-6" />
                              ) : (
                                <ArrowDownLeft className="w-6 h-6" />
                              )}
                            </div>
                            <div>
                              <p className="text-white font-medium text-lg">
                                {transaction.fromAddress === user?.email ? 'Sent to' : 'Received from'}
                              </p>
                              <p className="text-gray-400">
                                {transaction.fromAddress === user?.email 
                                  ? transaction.toAddress 
                                  : transaction.fromAddress}
                              </p>
                              {transaction.description && (
                                <p className="text-gray-500 text-sm mt-1">
                                  {transaction.description}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold text-xl ${
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
                            <div className="flex items-center mt-1 justify-end">
                              <div className={`w-2 h-2 rounded-full mr-2 ${
                                transaction.status === 'completed' ? 'bg-green-400' : 'bg-yellow-400'
                              }`}></div>
                              <span className="text-xs text-gray-400 capitalize">
                                {transaction.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">No transactions found</p>
                    <p className="text-gray-500">Try adjusting your search or filters</p>
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

export default TransactionsPage;