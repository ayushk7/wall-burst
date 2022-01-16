import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
const TagsList = ({ tagList, pushFrontChildren, loggedIn, fetchMore, isEnd }) => {
    return (
        <InfiniteScroll dataLength={tagList.length}
            style={{ overflow: 'initial' }}
            next={fetchMore}
            hasMore={!isEnd}
            className='tags-container'
            loader={<div style={{ textAlign: 'center', padding: '1rem' }}>
                <b>Loading...</b>
            </div>}
            endMessage={
                <div style={{ textAlign: 'center', padding: '1rem' }}>
                    <i>No More Tags</i>
                </div>
            }>
            {pushFrontChildren}
            {tagList.map(val => (<Tag tagInfo={val} key={val.id} />))}
        </InfiniteScroll>

    )
}

const Tag = ({ tagInfo, key }) => {
    return <div>{`${tagInfo.id}-${tagInfo.count}`}</div>
}

export default TagsList