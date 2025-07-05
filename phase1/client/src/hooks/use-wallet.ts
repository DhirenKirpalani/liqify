import { useContext } from 'react';
import { useWallet as useWalletAdapter } from '@/components/wallet-provider';

export const useWallet = useWalletAdapter;
