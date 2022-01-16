import React, { createContext, useContext, useRef, useState } from 'react'
import { FaReddit, FaSearch, FaBell, FaUserCircle, FaEdit, FaPlus, FaHome } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import FirebaseContext from './firebase/FirebaseContext'
import { SignInWithPopupContext } from '../App'
import MenuDropDown from './MenuDropDown'
import { useFetchNotifs } from './hooks/useFetchPosts'
const Navbar = () => {
    const { firebase, setFirebase, loggedIn } = useContext(FirebaseContext);
    const { showSingInWithPopup, setSignInWithPopUp } = useContext(SignInWithPopupContext);
    const notifRef = useRef(null);
    const changeRoute = useNavigate()
    const [showNotifsDropDown, setShowNotifsDropDown] = useState(false);
    const [showUserDropDown, setShowUserDropDown] = useState(false)
    const [showCreatePost, setShowCreatePost] = useState(false);
    const userCircleRef = useRef(null);
    const { notifs, isLoadingNotifs, fetchMore, isEnd } = useFetchNotifs(firebase, showNotifsDropDown, `users/${firebase.uid}/notifs`, 10, '');
    
    const handleNotifClick = () => {
        const value = showNotifsDropDown
        setShowUserDropDown(false);
        setShowNotifsDropDown(false);
        setShowNotifsDropDown(!value);
    }
    const handleUserCircleClicked = () => {
        const value = showUserDropDown
        setShowUserDropDown(false);
        setShowNotifsDropDown(false);
        setShowUserDropDown(!value);
    }
    
    // console.log(firebase);
    return (
        <header>
            <div className='navbar'>
                <div className='inner-navbar-div'>

                    <div alt="logo" className='navbar-item app-logo'>
                        <Link to='/' className='text-link'>
                            <FaReddit size={"40px"} />
                        </Link>
                    </div>
                    <div className='auth-container navbar-item'>
                        {/* {loggedIn && <div alt="logo" className='navbar-item' id="notif-icon" title='Notifications' onClick={handleNotifClick}>
                            <FaPlus size={"25px"} />
                        </div>}
                        <div alt="logo" className='navbar-item' id="user-create-icon" title='Post Image'>
                            <Link to='/edit' className='text-link'>
                                <FaEdit size={"25px"} />
                            </Link>
                        </div>
                        {loggedIn && <div alt="logo" className='navbar-item' id="notif-icon" title='Notifications' onClick={handleNotifClick} style={{color: 'red'}}>
                            <FaBell size={"25px"} />
                        </div>}
                        <div alt="logo" className='navbar-item' id="user-icon" title='Profile' style={{color: loggedIn ? 'blue': 'grey'}} onClick={() => loggedIn ? firebase.auth.signOut(): setSignInWithPopUp(true)}>
                            <FaUserCircle size={"25px"}/>
                        </div> */}
                        {
                            <div alt="logo" className='navbar-item navbar-icon' title='Home' onClick={() => changeRoute('/')}>
                                <FaHome size={"25px"} />
                            </div>
                        }
                        {
                            loggedIn && <div alt="logo" className='navbar-item navbar-icon' title='Add Post'  onClick={() => changeRoute('/create-post')}>
                                <FaPlus size={"25px"} />
                            </div>
                        }
                        {
                            loggedIn && <div alt="logo" className='navbar-item navbar-icon' title='Notifications' ref={notifRef} onClick={handleNotifClick}>
                                <FaBell size={"25px"} />
                            </div>
                        }
                        {
                            showNotifsDropDown &&
                                <MenuDropDown items={notifs.map(notif => {return {title: notif['message'], clickHandler: handleNotifClick}})} anchorEl={notifRef} />
                        }
                        { loggedIn &&
                            <div alt="logo" ref={userCircleRef} className='navbar-item navbar-icon' title='Profile' onClick={handleUserCircleClicked}>
                                <FaUserCircle size={"25px"} />
                            </div>
                        }
                        
                        {
                            showUserDropDown &&
                                <MenuDropDown items={[{title: "Your Posts", clickHandler: () => {changeRoute('/your-profile'); setShowUserDropDown(false)}}, {title: "Sign Out", clickHandler: () => {setShowUserDropDown(false); firebase.auth.signOut()}}]} anchorEl={userCircleRef} />
                        }
                        {
                            !loggedIn &&
                            <div className='sign-in-navbar-btn' onClick={() => setSignInWithPopUp(true)}>
                                Sign In
                            </div>
                        }

                    </div>
                </div>
            </div>
        </header>
    )
}

