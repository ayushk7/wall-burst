import React, { useContext, useState, useEffect } from 'react'
import ContenttList from './ContentList'
import FirebaseContext from './firebase/FirebaseContext'
import { SignInWithPopupContext } from '../App'
import { FaGoogle } from 'react-icons/fa'
import { useFetchPostsByUser } from './hooks/useFetchPosts'
import { useDeletePost } from './hooks/useDeletePost'
import SVGLoader from './SVGLoader'
const EditSection = () => {
    const { firebase, setFirebase, loggedIn } = useContext(FirebaseContext);
    const { showSingInWithPopup, setSignInWithPopUp } = useContext(SignInWithPopupContext);
    const { posts, isLoadingPosts, fetchMore, isEnd } = useFetchPostsByUser(firebase, loggedIn, 'posts', 2, '');
    const [isDeleting, deletePost] = useDeletePost(firebase, loggedIn, () => { window.location.reload() });
    return (
        <div className='main-page'>
            <div className='home-page'>
                {isDeleting &&
                    <div className="sign-in-popup-whole-window">
                        {/* <h3 style={{ color: "white" }}>Deleting...</h3> */}
                        <SVGLoader />
                    </div>
                }
                {loggedIn ?
                    <ContenttList postList={posts} fetchMore={fetchMore} isEnd={isEnd} loggedIn pushFrontChildren={<></>} isEditSection deletePost={deletePost} />
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
        </div>
    )
}

export default EditSection
