import React, { useEffect, useState } from "react";
import { query, collection, getDocs, limit, startAfter, where, orderBy } from "firebase/firestore";
const useFetchPosts = (firebase, loggedIn, location, postLimit, filterBy) => {
    const [posts, setPosts] = useState([]);
    const [isLoadingPosts, setLoadingPosts] = useState(false);
    const [lastSnapshot, setLastSnapshot] = useState(null);
    const [isEnd, setIsEnd] = useState(false);
    // console.log('why');
    const postsRef = collection(firebase.firestore, location);
    const fetchMore = async () => {
        setLoadingPosts(true);
        try {
            if (!lastSnapshot) {
                const q = query(postsRef, limit(postLimit));
                const snapshot = await getDocs(q);
                setPosts(snapshot.docs.map(rawPost => { return { ...rawPost.data(), id: rawPost.id } }));
                setLastSnapshot(snapshot.docs[snapshot.docs.length - 1]);
                console.log(snapshot.docs[snapshot.docs.length - 1], lastSnapshot);
                setLoadingPosts(false);
                console.log(posts);
            }
            else{
                const q = query(postsRef, startAfter(lastSnapshot) ,limit(postLimit));
                const snapshot = await getDocs(q);
                if(snapshot.docs.length == 0){
                    setIsEnd(true);
                }
                snapshot.docs.forEach(rawPost => {
                    posts.push({ ...rawPost.data(), id: rawPost.id });
                })
                setPosts(posts);
                setLastSnapshot(snapshot.docs[snapshot.docs.length - 1]);
                console.log(snapshot.docs.map(rawPost => { return { ...rawPost.data(), id: rawPost.id } }));
                setLoadingPosts(false);
                console.log(posts);

            }
        }
        catch (err) {
            console.log(err);
            setLoadingPosts(false);
            return null;
        }
    }
    useEffect(() => {
        fetchMore();
    }, [loggedIn])

    return { posts, isLoadingPosts, fetchMore, isEnd }
}
const useFetchPostsByUser = (firebase, loggedIn, location, postLimit, filterBy) => {
    const [posts, setPosts] = useState([]);
    const [isLoadingPosts, setLoadingPosts] = useState(false);
    const [lastSnapshot, setLastSnapshot] = useState(null);
    const [isEnd, setIsEnd] = useState(false);
    // console.log('why');
    const postsRef = collection(firebase.firestore, location);
    const fetchMore = async () => {
        setLoadingPosts(true);
        try {
            if (!lastSnapshot) {
                const q = query(postsRef, where('uid', '==', `${firebase.uid}`), orderBy('lastEdited', 'desc') ,limit(postLimit));
                const snapshot = await getDocs(q);
                setPosts(snapshot.docs.map(rawPost => { return { ...rawPost.data(), id: rawPost.id } }));
                setLastSnapshot(snapshot.docs[snapshot.docs.length - 1]);
                console.log(snapshot.docs[snapshot.docs.length - 1], lastSnapshot);
                setLoadingPosts(false);
                console.log(posts);
            }
            else{
                const q = query(postsRef,where('uid', '==', `${firebase.uid}`), orderBy('lastEdited', 'desc'),startAfter(lastSnapshot) ,limit(postLimit));
                const snapshot = await getDocs(q);
                if(snapshot.docs.length == 0){
                    setIsEnd(true);
                }
                snapshot.docs.forEach(rawPost => {
                    posts.push({ ...rawPost.data(), id: rawPost.id });
                })
                setPosts(posts);
                setLastSnapshot(snapshot.docs[snapshot.docs.length - 1]);
                console.log(snapshot.docs.map(rawPost => { return { ...rawPost.data(), id: rawPost.id } }));
                setLoadingPosts(false);
                console.log(posts);

            }
        }
        catch (err) {
            console.log(err);
            setLoadingPosts(false);
            return null;
        }
    }
    useEffect(() => {
        fetchMore();
    }, [loggedIn])

    return { posts, isLoadingPosts, fetchMore, isEnd }
}

const useFetchNotifs = (firebase, showNotif, location, notifLimit, filterBy) => {
    const [notifs, setNotifs] = useState([]);
    const [isLoadingNotifs, setLoadingNotifs] = useState(false);
    const [lastSnapshot, setLastSnapshot] = useState(null);
    const [isEnd, setIsEnd] = useState(false);
    // console.log('why');
    const notifsRef = collection(firebase.firestore, location);
    const fetchMore = async () => {
        setLoadingNotifs(true);
        try {
            if (!lastSnapshot) {
                const q = query(notifsRef, limit(notifLimit));
                const snapshot = await getDocs(q);
                setNotifs(snapshot.docs.map(rawPost => { return { ...rawPost.data(), id: rawPost.id } }));
                setLastSnapshot(snapshot.docs[snapshot.docs.length - 1]);
                console.log(snapshot.docs[snapshot.docs.length - 1], lastSnapshot);
                setLoadingNotifs(false);
                console.log(notifs);
            }
            else{
                const q = query(notifsRef, startAfter(lastSnapshot) ,limit(notifLimit));
                const snapshot = await getDocs(q);
                if(snapshot.docs.length == 0){
                    setIsEnd(true);
                }
                snapshot.docs.forEach(rawPost => {
                    notifs.push({ ...rawPost.data(), id: rawPost.id });
                })
                setNotifs(notifs);
                setLastSnapshot(snapshot.docs[snapshot.docs.length - 1]);
                console.log(snapshot.docs.map(rawPost => { return { ...rawPost.data(), id: rawPost.id } }));
                setLoadingNotifs(false);
                console.log(notifs);

            }
        }
        catch (err) {
            console.log(err);
            setLoadingNotifs(false);
            return null;
        }
    }
    useEffect(() => {
        if(showNotif)
            fetchMore();
    }, [showNotif])

    return { notifs, isLoadingNotifs, fetchMore, isEnd }
}




export { useFetchPosts, useFetchPostsByUser, useFetchNotifs}