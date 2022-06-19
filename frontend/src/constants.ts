// export const THE_GRAPH_URL = "https://api.thegraph.com/subgraphs/name/drondin/olympus-protocol-metrics";
// export const THE_GRAPH_URL = "https://api.thegraph.com/subgraphs/name/teradev203/crypstarterdao";


export const EPOCH_INTERVAL = 9600;

// NOTE could get this from an outside source since it changes slightly over time
export const BLOCK_RATE_SECONDS = 3;

export const TOKEN_DECIMALS = 9;

// export const POOL_GRAPH_URLS = {
//   4: "https://api.thegraph.com/subgraphs/name/pooltogether/rinkeby-v3_4_3",
//   1: "https://api.thegraph.com/subgraphs/name/pooltogether/pooltogether-v3_4_3",
// };

interface IAddresses {
  [key: number]: { [key: string]: string };
}

export const addresses: IAddresses = {
  97: {
    // DAI_ADDRESS: "0xB2180448f8945C8Cc8AE9809E67D6bd27d8B2f2C", // duplicate
    OIM_TOKEN_ADDRESS: "0x1Babc7461A1d65758d483e38217C4092Edd38Bd0",
    NFT_TOKEN_ADDRESS: "0xFc9c1C0100CB8d168dC8fdb8a3AAaE175c194D9E",
    STAKING_ADDRESS:"0x09a8db45712267Ea208364C1be88e93d0704Dd66",
    REWARD_TOKEN_ADDRESS:"0xc84a08b2bD7eed82aACF5c4A026e3EEA50C77891",
    PID_ADDRESS: "0x16c7BafAd45f900651678B45897ac6DAc02e791d", // 0xC0b491daBf3709Ee5Eb79E603D73289Ca6060932
    FAIRLAUNCH_ADDRESS: "0xD22B07bf59a649a5737717A35583C5904F888CC6",
    TREASURY_ADDRESS: "0x8B255b49dFaF7E5995E6368c3bf40831db90Bc79", // 0x0d722D813601E48b7DAcb2DF9bae282cFd98c6E7
    SPID_ADDRESS: "0xfF4E503047ca4C6F32BAa625f526EE566ebF5Bd5", // 0x1Fecda1dE7b6951B248C0B62CaeBD5BAbedc2084
    STAKING_HELPER_ADDRESS: "0xAe613aaFb32eB06AcD31CAbE6401aAD4e99F766C", // 0xf73f23Bb0edCf4719b12ccEa8638355BF33604A1
    DISTRIBUTOR_ADDRESS: "0xd485De127bfc63FB4b65ED9c9743905726b14781", // "0x0626D5aD2a230E05Fb94DF035Abbd97F2f839C3a",
    BUSDBONDDEPOSITORY_ADDRESS: "0xea212D3772D5B4BAf0390910e9437b4CD7B34AF3",
    LPBONDDEPOSITORY_ADDRESS: "0xBaeDb3377b35A4ce5fA3Ab11e4B0fc684e449270",
    LPTOKEN_ADDRESS: "0xCD49fe66823A5dD0C43AaA69ac66A7B82bdaB5E7",
    DAI_ADDRESS: "0x8301F2213c0eeD49a7E28Ae4c3e91722919B8B47", // duplicate
    BONDINGCALC_ADDRESS: "0x763F54e1B942a9a1562fec839A69D7C8618C8811",
    REDEEM_HELPER_ADDRESS: "0x17EB30c86AbFF482CafAec600D9086278215EdDD",
    BUSD_ADDRESS: "0x8301F2213c0eeD49a7E28Ae4c3e91722919B8B47", // duplicate
    
    XSYS_ADDRESS: "0xa453107FFdE8A33Aa924d32bc8de8153e357D923",
    ETH_STAKING_ADDRESS: "0x93ba017f19780517b3C1cAFAB8004F202395A7ff",
    TOKEN_STAKING_ADDRESS: "0xb25D5FACF9E81150e6ead02FFAf1be95C24d0a42"
  },
  56: {
    FAIRLAUNCH_ADDRESS: "0xdEBA1A686029176e3A1Edaf72aa721204E21BC7b",
    PRESALE_ADDRESS:"0xAb4b6c165fCD15dBbdF9276Ef974479A314054AB",
    CSTP_ADDRESS: "0xF95BD116A3A3E0053b0B757892450E5FCD55CaBF", // duplicate
    DAI_ADDRESS: "0xe9e7cea3dedca5984780bafc599bd69add087d56", // duplicate
    PID_ADDRESS: "0x7Ffb0F8a6486234685a689FEdc45F22De7bE9d50",
    STAKING_ADDRESS: "0x02c58A692bD4f4bD863ACc38bd4D25b384A367Fd", // The new staking contract
    STAKING_HELPER_ADDRESS: "0xD4BAB1B30002073a02eAA325e0Fc04C208ca6a49", // Helper contract used for Staking only
    SPID_ADDRESS: "0x8f74a681D5357DddeC9bd9967e256a2fb467B9A4",
    DISTRIBUTOR_ADDRESS: "0xE375C9E5745FDA11f0DfE76383bfC102Ae599aD6",
    BONDINGCALC_ADDRESS: "0xd9145CCE52D386f254917e481eB44e9943F39138",
    TREASURY_ADDRESS: "0xc1F2477B33a987605377b600f5406e89DE70f017",
    REDEEM_HELPER_ADDRESS: "0x912B1989391BD8Ee98ccE3D1F92a6231416619e9",
    BUSDBONDDEPOSITORY_ADDRESS: "0x62fa89AAb59Af8be162F521ce7285B9faCCd1907",
    LPBONDDEPOSITORY_ADDRESS: "0x62fa89AAb59Af8be162F521ce7285B9faCCd1907",

    IDO_ADDRESS:'0x3Ae07374d7C89f608906321444e8AFdED91aDA5E',
    BUSD_ADDRESS:'0xe9e7cea3dedca5984780bafc599bd69add087d56',

    
    XSYS_ADDRESS: "0x72008Bc758e4a2F2F1cF91BC90D6795D1F7470dd",
    ETH_STAKING_ADDRESS: "0x371b21eaC8c83b661B1b5b93e5E792a8a2a26315",
    TOKEN_STAKING_ADDRESS: "0x2d39dA375c400D1ced603e1733F09e9909bb5eB6"
  },

  4002: {
    FAIRLAUNCH_ADDRESS: "0x5b55e27bCD7522E4e393DaF2c754498a0c2d818A",
    DAI_ADDRESS: "0x3923D2ec541e8dD40D8C0fA3cB4d109f59E7d35C", // duplicate
    BUSD_ADDRESS:'0x3923D2ec541e8dD40D8C0fA3cB4d109f59E7d35C',
    // TOKEN_STAKING_ADDRESS: "0x72DD644E872dA96394b785AedA20CB4094A05ae8"
  },

  42261: {
    NFT_TOKEN_ADDRESS: "0x7ECDE74Eb35BC6A6A5a36e1f9Cabd8aE7A1Bb9E5",
    STAKING_ADDRESS:"0xaA82AdD9Ef41b3e5576b6B5140EdF5E12895bbaa",
  }
};
