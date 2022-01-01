import React, { useContext, useState, useEffect } from 'react'
import ContenttList from './ContentList'
import { testPostData } from './Home'
import { useForm } from 'react-hook-form'
import FirebaseContext from './firebase/FirebaseContext'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { setDoc, doc, Timestamp, where, query, limit, getDocs, collection, orderBy, writeBatch } from 'firebase/firestore'
import { SignInWithPopupContext } from '../App'
import { FaGoogle } from 'react-icons/fa'
import CreatePost from './CreatePost'
import { useFetchPostsByUser } from './hooks/useFetchPosts'

const EditSection = () => {
    const { firebase, setFirebase, loggedIn } = useContext(FirebaseContext);
    const { showSingInWithPopup, setSignInWithPopUp } = useContext(SignInWithPopupContext);
    const { posts, isLoadingPosts, fetchMore, isEnd } = useFetchPostsByUser(firebase, loggedIn, 'posts', 2, '');
    return (
        <div className='home-page'>
            {loggedIn ?
                <ContenttList postList={posts} fetchMore={fetchMore} isEnd={isEnd} loggedIn pushFrontChildren={<><CreatePost /><div style={{ textAlign: 'center', padding: '1rem' }}>
                    <b>Your Posts</b>
                </div></>} />
                : <div className='sign-in-popup-outer-box' style={{ marginTop: '10rem' }}>
                    <div className='sign-in-popup-inner-div' onClick={() => firebase.doSignIn.bind(firebase)()}>
                        {/* <div> */}
                        <FaGoogle />
                        <p>
                            Sign In With Google To Continue
                        </p>
                        {/* </div> */}
                    </div>
                </div>}
        </div>

    )
}

export default EditSection
