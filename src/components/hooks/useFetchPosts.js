import React, { useEffect, useState } from "react";
import { query, collection, getDocs, limit, startAfter, where, orderBy } from "firebase/firestore";
const useFetchPosts = (firebase, loggedIn, queryType) => {
    const [posts, setPosts] = useState([]);
    const [isLoadingPosts, setLoadingPosts] = useState(false);
    const [lastSnapshot, setLastSnapshot] = useState(null);
    const [isEnd, setIsEnd] = useState(false);
    const fetchMore = async () => {
        const postsRef = collection(firebase.firestore, queryType.location);
        setLoadingPosts(true);
        try {
            if (!lastSnapshot) {
                let q = query(postsRef, limit(queryType.limit));
                if (queryType.isTagged) {
                    q = query(postsRef, where('tags', 'array-contains', queryType.tag), limit(queryType.limit));
                }
                const snapshot = await getDocs(q);
                const newPosts = snapshot.docs.map(rawPost => { return { ...rawPost.data(), id: rawPost.id } });
                setPosts(newPosts);
                setLastSnapshot(snapshot.docs[snapshot.docs.length - 1]);
                setLoadingPosts(false);
            }
            else {
                let q = query(postsRef, startAfter(lastSnapshot), limit(queryType.limit));
                if (queryType.isTagged) {
                    q = query(postsRef, where('tags', 'array-contains', queryType.tag), startAfter(lastSnapshot), limit(queryType.limit));

                }
                const snapshot = await getDocs(q);
                if (snapshot.docs.length == 0) {
                    setIsEnd(true);
                }
                const newTodo = posts.slice();
                snapshot.docs.forEach(rawPost => {
                    newTodo.push({ ...rawPost.data(), id: rawPost.id });
                })
                setPosts(newTodo);
                setLastSnapshot(snapshot.docs[snapshot.docs.length - 1]);
                setLoadingPosts(false);

            }
        }
        catch (err) {
            console.log(err);
            setLoadingPosts(false);
            return null;
        }
    }
    useEffect(async () => {
        fetchMore();
    }, [loggedIn])

    useEffect(() => {
        setLastSnapshot(null);
    }, [queryType])
    useEffect(() => {
        if (lastSnapshot === null) {
            setPosts([]);
        }
    }, [lastSnapshot])
    useEffect(async () => {
        if (posts.length === 0) {
            setIsEnd(false);
            await fetchMore();
        }
    }, [posts])


    return { posts, isLoadingPosts, fetchMore, isEnd }
}
const useFetchPostsByUser = (firebase, loggedIn, location, postLimit, filterBy) => {
    const [posts, setPosts] = useState([]);
    const [isLoadingPosts, setLoadingPosts] = useState(false);
    const [lastSnapshot, setLastSnapshot] = useState(null);
    const [isEnd, setIsEnd] = useState(false);
    const postsRef = collection(firebase.firestore, location);
    const fetchMore = async () => {
        setLoadingPosts(true);
        try {
            if (!lastSnapshot) {
                const q = query(postsRef, where('uid', '==', `${firebase.uid}`), orderBy('lastEdited', 'desc'), limit(postLimit));
                const snapshot = await getDocs(q);
                setPosts(snapshot.docs.map(rawPost => { return { ...rawPost.data(), id: rawPost.id } }));
                setLastSnapshot(snapshot.docs[snapshot.docs.length - 1]);
                console.log(snapshot.docs[snapshot.docs.length - 1], lastSnapshot);
                setLoadingPosts(false);
                console.log(posts);
            }
            else {
                const q = query(postsRef, where('uid', '==', `${firebase.uid}`), orderBy('lastEdited', 'desc'), startAfter(lastSnapshot), limit(postLimit));
                const snapshot = await getDocs(q);
                if (snapshot.docs.length == 0) {
                    setIsEnd(true);
                }
                const newTodo = posts.slice();
                snapshot.docs.forEach(rawPost => {
                    newTodo.push({ ...rawPost.data(), id: rawPost.id });
                })
                setPosts(newTodo);
                setLastSnapshot(snapshot.docs[snapshot.docs.length - 1]);
                console.log(snapshot.docs.map(rawPost => { return { ...rawPost.data(), id: rawPost.id } }));
                setLoadingPosts(false);
                console.log(newTodo);

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
            else {
                const q = query(notifsRef, startAfter(lastSnapshot), limit(notifLimit));
                const snapshot = await getDocs(q);
                if (snapshot.docs.length == 0) {
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
        if (showNotif)
            fetchMore();
    }, [showNotif])

    return { notifs, isLoadingNotifs, fetchMore, isEnd }
}

const useFetchPostsByTag = (firebase, tag, tagChanged, postLimit) => {
    const [posts, setPosts] = useState([]);
    const [isLoadingPosts, setLoadingPosts] = useState(false);
    const [lastSnapshot, setLastSnapshot] = useState(null);
    const [isEnd, setIsEnd] = useState(false);

    const postsRef = collection(firebase.firestore, 'posts');

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
            else {
                const q = query(postsRef, startAfter(lastSnapshot), limit(postLimit));
                const snapshot = await getDocs(q);
                if (snapshot.docs.length == 0) {
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
    }, [tagChanged])

    return { posts, isLoadingPosts, fetchMore, isEnd }

}

const useFetchTags = (firebase, loggedIn, location, tagLimit, filterBy) => {
    const [tags, setTags] = useState([]);
    const [isLoadingTags, setLoadingTags] = useState(false);
    const [lastSnapshot, setLastSnapshot] = useState(null);
    const [tagsEnd, setIsEnd] = useState(false);
    // console.log('why');
    const tagsRef = collection(firebase.firestore, location);
    const fetchMoreTags = async () => {
        setLoadingTags(true);
        try {
            if (!lastSnapshot) {
                const q = query(tagsRef, limit(tagLimit));
                const snapshot = await getDocs(q);
                setTags(snapshot.docs.map(rawTag => { return { ...rawTag.data(), id: rawTag.id } }));
                setLastSnapshot(snapshot.docs[snapshot.docs.length - 1]);
                console.log(snapshot.docs[snapshot.docs.length - 1], lastSnapshot);
                setLoadingTags(false);
                console.log(tags);
            }
            else {
                const q = query(tagsRef, startAfter(lastSnapshot), limit(tagLimit));
                const snapshot = await getDocs(q);
                if (snapshot.docs.length == 0) {
                    setIsEnd(true);
                }
                snapshot.docs.forEach(rawTag => {
                    tags.push({ ...rawTag.data(), id: rawTag.id });
                })
                setTags(tags);
                setLastSnapshot(snapshot.docs[snapshot.docs.length - 1]);
                console.log(snapshot.docs.map(rawTag => { return { ...rawTag.data(), id: rawTag.id } }));
                setLoadingTags(false);
                console.log(tags);

            }
        }
        catch (err) {
            console.log(err);
            setLoadingTags(false);
            return null;
        }
    }
    useEffect(() => {
        fetchMoreTags();
    }, [loggedIn])

    return { tags, isLoadingTags, fetchMoreTags, tagsEnd }
}



export { useFetchPosts, useFetchPostsByUser, useFetchNotifs, useFetchTags }