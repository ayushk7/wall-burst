import React from 'react'
import { FaGoogle, FaTimes } from 'react-icons/fa'
import { useContext } from 'react'
import {SignInWithPopupContext} from '../App'
import FirebaseContext from './firebase/FirebaseContext'
const SignInPopup = () => {
    const {showSingInWithPopup, setSignInWithPopUp} = useContext(SignInWithPopupContext);
    const {firebase, setFirebase, loggedIn} = useContext(FirebaseContext);
    const closeHandler = () => {
        setSignInWithPopUp(false);
    } 
    return (
        showSingInWithPopup && !loggedIn ?
        <div className='sign-in-popup-whole-window'>
            <div className='sign-in-popup-outer-box'>
                <FaTimes style={{position: 'absolute', right: '1rem', top: '0.8rem', cursor:'pointer', fontSize:'1.2rem', color: 'tomato'}} onClick={closeHandler}/>
                <div className='sign-in-popup-inner-div' onClick={() => firebase.doSignIn.bind(firebase)()}>
                    {/* <div> */}
                        <FaGoogle />
                        <p>
                            Sign In With Google
                        </p>
                    {/* </div> */}
                </div>
            </div>
        </div>
        : <></>
    )
}

export default SignInPopup
