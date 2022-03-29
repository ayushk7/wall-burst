import React, { createContext, useContext, useRef, useState } from 'react'
import { FaWaveSquare, FaSearch, FaBell, FaUserCircle, FaEdit, FaPlus, FaHome } from 'react-icons/fa'
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
                            {/* <img src="logo-charmender.png" alt="app-logo"/> */}
                            <FaWaveSquare size={"40px"} style={{color: "tomato"}} />
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

