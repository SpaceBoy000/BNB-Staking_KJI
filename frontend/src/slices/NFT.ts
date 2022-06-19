import { ethers } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as ethStakingAbi } from "../abi/ETH_Staking.json";
import { abi as tokenStakingAbi } from "../abi/TOKEN_Staking.json";
import { abi as stakingAbi } from "../abi/Staking.json";
import { abi as FairLaunch } from "../abi/FairLaunch.json";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { clearPendingTxn, fetchPendingTxns } from "./PendingTxnsSlice";
import { error, info } from "../slices/MessagesSlice";
import { IStakeAsyncThunk,  INFTMintAsyncThunk, IJsonRPCError } from "./interfaces";
import { loadAccountDetails } from "./AccountSlice";
import axios from "axios";

interface IRarityTable {
  Balance: string,
  Speed: string,
  Power: string,
  Flash: string,
  Destroyer: string,
  Annihilator: string,
};

const RarityTable = {
  "Balance": "100",
  "Speed": "125",
  "Power": "150",
  "Flash": "175",
  "Destroyer": "200",
  "Annihilator": "300",
} as IRarityTable;

export const approve = createAsyncThunk(
  "nft/approve",
  async ({ tokenKind, provider, address, networkID }: INFTMintAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    console.log("approve-----------");
     
    const signer = provider.getSigner();
    let tokenContract = new ethers.Contract(addresses[networkID].XSYS_ADDRESS as string, ierc20Abi, signer);
    let approveTx;

    try {
      approveTx = await tokenContract.approve(addresses[networkID].TOKEN_STAKING_ADDRESS, ethers.utils.parseEther("10000000000000").toString());
      const text = "nft mint";
      const pendingTxnType = "nft_approbe";
      dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text: pendingTxnType, type: pendingTxnType }));

      await approveTx.wait();
      dispatch(loadAccountDetails({ networkID, address, provider }));
    } catch (e: unknown) {
      const errMsg = (e as IJsonRPCError).message;
      console.log(errMsg);
      dispatch(error("errMsg"));
      return;
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
      }
    }

  },
);

// export const mintNFTWithBNB = createAsyncThunk(
//   "nft/mint",
//   async ({ amount, provider, address, networkID }: INFTMintAsyncThunk, { dispatch }) => {
//     if (!provider) {
//       dispatch(error("Please connect your wallet!"));
//       return;
//     }


//     const signer = provider.getSigner();
//     const nftTokenContract = new ethers.Contract(addresses[networkID].NFT_TOKEN_ADDRESS as string, ethStakingAbi, signer);
//     let approveTx;

//     try {
      
//        approveTx = await nftTokenContract.mint(ethers.utils.parseUnits("1", "wei"), { value: ethers.utils.parseEther("0.0005") });
//       const text = "nft mint";
//       const pendingTxnType = "nft_mint";
//       dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text: pendingTxnType, type: pendingTxnType }));

//       await approveTx.wait();
//       dispatch(info("NFT Mint Successed. Please check your wallet!"));
//       dispatch(loadAccountDetails({ networkID, address, provider }));

//     } catch (e: unknown) {
//       const errMsg = (e as IJsonRPCError).message;
//       console.log(errMsg);
//       dispatch(error("Purchased Failed!"));
//       return;
//     } finally {
//       if (approveTx) {
//         dispatch(clearPendingTxn(approveTx.hash));
//       }
//     }

//   },
// );


// export const mintNFTWithOIM = createAsyncThunk(
//   "nft/mint",
//   async ({ amount, provider, address, networkID }: INFTMintAsyncThunk, { dispatch }) => {
//     if (!provider) {
//       dispatch(error("Please connect your wallet!"));
//       return;
//     }


//     const signer = provider.getSigner();
//     const nftTokenContract = new ethers.Contract(addresses[networkID].NFT_TOKEN_ADDRESS as string, ethStakingAbi, signer);
//     const oimTokenContract = new ethers.Contract(addresses[networkID].OIM_TOKEN_ADDRESS as string, ierc20Abi, signer);
//     let approveTx;

