import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import SHA256 from 'crypto-js/sha256';

const BlockchainContext = createContext();

export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (!context) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
};

// Simple blockchain implementation
class Block {
  constructor(index, timestamp, data, previousHash) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
      this.index + 
      this.previousHash + 
      this.timestamp + 
      JSON.stringify(this.data) + 
      this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    const target = Array(difficulty + 1).join("0");
    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
  }

  createGenesisBlock() {
    return new Block(0, "01/01/2024", "Genesis block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  minePendingTransactions() {
    const block = new Block(
      this.chain.length,
      Date.now(),
      this.pendingTransactions,
      this.getLatestBlock().hash
    );

    block.mineBlock(this.difficulty);
    this.chain.push(block);
    this.pendingTransactions = [];
    return block;
  }

  getBalance(address) {
    let balance = 0;
    for (const block of this.chain) {
      if (Array.isArray(block.data)) {
        for (const trans of block.data) {
          if (trans.fromAddress === address) {
            balance -= trans.amount;
          }
          if (trans.toAddress === address) {
            balance += trans.amount;
          }
        }
      }
    }
    return balance;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

export const BlockchainProvider = ({ children }) => {
  const { user, updateBalance } = useAuth();
  const [blockchain, setBlockchain] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Initialize blockchain
    const savedChain = localStorage.getItem('blockbank_blockchain');
    let bc;
    if (savedChain) {
      try {
        const chainData = JSON.parse(savedChain);
        bc = new Blockchain();
        bc.chain = chainData.chain.map(blockData => {
            const block = new Block(blockData.index, blockData.timestamp, blockData.data, blockData.previousHash);
            block.hash = blockData.hash;
            block.nonce = blockData.nonce;
            return block;
        });
        bc.pendingTransactions = chainData.pendingTransactions || [];
      } catch (e) {
        bc = new Blockchain();
      }
    } else {
      bc = new Blockchain();
    }
    setBlockchain(bc);
    localStorage.setItem('blockbank_blockchain', JSON.stringify({
      chain: bc.chain,
      pendingTransactions: bc.pendingTransactions
    }));

    // Load transactions
    const savedTransactions = localStorage.getItem('blockbank_transactions');
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, []);

  const saveBlockchain = (bc) => {
    localStorage.setItem('blockbank_blockchain', JSON.stringify({
      chain: bc.chain,
      pendingTransactions: bc.pendingTransactions
    }));
  };

  const saveTransactions = (trans) => {
    localStorage.setItem('blockbank_transactions', JSON.stringify(trans));
  };

  const createTransaction = async (toAddress, amount, description) => {
    if (!user || !blockchain) return { success: false, error: 'Not authenticated' };

    if (amount <= 0) {
      return { success: false, error: 'Amount must be greater than 0' };
    }

    if (user.balance < amount) {
      return { success: false, error: 'Insufficient balance' };
    }

    setIsProcessing(true);
    toast({
      title: "Mining Transaction...",
      description: "Adding your transaction to the blockchain. This may take a moment.",
    });

    // Simulate mining delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const transaction = {
        id: Date.now().toString(),
        fromAddress: user.email,
        toAddress,
        amount,
        description,
        timestamp: new Date().toISOString(),
        status: 'pending'
      };

      // Add to pending transactions
      blockchain.addTransaction(transaction);
      
      // Mine the block
      const newBlock = blockchain.minePendingTransactions();
      
      // Update blockchain
      setBlockchain(blockchain);
      saveBlockchain(blockchain);

      // Update transactions list
      const updatedTransaction = { ...transaction, status: 'completed', blockHash: newBlock.hash };
      const newTransactions = [...transactions, updatedTransaction];
      setTransactions(newTransactions);
      saveTransactions(newTransactions);

      // Update user balance
      const newBalance = user.balance - amount;
      updateBalance(newBalance);

      toast({
        title: "Transaction Successful!",
        description: `Successfully sent ₹${amount} to ${toAddress}. Block #${newBlock.index} mined.`,
      });

      setIsProcessing(false);
      return { success: true, transaction: updatedTransaction };
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "Transaction Failed",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const getUserTransactions = () => {
    if (!user) return [];
    return transactions.filter(t => 
      t.fromAddress === user.email || t.toAddress === user.email
    ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const getBlockchainStats = () => {
    if (!blockchain) return { totalBlocks: 0, totalTransactions: 0, isValid: false };
    
    let totalTransactions = 0;
    blockchain.chain.forEach(block => {
      if (Array.isArray(block.data)) {
        totalTransactions += block.data.length;
      }
    });

    return {
      totalBlocks: blockchain.chain.length,
      totalTransactions,
      isValid: blockchain.isChainValid()
    };
  };

  const value = {
    blockchain,
    transactions: getUserTransactions(),
    createTransaction,
    isProcessing,
    getBlockchainStats
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
};