import React, { useEffect, useState, useContext } from 'react'
import { FaHeart, FaTrash } from 'react-icons/fa'
import { collection, doc, getDoc, getDocs, Timestamp, FieldValue, query, where, setDoc, updateDoc, UpdateData, increment, runTransaction, writeBatch } from 'firebase/firestore'
import FirebaseContext from './firebase/FirebaseContext'
import { SignInWithPopupContext, fetchPostsLikedByUser } from '../App'
import { QueryContext } from '../App'
const Post = ({ postInfo, isEditSection, deletePost }) => {
    const { firebase, setFirebase, loggedIn, isLoadingData } = useContext(FirebaseContext);
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(0);
    const { showSingInWithPopup, setSignInWithPopUp } = useContext(SignInWithPopupContext);
    const {queryType, setQueryType} = useContext(QueryContext);
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
                    <div className='post-title'><p>{`${postInfo.postTitle}`}</p></div>
                    <div className='post-image-container'>
                        <img onClick={() => { window.open(postInfo.photoLink) }} src={postInfo.photoLink} alt={postInfo.photoLink} title={postInfo.postAltTitle} />
                    </div>
                    <div className='post-meta-data-container'>
                        <div className='post-meta-data'>
                            <div className='post-meta-icon-container' style={{ color: isLiked ? 'tomato' : 'white' }} onClick={handleLikeClicked}><FaHeart className='post-meta-icons' title='Like' /><p style={{ marginLeft: '0.2rem' }}>{`${likes}`}</p></div>
                            {/* <div className='post-meta-icon-container'><FaThumbsDown className='post-meta-icons' title='Dislike'/><p>{`${postInfo.downVotes}`}</p></div> */}
                            {isEditSection && loggedIn && <div className='post-meta-icon-container' style={{ color: 'white' }} onClick={() => deletePost(postInfo.store_id, postInfo.id , postInfo.tags)}><FaTrash className='post-meta-icons' title='RemovePost' /></div>}
                            {postInfo.tags.map(tg => {
                                return <li className='hash-tag' key={tg} onClick={() => setQueryType({...queryType, isTagged: true, tag: tg})}>{`#${tg}`}</li>
                            })}
                            <div className='post-user-info'><p>{`Posted by ${postInfo.postedBy} on ${postInfo.lastEdited.toDate().toLocaleDateString('hi')}`}</p></div>
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
    if (type === 'like' && userID !== target_uid) {
        batch.set(targe_user_notif_doc, { message: `${firebase.displayName} liked your post`, postID: `${postID}`, time: Timestamp.now() });
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