export default Navbar

// import * as React from 'react';
// import { useContext, useState, useEffect } from 'react'
// import { styled, alpha } from '@mui/material/styles';
// import AppBar from '@mui/material/AppBar';
// import Box from '@mui/material/Box';
// import Toolbar from '@mui/material/Toolbar';
// import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
// import InputBase from '@mui/material/InputBase';
// import Badge from '@mui/material/Badge';
// import MenuItem from '@mui/material/MenuItem';
// import Menu from '@mui/material/Menu';
// import MenuIcon from '@mui/icons-material/Menu';
// import SearchIcon from '@mui/icons-material/Search';
// import AccountCircle from '@mui/icons-material/AccountCircle';
// import MailIcon from '@mui/icons-material/Mail';
// import NotificationsIcon from '@mui/icons-material/Notifications';
// import AddIcon from '@mui/icons-material/Add';
// import MoreIcon from '@mui/icons-material/MoreVert';
// import { Link } from 'react-router-dom'
// import { useForm } from 'react-hook-form'
// import FirebaseContext from './firebase/FirebaseContext'
// import { useTheme } from '@mui/material';
// import Chip from '@mui/material/Chip';
// import Autocomplete from '@mui/material/Autocomplete';
// import TextField from '@mui/material/TextField';

// import { ShowNotifsContext, SignInWithPopupContext } from '../App'
// const top100Films = [
//     { title: 'The Shawshank Redemption', year: 1994 },
//     { title: 'The Godfather', year: 1972 },
//     { title: 'The Godfather: Part II', year: 1974 },
//     { title: 'The Dark Knight', year: 2008 },
//     { title: '12 Angry Men', year: 1957 },
//     { title: "Schindler's List", year: 1993 },
//     { title: 'Pulp Fiction', year: 1994 },
//     {
//         title: 'The Lord of the Rings: The Return of the King',
//         year: 2003,
//     },
//     { title: 'The Good, the Bad and the Ugly', year: 1966 },
//     { title: 'Fight Club', year: 1999 },
//     {
//         title: 'The Lord of the Rings: The Fellowship of the Ring',
//         year: 2001,
//     },
//     {
//         title: 'Star Wars: Episode V - The Empire Strikes Back',
//         year: 1980,
//     },
//     { title: 'Forrest Gump', year: 1994 },
//     { title: 'Inception', year: 2010 },
//     {
//         title: 'The Lord of the Rings: The Two Towers',
//         year: 2002,
//     },
//     { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
//     { title: 'Goodfellas', year: 1990 },
//     { title: 'The Matrix', year: 1999 },
//     { title: 'Seven Samurai', year: 1954 },
//     {
//         title: 'Star Wars: Episode IV - A New Hope',
//         year: 1977,
//     },
//     { title: 'City of God', year: 2002 },
//     { title: 'Se7en', year: 1995 },
//     { title: 'The Silence of the Lambs', year: 1991 },
//     { title: "It's a Wonderful Life", year: 1946 },
//     { title: 'Life Is Beautiful', year: 1997 },
//     { title: 'The Usual Suspects', year: 1995 },
//     { title: 'Léon: The Professional', year: 1994 },
//     { title: 'Spirited Away', year: 2001 },
//     { title: 'Saving Private Ryan', year: 1998 },
//     { title: 'Once Upon a Time in the West', year: 1968 },
//     { title: 'American History X', year: 1998 },
//     { title: 'Interstellar', year: 2014 },
//     { title: 'Casablanca', year: 1942 },
//     { title: 'City Lights', year: 1931 },
//     { title: 'Psycho', year: 1960 },
//     { title: 'The Green Mile', year: 1999 },
//     { title: 'The Intouchables', year: 2011 },
//     { title: 'Modern Times', year: 1936 },
//     { title: 'Raiders of the Lost Ark', year: 1981 },
//     { title: 'Rear Window', year: 1954 },
//     { title: 'The Pianist', year: 2002 },
//     { title: 'The Departed', year: 2006 },
//     { title: 'Terminator 2: Judgment Day', year: 1991 },
//     { title: 'Back to the Future', year: 1985 },
//     { title: 'Whiplash', year: 2014 },
//     { title: 'Gladiator', year: 2000 },
//     { title: 'Memento', year: 2000 },
//     { title: 'The Prestige', year: 2006 },
//     { title: 'The Lion King', year: 1994 },
//     { title: 'Apocalypse Now', year: 1979 },
//     { title: 'Alien', year: 1979 },
//     { title: 'Sunset Boulevard', year: 1950 },
//     {
//         title: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
//         year: 1964,
//     },
//     { title: 'The Great Dictator', year: 1940 },
//     { title: 'Cinema Paradiso', year: 1988 },
//     { title: 'The Lives of Others', year: 2006 },
//     { title: 'Grave of the Fireflies', year: 1988 },
//     { title: 'Paths of Glory', year: 1957 },
//     { title: 'Django Unchained', year: 2012 },
//     { title: 'The Shining', year: 1980 },
//     { title: 'WALL·E', year: 2008 },
//     { title: 'American Beauty', year: 1999 },
//     { title: 'The Dark Knight Rises', year: 2012 },
//     { title: 'Princess Mononoke', year: 1997 },
//     { title: 'Aliens', year: 1986 },
//     { title: 'Oldboy', year: 2003 },
//     { title: 'Once Upon a Time in America', year: 1984 },
//     { title: 'Witness for the Prosecution', year: 1957 },
//     { title: 'Das Boot', year: 1981 },
//     { title: 'Citizen Kane', year: 1941 },
//     { title: 'North by Northwest', year: 1959 },
//     { title: 'Vertigo', year: 1958 },
//     {
//         title: 'Star Wars: Episode VI - Return of the Jedi',
//         year: 1983,
//     },
//     { title: 'Reservoir Dogs', year: 1992 },
//     { title: 'Braveheart', year: 1995 },
//     { title: 'M', year: 1931 },
//     { title: 'Requiem for a Dream', year: 2000 },
//     { title: 'Amélie', year: 2001 },
//     { title: 'A Clockwork Orange', year: 1971 },
//     { title: 'Like Stars on Earth', year: 2007 },
//     { title: 'Taxi Driver', year: 1976 },
//     { title: 'Lawrence of Arabia', year: 1962 },
//     { title: 'Double Indemnity', year: 1944 },
//     {
//         title: 'Eternal Sunshine of the Spotless Mind',
//         year: 2004,
//     },
//     { title: 'Amadeus', year: 1984 },
//     { title: 'To Kill a Mockingbird', year: 1962 },
//     { title: 'Toy Story 3', year: 2010 },
//     { title: 'Logan', year: 2017 },
//     { title: 'Full Metal Jacket', year: 1987 },
//     { title: 'Dangal', year: 2016 },
//     { title: 'The Sting', year: 1973 },
//     { title: '2001: A Space Odyssey', year: 1968 },
//     { title: "Singin' in the Rain", year: 1952 },
//     { title: 'Toy Story', year: 1995 },
//     { title: 'Bicycle Thieves', year: 1948 },
//     { title: 'The Kid', year: 1921 },
//     { title: 'Inglourious Basterds', year: 2009 },
//     { title: 'Snatch', year: 2000 },
//     { title: '3 Idiots', year: 2009 },
//     { title: 'Monty Python and the Holy Grail', year: 1975 },
// ];

