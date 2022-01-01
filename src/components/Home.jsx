import React, { useState } from 'react'
import ContenttList from './ContentList';
import {getDoc,doc,collection, query, where, limit, getDocs, orderBy, startAt, endAt} from 'firebase/firestore'
import FirebaseContext from './firebase/FirebaseContext';
import { useContext, useEffect } from 'react/cjs/react.development';
import {useFetchPosts} from './hooks/useFetchPosts';
export const testPostData = [
    {
        userName: 'ayush',
        postDate: '23-10-13',
        imageSource: 'https://preview.redd.it/i4935v6sy3581.png?width=1440&format=png&auto=webp&s=7015044b332fd58c2bb3ada0bcf2a109aa19169b',
        upVotes: 1000,
        downVotes: 67,
        totalDownloads: 100,
        totalShares: 4,
        postTitle: 'title'
    },
    {
        userName: 'ayush',
        postDate: '23-10-13',
        imageSource: 'https://i.redd.it/ele1zox6dm681.jpg',
        upVotes: 1000,
        downVotes: 67,
        totalDownloads: 100,
        totalShares: 4,
        postTitle: 'title'

    },
    {
        userName: 'ayush',
        postDate: '23-10-13',
        imageSource: 'https://wallpapers.com/images/high/naruto-half-face-gbjepana241apniy.jpg',
        upVotes: 1000,
        downVotes: 67,
        totalDownloads: 100,
        totalShares: 4,
        postTitle: 'title'

    },
    {
        userName: 'ayush',
        postDate: '23-10-13',
        imageSource: 'https://i.redd.it/skqr2npwav681.png',
        upVotes: 1000,
        downVotes: 67,
        totalDownloads: 100,
        totalShares: 4,
        postTitle: 'title'

    },
    {
        userName: 'ayush',
        postDate: '23-10-13',
        imageSource: 'https://i.redd.it/mu0aemd1ru681.jpg',
        upVotes: 1000,
        downVotes: 67,
        totalDownloads: 100,
        totalShares: 4,
        postTitle: 'title'

    }
];

const Home = () => {
    const {firebase, setFirebase, loggedIn} = useContext(FirebaseContext);
    // console.log('yoyo');
    const doStuff = () => {
        const postsRef = collection(firebase.firestore, 'posts');
    }
    const { posts, isLoadingPosts, fetchMore, isEnd } = useFetchPosts(firebase, loggedIn, 'posts', 2, '');
    return (
        <div className='home-page'>
            <ContenttList postList={posts} fetchMore={fetchMore} isEnd={isEnd}/>
            {/* <button style={{position: 'fixed', right: 0, top: '500px', width: '100px', height: '50px'}} onClick={doStuff}>{isLoadingPosts ? 'loading': 'yyo'}</button> */}
        </div>
    )
}

export default Home
