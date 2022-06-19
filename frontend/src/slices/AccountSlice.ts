import { ethers } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as nftTokenAbi } from "../abi/NFTToken.json";
import { abi as stakingAbi } from "../abi/Staking.json";
import { abi as ethStakingAbi } from "../abi/ETH_Staking.json";
import { abi as tokenStakingAbi } from "../abi/TOKEN_Staking.json";

// import IDOAbi from '../abi/ido.json'
// import { BigNumber } from 'bignumber.js';

import { setAll } from "../helpers";

import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
// import { Bond, NetworkID } from "src/lib/Bond"; // TODO: this type definition needs to move out of BOND.
import { RootState } from "src/store";
import { IBaseAddressAsyncThunk, IBasePoolAsyncThunk, ICalcUserBondDetailsAsyncThunk } from "./interfaces";

export const loadAccountDetails = createAsyncThunk(
  "account/loadAccountDetails",
  async ({ networkID, provider, address }: IBaseAddressAsyncThunk) => {

    const signer = provider.getSigner();
    const BNB_StakingContract = new ethers.Contract(addresses[networkID].ETH_STAKING_ADDRESS as string, ethStakingAbi, signer);
    const TOKEN_StakingContract = new ethers.Contract(addresses[networkID].TOKEN_STAKING_ADDRESS as string, tokenStakingAbi, signer);
    const tokenContract = new ethers.Contract(addresses[networkID].XSYS_ADDRESS as string, ierc20Abi, provider);

    const tokenAmount = await tokenContract.balanceOf(address);
    const bnbAmount = await provider.getBalance(address);
    const stakeAllowanced = await tokenContract.allowance(address, addresses[networkID].TOKEN_STAKING_ADDRESS);
    console.log("aaaaa: ", stakeAllowanced.toString())
    let bnbStakedAmounts = [], tokenStakedAmounts = [], bnbRewards = [], tokenRewards = [], bnbDepositTimes = [], tokenDepositTimes = [], withdrawLockDays = [];
    let canHarvestTOKEN = [], canHarvestBNB = [];
    for (let i = 0; i < 2; i++) {
      const bnbStakedAmount = await BNB_StakingContract.userInfo(i, address);
      const tokenStakedAmount = await TOKEN_StakingContract.userInfo(i, address);
      const poolInfo = await BNB_StakingContract.poolInfo(i);
      const pendingToken_BNBPool = await BNB_StakingContract.pendingToken(i, address);
      const pendingToken_TOKENPool = await TOKEN_StakingContract.pendingToken(i, address);
      const canBNB = await BNB_StakingContract.canHarvest(i, address);
      const canTOKEN = await TOKEN_StakingContract.canHarvest(i, address);
      bnbStakedAmounts.push(ethers.utils.formatEther(bnbStakedAmount.amount));
      tokenStakedAmounts.push(ethers.utils.formatEther(tokenStakedAmount.amount));
      bnbDepositTimes.push(bnbStakedAmount.lastDepositTime);
      tokenDepositTimes.push(tokenStakedAmount.lastDepositTime);
      withdrawLockDays.push(poolInfo.withdrawLockPeriod);
      bnbRewards.push(ethers.utils.formatEther(pendingToken_BNBPool[0]));
      tokenRewards.push(ethers.utils.formatEther(pendingToken_TOKENPool[0]));
      canHarvestBNB.push(canBNB);
      canHarvestTOKEN.push(canTOKEN);
    }

    return {
      userInfo: {
        bnbStakedAmounts: bnbStakedAmounts,
        tokenStakedAmounts: tokenStakedAmounts,
        bnbRewards: bnbRewards,
        tokenRewards: tokenRewards,
        bnbDepositTimes: bnbDepositTimes,
        tokenDepositTimes: tokenDepositTimes,
        withdrawLockDays: withdrawLockDays,
        bnbAmount: bnbAmount,
        tokenAmount: tokenAmount,
        stakeAllowanced: stakeAllowanced,
        canHarvestBNB: canHarvestBNB,
        canHarvestTOKEN: canHarvestTOKEN
      },
    };
  },
);

export interface IUserBondDetails {
  allowance: number;
  interestDue: number;
  bondMaturationBlock: number;
  pendingPayout: string; //Payout formatted in gwei.
}

interface IAccountSlice {
  bonds: { [key: string]: IUserBondDetails };
  balances: {
    ohm: string;
    sohm: string;
    dai: string;
    oldsohm: string;
  };
  loading: boolean;
}
const initialState: IAccountSlice = {
  loading: false,
  bonds: {},
  balances: { ohm: "", sohm: "", dai: "", oldsohm: "" },
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    fetchAccountSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAccountDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAccountDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAccountDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
  },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
