import React, { useState } from 'react'
import ContenttList from './ContentList';
import FirebaseContext from './firebase/FirebaseContext';
import { useContext, useEffect, useRef } from 'react/cjs/react.development';
import { useFetchPosts } from './hooks/useFetchPosts';
import { useFetchTags } from './hooks/useFetchPosts';
import { useForm } from 'react-hook-form';
import { FaSearch } from 'react-icons/fa';
import { QueryContext } from '../App';
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
    const { firebase, setFirebase, loggedIn } = useContext(FirebaseContext);
    // console.log('yoyo');
    const {queryType, setQueryType} = useContext(QueryContext);
    // const [queryType, setQueryType] = useState({ location: 'posts', limit: 2, isTagged: false, tag: null });
    const { posts, isLoadingPosts, fetchMore, isEnd } = useFetchPosts(firebase, loggedIn, queryType);
    const { tags, isLoadingTags, fetchMoreTags, tagsEnd } = useFetchTags(firebase, loggedIn, 'tags', 100);
    return (
        <>
            <div className='home-page'>
                <ContenttList postList={posts} fetchMore={fetchMore} isEnd={isEnd} />
                {/* <button style={{position: 'fixed', right: 0, top: '500px', width: '100px', height: '50px'}} onClick={doStuff}>{isLoadingPosts ? 'loading': 'yyo'}</button> */}
            </div>
            <div className='tags-container'>
                <SearchBar setQueryType={setQueryType} queryType={queryType}/>
                {isLoadingTags && <Tag tagInfo={{ id: "Loading..." }}></Tag>}
                {queryType.isTagged && <TopTag msg={queryType.tag} setQueryType={setQueryType} queryType={queryType}></TopTag>}
                {tags.map(value => <Tag tagInfo={value} setQueryType={setQueryType} queryType={queryType} key={value.id}></Tag>)}
            </div>
        </>

    )
}

const Tag = ({ tagInfo, setQueryType, queryType }) => {
    return <div className='tag-style' onClick={() => setQueryType({ ...queryType, isTagged: true, tag: tagInfo.id })}>{`${tagInfo.id}`}</div>
}
const TopTag = ({ msg, setQueryType, queryType }) => {
    return <div className='tag-style top-tag' onClick={() => { setQueryType({ ...queryType, isTagged: false, tag: null }) }}>{`clear ${msg}`}</div>
}

const SearchBar = ({setQueryType, queryType}) => {
    const { register, handleSubmit } = useForm();
    const onSubmit = (data) => {
        console.log(data);
        setQueryType({ ...queryType, isTagged: true, tag: data['search-content'].toLowerCase() })
    }
    return (
        <div className='search-bar-container'>
            <form className='search-inner-container' onSubmit={handleSubmit(onSubmit)}>
                <input {...register("search-content")} type="text" name="search-content" id="search-content-bar" placeholder='Search By Tag...' />
                <button className='search-icon-container' type="submit"><label htmlFor="search-content"> <FaSearch size={"20px"} /></label></button>
            </form>
        </div>
    )
}

export default Home