//     try {
//       const balance = await nftTokenContract.balanceOf(address);

//       console.log(balance.toString());
//       if (balance.toString() > 0  ) {
//         dispatch(info("Sorry. You bought a NFT arlready!"));
//         return;
//       }

//       const tokenMinted = await nftTokenContract.tokenMinted();
//       const IPFS_URL = "https://ipfs.moralis.io:2053/ipfs/QmZuKZycur8EELJd7UDuHu3cKMxRskFT1fA2atFRwZuBCS/metadata/" + tokenMinted.toString() + '.json';
//       const res = await axios.get(IPFS_URL);

//       console.log(res);
//       const key = res.data.name as string;
//       const multiplier = RarityTable[key as 'Balance' | 'Speed' | 'Power' | 'Flash' | 'Destroyer' |  'Annihilator'];
//       console.log(multiplier);
//       approveTx = await oimTokenContract.approve(addresses[networkID].NFT_TOKEN_ADDRESS, ethers.utils.parseUnits("1000000000", "ether").toString() );
//       const approveText = "approve";
//       const approvePendingTxnType = "nft_approve";
//       dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text: approveText, type: approvePendingTxnType }));
//       await approveTx.wait();

//       approveTx = await nftTokenContract.mintNFTWithToken(ethers.utils.parseUnits("150000000", "gwei"), ethers.utils.parseUnits(multiplier, "wei"));
//       const text = "nft mint";
//       const pendingTxnType = "nft_mint";
//       dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text: pendingTxnType, type: pendingTxnType }));

//       await approveTx.wait();
//       dispatch(info("NFT Mint Successed. Please check your wallet!"));
//       dispatch(loadAccountDetails({ networkID, address, provider }));

//     } catch (e: unknown) {
//       const errMsg = (e as IJsonRPCError).message;
//       console.log(errMsg);
//       dispatch(error("Purchased Failed!"));
//       return;
//     } finally {
//       if (approveTx) {
//         dispatch(clearPendingTxn(approveTx.hash));
//       }
//     }

//   },
// );

export const stake = createAsyncThunk(
  "nft/stake",
  async ({ tokenKind, tokenAmount, poolId, code, provider, address, networkID }: IStakeAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }
    // addTokenToMetamask();
    console.log("MCB=>Address: ", address);

    const signer = provider.getSigner();
    let stakingContract;
    if (tokenKind == 10) { // BNB
      stakingContract = new ethers.Contract(addresses[networkID].ETH_STAKING_ADDRESS as string, ethStakingAbi, signer);
    } else { // Store
      stakingContract = new ethers.Contract(addresses[networkID].TOKEN_STAKING_ADDRESS as string, tokenStakingAbi, signer);
    }
     

    let stakeTx;
    try {
      const text = "nft stake";
      const pendingTxnType = "nft_stake";
      // stakeTx = await stakingContract.approves(addresses[networkID].STAKING_ADDRESS, tokenList);
      // dispatch(fetchPendingTxns({ txnHash: stakeTx.hash, text: pendingTxnType, type: pendingTxnType }));
      // await stakeTx.wait();
      if (tokenKind == 10) {
        stakeTx = await stakingContract.deposit(poolId, code, {value: ethers.utils.parseEther(tokenAmount.toString())});
      } else{
        stakeTx = await stakingContract.deposit(poolId, code, ethers.utils.parseEther(tokenAmount.toString()));
      }
      await stakeTx.wait();
      dispatch(loadAccountDetails({ networkID, address, provider }));
    } catch (e: unknown) {
      const errMsg = (e as IJsonRPCError).message;
      console.log(errMsg);
      dispatch(error("errMsg"));
      return;
    } finally {
      if (stakeTx) {
        // dispatch(clearPendingTxn(stakeTx.hash));
      }
    }
  },
);

