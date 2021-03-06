import { useCallback, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import useBasisGold from './useBasisGold';
import { ContractName } from '../basis-gold';
import config from '../config';

const useEarnings = (poolName: ContractName) => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const basisGold = useBasisGold();

  const fetchBalance = useCallback(async () => {
    const balance = await basisGold.earnedFromBank(poolName, basisGold.myAccount);
    setBalance(balance);
  }, [basisGold?.isUnlocked, poolName]);

  useEffect(() => {
    if (basisGold?.isUnlocked) {
      fetchBalance().catch((err) => console.error(err.stack));

      const refreshBalance = setInterval(fetchBalance, config.refreshInterval);
      return () => clearInterval(refreshBalance);
    }
  }, [basisGold?.isUnlocked, poolName, basisGold]);

  return balance;
};

export default useEarnings;