// const AutoComplete = () => {
//     return (<Autocomplete
//         multiple
//         id="tags-outlined"
//         options={top100Films}
//         getOptionLabel={(option) => option.title}
//         defaultValue={[top100Films[13]]}
//         filterSelectedOptions
//         sx={{display: 'flex', width: '100%', marginLeft: '4rem', marginRight: '4rem', flexGrow: 0}}
//         renderInput={(params) => (
//             <TextField
//                 {...params}
//                 // label="filterSelectedOptions"
//                 placeholder="Favorites"
//             />
//         )} />)

// }
// // const StyleAutComplete = styled(AutoComplete)(({ theme }) => ({
// // }));
// const Search = styled('div')(({ theme }) => ({
//     position: 'relative',
//     borderRadius: theme.shape.borderRadius,
//     backgroundColor: alpha(theme.palette.common.white, 0.15),
//     '&:hover': {
//         backgroundColor: alpha(theme.palette.common.white, 0.25),
//     },
//     marginRight: theme.spacing(2),
//     marginLeft: 0,
//     width: '100%',
//     [theme.breakpoints.up('sm')]: {
//         marginLeft: theme.spacing(3),
//         width: 'auto',
//     },
// }));

// const SearchIconWrapper = styled('div')(({ theme }) => ({
//     padding: theme.spacing(0, 2),
//     height: '100%',
//     position: 'absolute',
//     pointerEvents: 'none',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
// }));