export const unstake = createAsyncThunk(
  "nft/unstake",
  async ({ tokenKind, tokenAmount, poolId, provider, address, networkID }: IStakeAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      
      return;
    }

    console.log("[MCB] => withdraw");
    const signer = provider.getSigner();
    let stakingContract;
    if (tokenKind == 10) { // BNB
      stakingContract = new ethers.Contract(addresses[networkID].ETH_STAKING_ADDRESS as string, ethStakingAbi, signer);
    } else { // Store
      stakingContract = new ethers.Contract(addresses[networkID].TOKEN_STAKING_ADDRESS as string, tokenStakingAbi, signer);
    }
    let withdrawTx;

    try {
      const text = "unstake";
      const pendingTxnType = "token_unstake";
      withdrawTx = await stakingContract.withdraw(poolId, true);
      await withdrawTx.wait();
      dispatch(loadAccountDetails({ networkID, address, provider }));
    } catch (e: unknown) {
      const errMsg = (e as IJsonRPCError).message;
      console.log(errMsg);
      dispatch(error(errMsg));
      return;
    } finally {
      if (withdrawTx) {
        // dispatch(clearPendingTxn(withdrawTx.hash));
      }
    }
  },
);

// export const emergencyWithdrawal = createAsyncThunk(
//   "nft/emergencyWithdrawal",
//   async ({ tokenList, provider, address, networkID }: IStakeAsyncThunk, { dispatch }) => {
//     if (!provider) {
//       dispatch(error("Please connect your wallet!"));
//       return;
//     }

//     if (tokenList.length < 1) {
//       dispatch(error("Please select NFTs to emergency withdrawal!"));
//       return;
//     }

//     const signer = provider.getSigner();
//     // const nftTokenContract = new ethers.Contract(addresses[networkID].NFT_TOKEN_ADDRESS as string, ethStakingAbi, signer);
//     const stakingContract = new ethers.Contract(addresses[networkID].STAKING_ADDRESS as string, stakingAbi, signer);
//     let approveTx;

//     try {
//       const text = "nft emergencyWithdrawal";
//       const pendingTxnType = "nft_emergencyWithdrawal";
//       // approveTx = await nftTokenContract.approves(addresses[networkID].STAKING_ADDRESS, tokenList);
//       // dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text: pendingTxnType, type: pendingTxnType }));
//       // await approveTx.wait();
//       approveTx = await stakingContract.emergencyWithdraw(tokenList);
//       await approveTx.wait();
//       dispatch(loadAccountDetails({ networkID, address, provider }));
//     } catch (e: unknown) {
//       const errMsg = (e as IJsonRPCError).message;
//       console.log(errMsg);
//       dispatch(error("errMsg"));
//       return;
//     } finally {
//       if (approveTx) {
//         dispatch(clearPendingTxn(approveTx.hash));
//       }
//     }
//   },
// );

const addTokenToMetamask = async () => {
  const tokenAddress = '0x72DD644E872dA96394b785AedA20CB4094A05ae8';
  const tokenSymbol = 'LIC';
  const tokenDecimals = 18;
  const tokenImage = 'https://i.ibb.co/0sh1W0Y/LIC.png'; // 'http://placekitten.com/200/300';
  // const tokenImage = "https://raw.githubusercontent.com/SpaceBoy000/token/blob/master/LIC.png"; // `https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/logos/0x9d77cceEBDA1De9A6E8517B4b057c1c2F89C8444/logo.png`;

  console.log("ADD token to metamask---------");
  try {
    // wasAdded is a boolean. Like any RPC method, an error may be thrown.
    const wasAdded = await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20', // Initially only supports ERC20, but eventually more!
        options: {
          address: tokenAddress, // The address that the token is at.
          symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
          decimals: tokenDecimals, // The number of decimals in the token
          image: tokenImage, // A string url of the token logo
        },
      },
    });

    if (wasAdded) {
      console.log('Thanks for your interest!');
    } else {
      console.log('Your loss!');
    }
  } catch (error) {
    console.log(error);
  }
}
