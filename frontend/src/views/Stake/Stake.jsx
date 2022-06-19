import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";
import { useWeb3Context } from "../../hooks";
import { Paper, Grid, Typography, Box, Zoom, Container, useMediaQuery, Button, OutlinedInput } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { useSelector } from "react-redux";
import imgStakeButton from '../../assets/images/img_stake_btn.png';
import imgUnStakeButton from '../../assets/images/img_unstake_btn.png';
import imgCliamButton from '../../assets/images/img_claim_btn.png';
import imgApproveButton from '../../assets/images/img_approve_btn.png';
import { trim, formatCurrency } from "../../helpers";
import { mintNFTWithBNB } from "../../slices/NFT";
import CardHeader from "../../components/CardHeader/CardHeader";

import { useTheme } from "@material-ui/core/styles";
import StakeCard from "./StakeCard";
import StakedTokenList from "./StakedTokenList";
import PoolList from "./PoolList";
import "./stake.scss";

function Stake() {
  const [data, setData] = useState(null);
  const [apy, setApy] = useState(null);
  const [runway, setRunway] = useState(null);
  const [coupon, setCoupon] = useState("");
  // const [tokenKind1, setTokenKind1] = useState(10);
  // const [tokenKind2, setTokenKind2] = useState(10);
  const theme = useTheme();
  const smallerScreen = useMediaQuery("(max-width: 650px)");
  const verySmallScreen = useMediaQuery("(max-width: 379px)");
  console.log("smallerScreen: ", smallerScreen, "verySmallScreen: ", verySmallScreen);
  const dispatch = useDispatch();
  const { connect, address, provider, chainID, connected, hasCachedProvider } = useWeb3Context();
  // const staked = useSelector(state => {
  //   return state.app.Staked;
  // });

  const stakeCardList = [
    {
      id: 0,
      apr: 200,
      lockDay: "6 MONTHS"
    },
    {
      id: 1,
      apr: 300,
      lockDay: "12 MONTHS"
    }
  ]

  const handleCoupon = async (value) => {
    setCoupon(value);
    console.log("coupon:", value);
  }




  return (
    <div id="stake-view" className={`${smallerScreen && "smaller"} ${verySmallScreen && "very-small"}`}>
      <Container
        style={{
          paddingLeft: smallerScreen || verySmallScreen ? "18px" : "2.3rem",
          paddingRight: smallerScreen || verySmallScreen ? "10px" : "2.3rem",
        }}
      >
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Grid container spacing={2} alignItems="flex-end">
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <div style={{color:"rgb(245, 4, 213)", fontWeight:"600", fontSize:"30px"}}>
                  <h3>EARN UP TO +300% APY BY STAKING</h3>
                </div>
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="baseline">
              <Grid item lg={12} md={12} sm={12} xs={12} style={{display: "flex"}}>
                <div style={{fontWeight:"600", fontSize:"20px", color:"black", alignSelf:"center"}}>
                  Get 1.000 extra $XXXX using a limited & exclusive coupon:
                </div>
                <div style={{marginLeft: "20px"}}>
                  <OutlinedInput
                      id="outlined-adornment-amount"
                      style={{background:'white', color:'black', border:"solid 2px #f504d5"}}
                      // placeholder="0"
                      // value={cstpBalance ? cstpBalance.toFixed(2) : ''}
                      onChange={e => handleCoupon(e.target.value)}
                      // startAdornment={<InputAdornment position="start">$</InputAdornment>}
                      labelWidth={0}
                      // defaultValue="none"
                      autoComplete="off"
                      // endAdornment={
                      //   <InputAdornment position="end">
                      //     <Button variant="text" onClick={setMax}>
                      //       Max
                      //     </Button>
                      //   </InputAdornment>
                      // }
                    />
                </div>
              </Grid>
              {/* <Grid item lg={4} md={4} sm={12} xs={12}>
                <Grid container direction="row" spacing={2}>
                  <Grid item lg={6} md={6} sm={6} xs={6}>
                    
                  </Grid>
                  <Grid item lg={6} md={6} sm={6} xs={6}>
                    <Button style={{color:"white", background:"#f504d5", width:"100%"}}>
                      <h4>APPLY</h4>
                    </Button>
                  </Grid>
                </Grid>
              </Grid> */}
            </Grid>
          </Grid>
        </Grid>

        <Grid container direction="row" spacing={2}>
          {
            stakeCardList.map(card => {
              console.log("card:", card);
              return (
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <StakeCard style={{zIndex:"-10"}} card={card} coupon={coupon}/>
                </Grid>
              );
            })
          }
        </Grid>

        {/* <PoolList /> */}
        {/* <Zoom in={true}>
          <Paper className="ohm-card">
            <Grid container spacing={2} className="data-grid" alignContent="center">
              <Grid item lg={3} md={3} sm={1} xs={0} />
              <Grid item lg={6} md={6} sm={10} xs={12}>
                <Typography variant="h4" className="title1" align={'center'}>
                  Token Staked Info
                </Typography>
                <Grid container className="data-grid" alignContent="center">
                  <Grid item lg={6} md={6} sm={6} xs={6}>
                    <Typography variant="h6" className="nft-item-description-title" align={'left'}>
                      My NFT List  :
                    </Typography>
                  </Grid>
                  <Grid item lg={6} md={6} sm={6} xs={6}>
                    <Typography variant="h6" className="nft-item-description-value" align={'right'}>
                      {"1, 5, 6, 123, 90"}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container className="data-grid" alignContent="center">
                  <Grid item lg={6} md={6} sm={6} xs={6}>
                    <Typography variant="h6" className="nft-item-description-title" align={'left'}>
                      Reward Token Amount :
                    </Typography>
                  </Grid>
                  <Grid item lg={6} md={6} sm={6} xs={6}>
                    <Typography variant="h6" className="nft-item-description-value" align={'right'}>
                      {"1000"}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container className="data-grid" alignContent="center">
                  <Grid item lg={6} md={6} sm={6} xs={6}>
                    <Typography variant="h6" className="nft-item-description-title" align={'left'}>
                      Pending Token Amount :
                    </Typography>
                  </Grid>
                  <Grid item lg={6} md={6} sm={6} xs={6}>
                    <Typography variant="h6" className="nft-item-description-value" align={'right'}>
                      {"1000"}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item lg={3} md={3} sm={1} xs={0} />
            </Grid>
          </Paper>

        </Zoom>
        <Zoom in={true}>
          <Paper className="ohm-card">
            <Box display="flex">
              <CardHeader title="Pool List" />
            </Box>
            <div className="pool-card-container">
              <Grid container spacing={2} className="data-grid" alignContent="center">
                <Grid item lg={4} md={4} sm={4} xs={4}>
                  <PoolItem/>
                </Grid>
                <Grid item lg={4} md={4} sm={4} xs={4}>
                  <PoolItem/>
                </Grid>
                <Grid item lg={4} md={4} sm={4} xs={4}>
                  <PoolItem/>
                </Grid>
                <Grid item lg={4} md={4} sm={4} xs={4}>
                  <PoolItem/>
                </Grid>
                <Grid item lg={4} md={4} sm={4} xs={4}>
                  <PoolItem/>
                </Grid>
                <Grid item lg={4} md={4} sm={4} xs={4}>
                  <PoolItem/>
                </Grid>
              </Grid>
            </div>

          </Paper>
        </Zoom> */}

      </Container >
    </div >
  );
}

const queryClient = new QueryClient();

export default () => (
  <QueryClientProvider client={queryClient}>
    <Stake />
  </QueryClientProvider>
);