// const StyledInputBase = styled(InputBase)(({ theme }) => ({
//     color: 'inherit',
//     '& .MuiInputBase-input': {
//         padding: theme.spacing(1, 1, 1, 0),
//         // vertical padding + font size from searchIcon
//         paddingLeft: `calc(1em + ${theme.spacing(4)})`,
//         transition: theme.transitions.create('width'),
//         width: '100%',
//         [theme.breakpoints.up('md')]: {
//             width: '20ch',
//         },
//     },
// }));

// export default function Navbar() {
//     const [anchorEl, setAnchorEl] = React.useState(null);
//     const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
//     const { showNotif, setShowNotif } = useContext(ShowNotifsContext);
//     const { register, handleSubmit } = useForm();
//     const onSubmit = (data) => {
//         console.log(data);
//     }
//     const handleNotifClick = () => {
//         setShowNotif(!showNotif);
//     }
//     const { firebase, setFirebase, loggedIn } = useContext(FirebaseContext);
//     const { showSingInWithPopup, setSignInWithPopUp } = useContext(SignInWithPopupContext);
//     const isMenuOpen = Boolean(anchorEl);
//     const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

//     const handleProfileMenuOpen = (event) => {
//         setAnchorEl(event.currentTarget);
//     };

//     const handleMobileMenuClose = () => {
//         setMobileMoreAnchorEl(null);
//     };

//     const handleMenuClose = () => {
//         setAnchorEl(null);
//         handleMobileMenuClose();
//     };

//     const handleMobileMenuOpen = (event) => {
//         setMobileMoreAnchorEl(event.currentTarget);
//     };
//     const handleProfileClicked = () => {
//         console.log('profile clicked');
//     }
//     const menuId = 'primary-search-account-menu';
//     const renderMenu = (
//         <Menu
//             anchorEl={anchorEl}
//             anchorOrigin={{
//                 vertical: 'top',
//                 horizontal: 'right',
//             }}
//             id={menuId}
//             keepMounted
//             transformOrigin={{
//                 vertical: 'top',
//                 horizontal: 'right',
//             }}
//             open={isMenuOpen}
//             onClose={handleMenuClose}
//         >

//             {loggedIn && <MenuItem onClick={() => { handleMenuClose(); handleProfileClicked(); }}><Link to='/edit' className='text-link'> Profile </Link></MenuItem>}
//             {loggedIn && <MenuItem onClick={() => { handleMenuClose(); firebase.auth.signOut() }}>Sign Out</MenuItem>}
//             {!loggedIn && <MenuItem onClick={() => { handleMenuClose(); setSignInWithPopUp(true) }}>Sign In</MenuItem>}
//         </Menu>
//     );

//     const mobileMenuId = 'primary-search-account-menu-mobile';
//     const renderMobileMenu = (
//         <Menu
//             anchorEl={mobileMoreAnchorEl}
//             anchorOrigin={{
//                 vertical: 'top',
//                 horizontal: 'right',
//             }}
//             id={mobileMenuId}
//             keepMounted
//             transformOrigin={{
//                 vertical: 'top',
//                 horizontal: 'right',
//             }}
//             open={isMobileMenuOpen}
//             onClose={handleMobileMenuClose}
//         >
//             {/* <MenuItem>
//         <IconButton size="large" aria-label="show 4 new mails" color="inherit">
//           <Badge badgeContent={4} color="error">
//             <MailIcon />
//           </Badge>
//         </IconButton>
//         <p>Messages</p>
//       </MenuItem> */}
//             {loggedIn &&
//                 <MenuItem>
//                     <IconButton
//                         size="large"
//                         color="inherit"
//                     >
//                         <Badge badgeContent={'!'} color="error">
//                             <NotificationsIcon />
//                         </Badge>
//                     </IconButton>
//                     <p>Notifications</p>
//                 </MenuItem>
//             }
//             {loggedIn && <MenuItem onClick={(e) => { handleMobileMenuClose(e); handleProfileClicked(); }}>

