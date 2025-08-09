// src/contexts/WalletContext.tsx
import React, { createContext, useContext, useState } from "react";

interface WalletContextType {
  address: string;
  isConnected: boolean;
  connectWallet: (address: string) => void;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [address, setAddress] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = (addr: string) => {
    setAddress(addr);
    setIsConnected(true);
  };

  const disconnectWallet = () => {
    setAddress("");
    setIsConnected(false);
  };

  return (
    <WalletContext.Provider
      value={{ address, isConnected, connectWallet, disconnectWallet }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error("useWallet must be used within WalletProvider");
  return context;
};
