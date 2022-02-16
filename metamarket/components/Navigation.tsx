import React, { useCallback, useState, useEffect } from 'react';
import {
  Toolbar,
  AppBar,
  Button,
  Box,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';
// import AppBar from '@material-ui/core/AppBar';
// import Toolbar from '@material-ui/core/Toolbar';
// import Button from '@material-ui/core/Button';
// import Box from '@material-ui/core/Box';
// import { Typography } from '@material-ui/core';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { styled } from '@mui/material';
import Link from 'next/link';

export default function Navigation() {
  const [currentUser, setCurrentUser] = useState(true);
  const [openMenu, setOpenMenu] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOnClick = () => {};

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    // setOpenMenu(true);
    // setAnchorEl(event.currentTarget);
    if (anchorEl !== event.currentTarget) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleRequestClose = () => {
    // setOpenMenu(false);
    setAnchorEl(null);
  };

  const style = {
    header: {
      // paddingLeft: '1%',
      // paddingRight: '1%',
      color: '#34c9eb',
    },
    navBtn: {
      fontSize: '16px',
      borderRadius: '5px',
      height: '64px',
      paddingLeft: '20px',
      paddingRight: '20px',
      '&:hover': {
        background: 'white',
        color: 'black',
      },
      // color: 'white',
      // textTransform: 'none',
    },
    loginBtn: {
      marginLeft: 'auto',
    },
    noHyperLink: {
      textDecoration: 'none',
    },
  };
  return (
    <AppBar style={{ backgroundColor: '#34c9eb' }} position='sticky'>
      <Toolbar>
        <Link href='/'>
          <Button
            style={style.navBtn}
            color='inherit'
            sx={{
              textTransform: 'none',
              '&:hover': {
                background: 'white',
                color: 'black',
              },
            }}
          >
            <img src="/MetaMarket.ico" alt="website logo" height ="50" width="50"/>
            <b>&nbsp;MetaMarket</b>
          </Button>
        </Link>
        {/* <Link href='/'>
          <Button
            // style={style.navBtn}
            color='inherit'
            sx={{
              textTransform: 'none',
              '&:hover': {
                background: 'white',
                color: 'black',
              },
            }}
            aria-controls='demo-positioned-menu'
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup='true'
            onClick={handleClick}
            onMouseOver={handleClick}
            // onMouseLeave={handleRequestClose}
          >
            Open Menu
          </Button>
        </Link>

        <Menu
          id='simple-menu'
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleRequestClose}
          MenuListProps={{ onMouseLeave: handleRequestClose }}
        >
          <MenuItem onClick={handleRequestClose}>Profile</MenuItem>
          <MenuItem onClick={handleRequestClose}>My account</MenuItem>
          <MenuItem onClick={handleRequestClose}>Logout</MenuItem>
        </Menu> */}

        <Box sx={{ flexGrow: 1 }} />
        <Link href='/explore'>
          <Button
            style={style.navBtn}
            color='inherit'
            sx={{
              textTransform: 'none',
              '&:hover': {
                background: 'white',
                color: 'black',
              },
            }}
            // onClick={() => handleOnClick('/explore')}
          >
            <b>Explore</b>
          </Button>
        </Link>

        <Link href='/about'>
          <Button
            style={style.navBtn}
            color='inherit'
            sx={{
              textTransform: 'none',
              '&:hover': {
                background: 'white',
                color: 'black',
              },
            }}
          >
            <Tooltip
              title={
                <React.Fragment>
                  <Link href='/about'>
                    <MenuItem>About</MenuItem>
                  </Link>
                  <Link href='/contributors'>
                    <MenuItem>Our Team</MenuItem>
                  </Link>
                </React.Fragment>
              }
            >
              <Typography style={{ fontSize: 16 }}>
                <b>Community</b>
              </Typography>
            </Tooltip>
          </Button>
        </Link>

        <Link href='/create'>
          <Button
            style={style.navBtn}
            color='inherit'
            sx={{
              textTransform: 'none',
              '&:hover': {
                background: 'white',
                color: 'black',
              },
            }}
            // // onClick={() => handleOnClick('/create')}
          >
            <b>Create</b>
          </Button>
        </Link>

        <Link href='/earn-tokens'>
          <Button
            style={style.navBtn}
            color='inherit'
            sx={{
              textTransform: 'none',
              '&:hover': {
                background: 'white',
                color: 'black',
              },
            }}
            // onClick={() => handleOnClick('/explore')}
          >
            <b>Earn Tokens</b>
          </Button>
        </Link>

        {currentUser ? (
          <div style={style.loginBtn}>
            <Link href='/dashboard'>
              <Button
                style={style.navBtn}
                color='inherit'
                sx={{
                  textTransform: 'none',
                  '&:hover': {
                    background: 'white',
                    color: 'black',
                  },
                }}
              >
                <Tooltip
                  title={
                    <React.Fragment>
                      <Link href='/dashboard'>
                        <MenuItem>Dashboard</MenuItem>
                      </Link>
                      {/* <Link href='/favorites'>
                        <MenuItem>Favorites</MenuItem>
                      </Link> */}
                      <Link href='/'>
                        <MenuItem>Logout</MenuItem>
                      </Link>
                    </React.Fragment>
                  }
                >
                  <b>
                    <AccountCircleIcon fontSize='large' />
                  </b>
                </Tooltip>
              </Button>
            </Link>

            <Menu
              id='simple-menu'
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleRequestClose}
              MenuListProps={{ onMouseLeave: handleRequestClose }}
            >
              <MenuItem onClick={handleRequestClose}>Profile</MenuItem>
              <MenuItem onClick={handleRequestClose}>My account</MenuItem>
              <MenuItem onClick={handleRequestClose}>Logout</MenuItem>
            </Menu>

            {/* <Button
              style={style.navBtn}
              color='inherit'
              // onClick={() => handleOnClick('/login')}
            >
              <a href='/login' style='nav-link'>
                Log out
              </a>
            </Button> */}
            {/* <li style='nav-item'>
                  <a href='/login' style='nav-link' onClick={logOut}>
                    LogOut
                  </a>
                </li> */}
          </div>
        ) : (
          <div style={style.loginBtn}>
            {/* <li style='nav-item'>
                  <Link to={'/login'} style='nav-link'>
                    Login
                  </Link>
                </li> */}
            <Link href='/'>
              <Button
                style={style.navBtn}
                color='inherit'
                sx={{
                  textTransform: 'none',
                  '&:hover': {
                    background: 'white',
                    color: 'black',
                  },
                }}
                // // onClick={() => handleOnClick('/register')}
              >
                Register
              </Button>
            </Link>
            <Link href='/'>
              <Button
                style={style.navBtn}
                color='inherit'
                sx={{
                  textTransform: 'none',
                  '&:hover': {
                    background: 'white',
                    color: 'black',
                  },
                }}
                // // onClick={() => handleOnClick('/login')}
              >
                Log in
              </Button>
            </Link>
            {/* <li style='nav-item'>
                  <Link to={'/register'} style='nav-link'>
                    Sign Up
                  </Link>
                </li> */}
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
}
