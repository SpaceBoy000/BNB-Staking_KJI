import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";
import { useWeb3Context } from "../../hooks";
import { Paper, Grid, Typography, Box, Zoom, Container, OutlinedInput, useMediaQuery, Button, Checkbox } from "@material-ui/core";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { FormControl, RadioGroup, FormControlLabel, Radio } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { useSelector } from "react-redux";
import { trim, formatCurrency, prettyVestingPeriod2 } from "../../helpers";
import { stake, unstake, approve } from "../../slices/NFT";
import CardHeader from "../../components/CardHeader/CardHeader";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { useTheme } from "@material-ui/core/styles";
import axios from 'axios';
import { error, info } from "../../slices/MessagesSlice";
import "./stake.scss";

function StakeCard({card, coupon}) {
  console.log("StakeCardCoupon: ", coupon);
  const [data, setData] = useState(null);
  const [apy, setApy] = useState(null);
  const [runway, setRunway] = useState(null);
  const theme = useTheme();
  const smallerScreen = useMediaQuery("(max-width: 650px)");
  const verySmallScreen = useMediaQuery("(max-width: 379px)");
  const dispatch = useDispatch();
  const { connect, address, provider, chainID, connected, hasCachedProvider } = useWeb3Context();
  // const staked = useSelector(state => {
  //   return state.app.Staked;
  // });
  const userInfo = useSelector(state => {
    return state.account.userInfo;
  });

  const [stakedAmount, setStakedAmount] = useState('');
  const [depositTime, setDepositTime] = useState(0);
  const [withdrawLockDay, setwithdrawLockDay] = useState(0);
  const [pendingReward, setPendingReward] = useState(0);
  console.log("UserInfo: ", userInfo);

  const [tokenKind, setTokenKind] = useState(10);

  const [tokenPrice, setTokenPrice] = useState(0);
  const [busdAmount, setBUSDAmount] = useState(0);
  const [tokenAmount, setTokenAmount] = useState(0);

  useEffect (() => {
    if (!userInfo) return;
    console.log("[MCB]", tokenKind, ":",card.id);

    if (tokenKind == 10) {
      setStakedAmount(userInfo.bnbStakedAmounts[card.id]);
      setDepositTime(userInfo.bnbDepositTimes[card.id]);
      setPendingReward(userInfo.bnbRewards[card.id]);
    } else {
      setStakedAmount(userInfo.tokenStakedAmounts[card.id]);
      setDepositTime(userInfo.tokenDepositTimes[card.id]);
      setPendingReward(userInfo.tokenRewards[card.id]);
    }
    setwithdrawLockDay(userInfo.withdrawLockDays[card.id]);

    console.log("[MCB]=>depositTime: ", depositTime.toString());
    console.log("[MCB]=>withdrawTime: ", withdrawLockDay.toString());
  }, [userInfo, tokenKind]); 



  const getPrice = async (_flag = false) => {
    let tokenAddress;
    tokenAddress = tokenKind == 10 ? "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c" : "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82";

    const url = 'https://deep-index.moralis.io/api/v2/erc20/' + tokenAddress + '/price?chain=bsc';
    const res = await axios.get(url,
    {
      headers: {
        "X-API-Key": "YEEwMh0B4VRg6Hu5gFQcKxqinJ7UizRza1JpbkyMgNTfj4jUkSaZVajOxLNabvnt"
      }
    });

    const price = res.data.usdPrice;
    setTokenPrice(price);
    if (_flag) {
      setTokenAmount(250/price);
      setBUSDAmount(250);
    }
    // setBUSDAmount(price * _tokenAmount);
    // console.log('[Token Amount] = ', _tokenAmount)
    return price;
  }
  const [intervalId, setInvervalId] = useState();

  const handleTokenAmount = async (value) => {
    setTokenAmount(value);

    clearInterval(intervalId);
    const _intervalId = setInterval(() => getPrice(), 2000);
    setInvervalId(_intervalId);

    setBUSDAmount(tokenPrice * value);
  }

  const onChangeTokenKind = async (value) => {
    setTokenKind(value);
    // const price = await getPrice();
    // console.log("onChangeTokenKind: ", price, "amount: ", tokenAmount);
    // setBUSDAmount(price * tokenAmount);
  }

  useEffect(() => {
    clearInterval(intervalId);
    const _intervalId = setInterval(() => getPrice(true), 2000);
    setInvervalId(_intervalId);
    if (tokenPrice != 0) {
      // const amount = 250 / tokenPrice;
      // setTokenAmount(amount);
      setBUSDAmount(250);
    }
  }, [tokenKind]);

  const hasAllowance = useCallback(
    () => {
      if (tokenKind == 10) {
        return true;
      } else return userInfo?.stakeAllowanced > 0
    }
    ,
    [tokenKind, userInfo]
  )

  const canHarvest = useCallback (
    () => {
      if (!userInfo) return false;

      if (tokenKind == 10) {
        return userInfo.canHarvestBNB[card.id] && (userInfo.bnbRewards[card.id] > 0);
      } else {
        return userInfo.canHarvestTOKEN[card.id] && (userInfo.tokenRewards[card.id] > 0);
      }
    },
    [userInfo, tokenKind]
  )

  const onStake = async action => {
    if (busdAmount < 250) {
      dispatch(error("You should stake over $250"));
      return;
    }

    dispatch(stake({ tokenKind, tokenAmount, poolId: card.id, code: coupon, provider, address, networkID: chainID }));
  };

  const onApprove = async action => {
    dispatch(approve({ tokenKind, provider, address, networkID: chainID }));
  };

  const unStake = async action => {
    if (stakedAmount == 0) {
      dispatch(error("You should stake to get rewards, first"));
      return;
    }

    dispatch(unstake({tokenKind, tokenAmount: action, poolId: card.id, provider, address, networkID: chainID }));
  };


  return (
    <Container
      style={{
        paddingLeft: smallerScreen || verySmallScreen ? "0" : "2.3rem",
        paddingRight: smallerScreen || verySmallScreen ? "0" : "2.3rem",
      }}
    >
      <Zoom in={true}>
        <Paper className="ohm-card" style={{border:"solid 2px #f504d5"}}>
          {/* <Box display="flex">
            <CardHeader title={"STAKE " + card.lockDay + " GET +" + card.apr + "% APY"} children={"Stake minimum $250 USD as token: Store-BNB to receive " + card.apr +"% APY"}/>
          </Box> */}
          <div className="card-title">
            STAKE {card.lockDay} <br/> &nbsp;&nbsp; GET {card.apr}% APY
          </div>
          <div className="card-title2">
            Stake minimum $250 USD as token: Store-BNB to receive {card.apr}% APY
          </div>
          <div>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <Grid container spacing={2} alignItems="flex-end">
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Typography align="left" style={{color: "black"}}>Staked Amount: <b>{stakedAmount}</b></Typography>
                  </Grid>
                  <Grid item xs={6} sm={6} md={6} lg={6}>
                    <Typography align="left" style={{color: "black"}}>Total Rewards: <b>{(pendingReward*1).toFixed(2)} Store</b></Typography>
                  </Grid>
                  <Grid item xs={6} sm={6} md={6} lg={6}>
                    <Typography align="right" style={{color: "black"}}>Price: <b>${tokenPrice.toFixed(2)}</b></Typography>
                  </Grid>
 
                  <Grid item xs={6} sm={6} md={6} lg={6}>
                    <Typography align="left" style={{color: "black"}}>Remain Time: <b>{prettyVestingPeriod2(depositTime, withdrawLockDay)}</b></Typography>
                  </Grid>
                  <Grid item xs={6} sm={6} md={6} lg={6}>
                    <Typography align="right" style={{color: "black"}}>Total Value: <b>${busdAmount.toFixed(2)}</b></Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
          <div className="token-list-container">
            <Grid container direction="row" spacing={2}>
              <Grid item xs={6} sm={6} md={6} lg={6}>
                <FormControl className="ohm-input" variant="outlined" color="primary" fullWidth >
                    <div>
                      <p style={{color:'black'}}>Token Amount</p>
                    </div>
                    <OutlinedInput
                      id="outlined-adornment-amount"
                      style={{background:'white', color:'black', border:"solid 1px black"}}
                      placeholder="0"
                      value={tokenAmount ? tokenAmount : ''}
                      onChange={e => handleTokenAmount(e.target.value)}
                      // startAdornment={<InputAdornment position="start">$</InputAdornment>}
                      labelWidth={0}
                      autoComplete="off"
                      
                      // endAdornment={
                      //   <InputAdornment position="end">
                      //     <Button variant="text" onClick={setMax}>
                      //       Max
                      //     </Button>
                      //   </InputAdornment>
                      // }
                    />
                </FormControl>
              </Grid>

              <Grid item xs={6} sm={6} md={6} lg={6}>
                <FormControl className="ohm-input" variant="outlined" color="primary" style={{width:"100%"}}>
                  <div>
                    <p style={{color:'black'}}>Select</p>
                  </div>
                  <Select
                    labelId="demo-simple-select-label"
                    id="outlined-adornment-amount"
                    value={ tokenKind }
                    // label="Token Kind"
                    labelWidth={0}
                    onChange={e => onChangeTokenKind(e.target.value)}
                    sx={{background: 'white', color:'black'}}
                  >
                    <MenuItem value={10}>Stake $BNB</MenuItem>
                    <MenuItem value={20}>Stake $Store</MenuItem>
                    {/* <MenuItem value={30}>Stake with $XXXX-BNB</MenuItem> */}
                  </Select>
                </FormControl>
              </Grid>
              
            </Grid>
           
            <Grid container spacing={2} className="data-grid" style = {{padding: '10px'}} alignContent="center">
              <Grid item lg={12} md={12} sm={12} xs={12} className="stake-button">
                <div style={{textAlign:"center"}}>
                  {canHarvest() ? 
                    <Button
                      className="stake-button, staking-button"
                      variant="contained"
                      color="white"
                      onClick={() => {
                        unStake(1);
                      }}
                    >
                      <span style={{fontWeight:"200", color:"white"}}>Withdraw</span>
                    </Button>
                    :
                    (hasAllowance() ? 
                    <Button
                      className="stake-button, staking-button"
                      variant="contained"
                      color="white"
                      onClick={() => {
                        onStake();
                      }}
                    >
                      <span style={{fontWeight:"200", color:"white"}}>Stake</span>
                    </Button>
                    :
                    <Button
                      className="stake-button, staking-button"
                      variant="contained"
                      color="white"
                      onClick={() => {
                        onApprove();
                      }}
                    >
                      <span style={{fontWeight:"200", color:"white"}}>Approve</span>
                    </Button>)
                  }
                </div>
              </Grid>
            </Grid>
          </div>
          {/* <div>
            <Grid container direction="row" spacing={2}>
              <Grid item xs={6} sm={6} md={6} lg={6}>
                <div>
                  <Button
                    className="stake-button, staking-button"
                    style={{width:"100%"}}
                    variant="contained"
                    color="white"
                    onClick={() => {
                      unStake(0);
                    }}
                  >
                    <span style={{fontWeight:"200", color:"white"}}>Claim</span>
                  </Button>
                </div>
              </Grid>

              <Grid item xs={6} sm={6} md={6} lg={6}>
                <div >
                  <Button
                    className="stake-button, staking-button"
                    style={{width:"100%", paddingLeft:"10px", paddingRight:"10px"}}
                    variant="contained"
                    color="white"
                    onClick={() => {
                      unStake(1);
                    }}
                  >
                    <span style={{fontWeight:"200", color:"white"}}>Claim & Unstake</span>
                  </Button>
                </div>
              </Grid>
              
            </Grid>
          </div> */}
        </Paper>
      </Zoom>

    </Container >
  );
}

const queryClient = new QueryClient();

export default ({card, coupon}) => (
  <QueryClientProvider client={queryClient}>
    <StakeCard card={card} coupon={coupon}/>
  </QueryClientProvider>
);

// export default StakeCard;

