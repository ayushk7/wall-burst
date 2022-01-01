import React, { useEffect, useState, useContext } from 'react'
import { FaThumbsUp, FaThumbsDown, FaDownload, FaShare, FaTrash } from 'react-icons/fa'
import { collection, doc, getDoc, getDocs, Timestamp, FieldValue, query, where, setDoc, updateDoc, UpdateData, increment, runTransaction, writeBatch } from 'firebase/firestore'
import FirebaseContext from './firebase/FirebaseContext'
import { ref } from 'firebase/storage'
import { SignInWithPopupContext, fetchPostsLikedByUser } from '../App'

const Post = ({ postInfo }) => {
    const { firebase, setFirebase, loggedIn, isLoadingData } = useContext(FirebaseContext);
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(0);
    const { showSingInWithPopup, setSignInWithPopUp } = useContext(SignInWithPopupContext);
    useEffect(() => {
        const getLikes = () => {
            const postLikeRef = doc(firebase.firestore, `likes/${postInfo.id}`);
            return getDoc(postLikeRef);
        }
        getLikes()
            .then(res => {
                if (res.exists()) {
                    // console.log('he');
                    setLikes(res.data().count);
                }
            })
            .catch(err => {
                console.log(err);
            });

        // console.log(postInfo);
        return () => {

        }
    }, [])
    useEffect(() => {
        if (loggedIn && !isLoadingData) {
            if (firebase.userLikedPostsId[`${postInfo.id}`]) {
                setIsLiked(true);
            }
        }
        else {
            setIsLiked(false);
        }
        return () => {
        }
    }, [isLoadingData, loggedIn])
    const handleLikeClicked = () => {
        if (!loggedIn) {
            setSignInWithPopUp(true);
        }
        // console.log(loggedIn);
        if (loggedIn) {
            // console.log('licked2');
            if (isLiked) {
                setIsLiked(false);
                setLikes(likes - 1);
                doLikeRequest('unlike', firebase.uid, postInfo.id, firebase, postInfo.uid);
            }
            else {
                setIsLiked(true);
                setLikes(likes + 1);
                doLikeRequest('like', firebase.uid, postInfo.id, firebase, postInfo.uid);
            }
        }
    }
    // useEffect(() => {
    //     console.log('hello1');
    //     return () => {

    //     }
    // }, [])
    return (
        <>{postInfo.lastEdited ?
            < div className='post-container' >
                <div className='post-inner-container'>
                    <div className='post-user-info'><p>{`Posted by ${postInfo.postedBy} on ${postInfo.lastEdited.toDate().toLocaleTimeString('hi')}`}</p></div>
                    <div className='post-title'><p>{`${postInfo.title}`}</p></div>
                    <div className='post-image-container'>
                        <img src={postInfo.photoLink} alt={postInfo.photoLink} title={postInfo.photoLink} />
                    </div>
                    <div className='post-meta-data-container'>
                        <div className='post-meta-data'>
                            <div className='post-meta-icon-container' style={{ color: isLiked ? 'blue' : 'grey' }} onClick={handleLikeClicked}><FaThumbsUp className='post-meta-icons' title='Like' /><p>{`${likes}`}</p></div>
                            {/* <div className='post-meta-icon-container'><FaThumbsDown className='post-meta-icons' title='Dislike'/><p>{`${postInfo.downVotes}`}</p></div> */}
                            <div className='post-meta-icon-container'><FaDownload className='post-meta-icons' title='Download' /><p>{`${0}`}</p></div>
                            <div className='post-meta-icon-container'><FaShare className='post-meta-icons' title='Share' /><p>{`${0}`}</p></div>
                            {loggedIn && <div className='post-meta-icon-container'><FaTrash className='post-meta-icons' title='RemovePost' /><p>{`Remove`}</p></div>}
                        </div>
                    </div>
                </div>
            </div >
            : <></>
        }</>
    )
}

const doLikeRequest = async (type, userID, postID, firebase, target_uid) => {
    const batch = writeBatch(firebase.firestore);

    const post_likes_ref = collection(firebase.firestore, 'likes')
    const postDocRef = doc(post_likes_ref, postID)
    const user_likes_ref = collection(firebase.firestore, 'user_likes')
    const target_user_notif_list_ref = collection(firebase.firestore, `users/${target_uid}/notifs`);
    const targe_user_notif_doc = doc(target_user_notif_list_ref, `notif-${userID}-${Date.now()}`);
    const userLikeDocRef = doc(user_likes_ref, userID);
    batch.update(postDocRef, { count: type === 'like' ? increment(1) : increment(-1) });
    batch.set(userLikeDocRef, { ...firebase.userLikedPostsId, [`${postID}`]: type === 'like' ? true : false });
    if(type === 'like' && userID !== target_uid){
        batch.set(targe_user_notif_doc, {message: `${firebase.displayName} liked your post`, postID: `${postID}`});
    }
    try {
        await batch.commit();
        firebase.userLikedPostsId = { ...firebase.userLikedPostsId, [`${postID}`]: type === 'like' ? true : false };
    }
    catch (err) {
        console.log(err);
    }
}


export default Post
