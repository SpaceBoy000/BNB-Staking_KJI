import { AppBar, Avatar, Toolbar, IconButton, Box, Button, SvgIcon, Menu, MenuItem } from "@material-ui/core";
import { useCallback, useState } from "react";
import { Paper, Grid, Link, Typography } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { ReactComponent as MenuIcon } from "../../assets/icons/hamburger.svg";
import { ReactComponent as DashboardIcon } from "../../assets/icons/dashboard.svg";
import { ReactComponent as WrapIcon } from "../../assets/icons/wrap.svg";
// import OhmMenu from "./OhmMenu.jsx";

import ThemeSwitcher from "./ThemeSwitch.jsx";
import ConnectMenu from "./ConnectMenu.jsx";
import Logo from "./Logo.jsx"
import MenuBar from "./Menubar.jsx";
import "./topbar.scss";
const useStyles = makeStyles(theme => ({
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: "100%",
      padding: "40px",
    },
    //    justifyContent: "center",
    //    alignItems: "flex-end",
    background: "#e8e8e8",
    backdropFilter: "none",
    // zIndex: 10,
    position: "fixed"
  },

  menuBar: {
    display: "flex",
    alignItems: "center",
    marginLeft: "33px",

  },

  menuItem: {
    paddingLeft: "20px",
    paddingRight: "20px",
    alignItems: "center",
  },
  svg: {
    width: "20px",
    height: "20px",
    marginRight: "12px",
    alignItems: "center",
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("981")]: {
      display: "block",
    },

  },
}));

function TopBar({ theme, toggleTheme, handleDrawerToggle }) {
  const classes = useStyles();
  const isVerySmallScreen = useMediaQuery("(max-width: 355px)");
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  console.log("isSmallScreenXX: ", isSmallScreen);
  const [isActive] = useState();

  const checkPage = useCallback((match, location, page) => {
    const currentPath = location.pathname.replace("/", "");
    if (currentPath.indexOf("dashboard") >= 0 && page === "dashboard") {
      return true;
    }

    return false;
  }, []);
  // return <MenuBar/>
  return (
    <AppBar position="static" className={classes.appBar} elevation={0} style={{padding:"20px"}}>
      <Toolbar disableGutters className="dapp-topbar">
        <Box display="flex" className="my-box" sx={{alignItems: 'center', width: '100%', justifyContent: "space-between"}}>
          <Logo theme={theme}/>
          {
            isSmallScreen ? 
            <div/> 
            :
            <div className="title">
              <h1>Store Staking</h1>
            </div> 
          }
          <ConnectMenu theme={theme} />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
