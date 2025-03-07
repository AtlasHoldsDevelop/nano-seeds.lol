import React, { useState, useEffect } from "react";

const Account = ({ address, index, onLoaded, onBalance, onBlocks }) => {
  const [state, setState] = useState({
    loading: true,
    balance: 0,
    blocks: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Using NanoDB.cc API (current Nano API service)
        const resp = await fetch(
          `https://api.nanodb.cc/v1/accounts/${address}`
        );
        
        if (!resp.ok) {
          setState({
            loading: false,
            balance: 0,
            blocks: 0
          });
          updateParent(0, 0);
          return;
        }
        
        const data = await resp.json();
        
        // Process data from the current API structure
        const balance = parseFloat(data.balance || 0) + parseFloat(data.pending || 0);
        const blocks = parseInt(data.block_count || 0);
        
        setState({
          loading: false,
          balance,
          blocks
        });
        
        updateParent(balance, blocks);
      } catch (error) {
        console.error("Error fetching Nano account data:", error);
        setState({
          loading: false,
          balance: 0,
          blocks: 0
        });
        updateParent(0, 0);
      }
    };

    fetchData();
  }, [address]);

  const updateParent = (balance, blocks) => {
    onLoaded && onLoaded();
    if (balance > 0) return onBalance && onBalance();
    if (blocks > 0) return onBlocks && onBlocks();
  };

  return (
    <div className="col-md-6">
      <p className="mb-0">
        <small>Address {index}</small>
      </p>
      <p className="text-monospace" style={{ wordWrap: "break-word" }}>
        <a
          href={`https://nanolooker.com/account/${address}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {address}
        </a>
      </p>
      <p>
        {state.balance} XNO ({state.blocks} blocks)
      </p>
    </div>
  );
};

export default Account;
