
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { cryptoOptions, CryptoOption } from '@/components/crypto/CryptoSelector';

interface CryptoContextType {
  selectedCrypto: CryptoOption;
  setSelectedCrypto: (crypto: CryptoOption) => void;
  availableCryptos: CryptoOption[];
}

export const CryptoContext = createContext<CryptoContextType | undefined>(undefined);

interface CryptoProviderProps {
  children: ReactNode;
}

export const CryptoProvider: React.FC<CryptoProviderProps> = ({ children }) => {
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoOption>(cryptoOptions[0]); // Default to BTC
  
  return (
    <CryptoContext.Provider
      value={{
        selectedCrypto,
        setSelectedCrypto,
        availableCryptos: cryptoOptions
      }}
    >
      {children}
    </CryptoContext.Provider>
  );
};
