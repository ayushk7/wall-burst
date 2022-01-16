import React, { useContext, useState, useEffect } from 'react'
import ContenttList from './ContentList'
import FirebaseContext from './firebase/FirebaseContext'
import { SignInWithPopupContext } from '../App'
import { FaGoogle } from 'react-icons/fa'
import { useFetchPostsByUser } from './hooks/useFetchPosts'

const EditSection = () => {
    const { firebase, setFirebase, loggedIn } = useContext(FirebaseContext);
    const { showSingInWithPopup, setSignInWithPopUp } = useContext(SignInWithPopupContext);
    const { posts, isLoadingPosts, fetchMore, isEnd } = useFetchPostsByUser(firebase, loggedIn, 'posts', 2, '');
    return (
        <div className='home-page'>
            {loggedIn ?
                <ContenttList postList={posts} fetchMore={fetchMore} isEnd={isEnd} loggedIn pushFrontChildren={<></>} isEditSection/>
                : <div className='sign-in-popup-outer-box' style={{ marginTop: '10rem' }}>
                    <div className='sign-in-popup-inner-div' onClick={() => firebase.doSignIn.bind(firebase)()}>
                        {/* <div> */}
                        <FaGoogle />
                        <p>
                            Sign In With Google To See Your Posts
                        </p>
                        {/* </div> */}
                    </div>
                </div>}
        </div>

    )
}

export default EditSection