//                 <IconButton
//                     size="large"
//                     color="inherit"
//                 >
//                     <AccountCircle />
//                 </IconButton>
//                 <Link to='/edit' className='text-link'>
//                     <p>Profile</p>
//                 </Link>
//             </MenuItem>
//             }{loggedIn && <MenuItem onClick={(e) => { handleMobileMenuClose(e); firebase.auth.signOut() }}>
//                 <IconButton
//                     size="large"
//                     color="inherit"
//                 >
//                     <AccountCircle />
//                 </IconButton>
//                 <p>Sign Out</p>
//             </MenuItem>
//             }
//             {!loggedIn && <MenuItem onClick={(e) => { handleMobileMenuClose(e); setSignInWithPopUp(true) }}>
//                 <IconButton
//                     size="large"
//                     color="inherit"
//                 >
//                     <AccountCircle />
//                 </IconButton>
//                 <p>Sign In</p>
//             </MenuItem>
//             }
//         </Menu>
//     );

//     return (
//         <Box sx={{ flexGrow: 1 }}>
//             <AppBar position="static">
//                 <Toolbar>
//                     {/* <IconButton
//             size="large"
//             edge="start"
//             color="inherit"
//             aria-label="open drawer"
//             sx={{ mr: 2 }}
//           >
//             <MenuIcon />
//           </IconButton> */}
//                     <Typography
//                         variant="h6"
//                         noWrap
//                         component="div"
//                         sx={{ display: { xs: 'none', sm: 'block' } }}
//                     >
//                         <Link to="/" className='text-link'>
//                             WALL-BURST
//                         </Link>
//                     </Typography>
//                     {/* <AutoComplete /> */}
//                     <Search>
//                     <SearchIconWrapper>
//                             <SearchIcon />
//                         </SearchIconWrapper>
//                         <StyledInputBase
//                             placeholder="Search…"
//                             inputProps={{ 'aria-label': 'search' }}
//                         />
//                     {/* <Autocomplete
//                             multiple
//                             id="tags-outlined"
//                             options={top100Films}
//                             getOptionLabel={(option) => option.title}
//                             defaultValue={[top100Films[13]]}
//                             filterSelectedOptions
//                             renderInput={(params) => (
//                                 <TextField
//                                     {...params}
//                                     label="filterSelectedOptions"
//                                     placeholder="Favorites"
//                                 />
//                             )} */}
//                     {/* /> */}
//                     </Search>
//                     <Box sx={{ flexGrow: 1 }} />
//                     <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
//                         {/* <IconButton size="large" aria-label="show 4 new mails" color="inherit">
//               <Badge badgeContent={4} color="error">
//                 <MailIcon />
//               </Badge>
//             </IconButton> */}
//                         {loggedIn ? <>
//                             <IconButton
//                                 size="large"
//                                 aria-label="Add Post"
//                                 color="inherit"
//                             >
//                                 <AddIcon />
//                             </IconButton>
//                             <IconButton
//                                 size="large"
//                                 aria-label="show 17 new notifications"
//                                 color="inherit"
//                                 onClick={(e) => { setShowNotif(!showNotif) }}
//                             >
//                                 <Badge badgeContent={'!'} color="error">
//                                     <NotificationsIcon />
//                                 </Badge>
//                             </IconButton>
//                         </>
//                             : []
//                         }
//                         <IconButton
//                             size="large"
//                             edge="end"
//                             aria-label="account of current user"
//                             aria-controls={menuId}
//                             aria-haspopup="true"
//                             onClick={handleProfileMenuOpen}
//                             color="inherit"
//                         >
//                             <AccountCircle />
//                         </IconButton>
//                     </Box>
//                     <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
//                         <IconButton
//                             size="large"
//                             aria-label="show more"
//                             aria-controls={mobileMenuId}
//                             aria-haspopup="true"
//                             onClick={handleMobileMenuOpen}
//                             color="inherit"
//                         >
//                             <MoreIcon />
//                         </IconButton>
//                     </Box>
//                 </Toolbar>
//             </AppBar>
//             {renderMobileMenu}
//             {renderMenu}
//             {/* {renderNotifs} */}
//         </Box>
//     );
// }
