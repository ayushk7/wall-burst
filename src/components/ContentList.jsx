import React from 'react'
import Post from './Post'
import InfiniteScroll from 'react-infinite-scroll-component'
const ContenttList = ({ postList, pushFrontChildren, loggedIn, fetchMore, isEnd, isEditSection }) => {
    return (
        <div className='content-show-list'>
            <InfiniteScroll dataLength={postList.length} 
                style={{overflow: 'initial'}}
                next={fetchMore}
                hasMore={!isEnd}
                loader={<div style={{ textAlign: 'center', padding: '1rem' }}>
                <b>Loading...</b>
            </div>}
                endMessage={
                    <div style={{ textAlign: 'center', padding: '1rem'}}>
                        <b>Yay! You have seen it all</b>
                    </div>
                }>
                {pushFrontChildren}
                {postList.map(val => (<Post postInfo={val} loggedIn={loggedIn} key={val.photoLink} isEditSection = {isEditSection} />))}
            </InfiniteScroll>
        </div>

    )
}

export default ContenttList
