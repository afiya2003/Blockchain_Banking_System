import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { 
  Shield, 
  Link as LinkIcon, 
  Hash, 
  Clock, 
  Database,
  CheckCircle,
  AlertCircle,
  Cpu,
  Package
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBlockchain } from '@/contexts/BlockchainContext';
import Navbar from '@/components/Navbar';

const BlockchainPage = () => {
  const { blockchain, getBlockchainStats } = useBlockchain();
  const stats = getBlockchainStats();
  const reversedChain = blockchain ? [...blockchain.chain].reverse() : [];
  const blockRefs = useRef([]);

  useEffect(() => {
    blockRefs.current = blockRefs.current.slice(0, reversedChain.length);
  }, [reversedChain.length]);

  const formatDate = (timestamp) => {
    if (typeof timestamp === 'string' && timestamp.includes('/')) {
      return timestamp; // Genesis block
    }
    return new Date(timestamp).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateHash = (hash) => {
    if (!hash) return 'N/A';
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 10)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Helmet>
        <title>Blockchain Explorer - BlockBank</title>
        <meta name="description" content="Explore the blockchain powering BlockBank. View blocks, transactions, and network statistics." />
      </Helmet>

      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Blockchain Explorer</h1>
            <p className="text-gray-400">Explore the distributed ledger powering BlockBank</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="glass-effect border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Total Blocks</CardTitle>
                  <Package className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.totalBlocks}</div>
                  <p className="text-xs text-gray-400">Blocks mined</p>
                </CardContent>
            </Card>
            <Card className="glass-effect border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Total Transactions</CardTitle>
                  <LinkIcon className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.totalTransactions}</div>
                  <p className="text-xs text-gray-400">Confirmed transactions</p>
                </CardContent>
            </Card>
            <Card className="glass-effect border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Chain Status</CardTitle>
                  {stats.isValid ? <CheckCircle className="h-4 w-4 text-green-400" /> : <AlertCircle className="h-4 w-4 text-red-400" />}
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${stats.isValid ? 'text-green-400' : 'text-red-400'}`}>{stats.isValid ? 'Valid' : 'Invalid'}</div>
                  <p className="text-xs text-gray-400">Blockchain integrity</p>
                </CardContent>
            </Card>
            <Card className="glass-effect border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Mining Difficulty</CardTitle>
                  <Cpu className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{blockchain?.difficulty || 2}</div>
                  <p className="text-xs text-gray-400">Proof-of-Work target</p>
                </CardContent>
            </Card>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="space-y-8">
              {reversedChain.map((block, index) => (
                <div key={block.hash} className="relative">
                  <motion.div
                    ref={el => blockRefs.current[index] = el}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="transaction-card rounded-xl p-6 relative z-10"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
                      <div>
                        <div className="flex items-center mb-4">
                          <div className={`w-12 h-12 ${block.index === 0 ? 'bg-purple-500/20' : 'bg-blue-500/20'} rounded-full flex items-center justify-center mr-4`}>
                            <Package className={`w-6 h-6 ${block.index === 0 ? 'text-purple-400' : 'text-blue-400'}`} />
                          </div>
                          <div>
                            <h3 className="text-white font-semibold text-xl">Block #{block.index}</h3>
                            <p className="text-gray-400 text-sm flex items-center"><Clock className="w-3 h-3 mr-1.5"/> {formatDate(block.timestamp)}</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <Hash className="w-4 h-4 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-gray-400 text-xs">Block Hash</p>
                              <p className="text-white font-mono text-sm break-all">{block.hash}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <LinkIcon className="w-4 h-4 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-gray-400 text-xs">Previous Hash</p>
                              <p className="text-white font-mono text-sm break-all">{block.previousHash}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="border-t border-gray-700 lg:border-t-0 lg:border-l lg:pl-8 pt-4 lg:pt-0">
                        <div className="flex items-center mb-4">
                          <Database className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-gray-300 text-sm font-medium">Block Data</span>
                        </div>
                        {Array.isArray(block.data) && block.data.length > 0 ? (
                          <div className="space-y-3">
                            <p className="text-green-400 text-sm font-medium">{block.data.length} Transaction(s)</p>
                            <div className="max-h-24 overflow-y-auto pr-2">
                                {block.data.map((tx, txIndex) => (
                                  <div key={txIndex} className="bg-gray-800/50 rounded p-2 mb-2 text-xs">
                                    <p className="text-white">From: <span className="text-gray-400 font-mono">{truncateHash(tx.fromAddress)}</span></p>
                                    <p className="text-white">To: <span className="text-gray-400 font-mono">{truncateHash(tx.toAddress)}</span></p>
                                    <p className="text-blue-400 font-bold">Amount: ₹{tx.amount}</p>
                                  </div>
                                ))}
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gray-800/50 rounded p-3 h-full flex items-center justify-center">
                            <p className="text-gray-400 text-sm">{block.index === 0 ? 'Genesis Block' : 'No transactions in this block'}</p>
                          </div>
                        )}
                        <div className="mt-4 pt-3 border-t border-gray-700">
                          <p className="text-xs text-gray-400">Nonce: <span className="text-white font-mono">{block.nonce}</span></p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  {index < reversedChain.length - 1 && (
                     <div className="absolute left-1/2 -translate-x-1/2 top-full w-1 h-8 bg-gradient-to-b from-blue-500/50 to-blue-500/0 z-0"></div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default BlockchainPage;