import React, { useContext, useEffect } from 'react'
import { ShowNotifsContext } from '../App'
import FirebaseContext from './firebase/FirebaseContext'
import { useFetchNotifs } from './hooks/useFetchPosts'
import InfiniteScroll from 'react-infinite-scroll-component'

const NotifsList = () => {
    const { firebase, setFirebase, loggedIn } = useContext(FirebaseContext);
    const { showNotif, setShowNotif } = useContext(ShowNotifsContext);
    const { notifs, isLoadingNotifs, fetchMore, isEnd } = useFetchNotifs(firebase, showNotif, `users/${firebase.uid}/notifs`, 10, '');
    useEffect(() => {
        setShowNotif(false);
        return () => {
        }
    }, [loggedIn])
    return ( 
        showNotif &&
        <InfiniteScroll dataLength={notifs.length}
            style={{ overflow: 'initial' }}
            next={fetchMore}
            className='notifs-container'
            hasMore={!isEnd}
            loader={<div style={{ textAlign: 'center', padding: '1rem' }}>
                <b>Loading...</b>
            </div>}
            endMessage={
                <p style={{textAlign: 'center', paddingBottom: '1rem', fontSize: 'small'}}>
                    That's All You Got
                </p>
            }>
            {notifs.map(notif => <Notif notif={notif} onClick={() => setShowNotif(false)}/>)}
        </InfiniteScroll>
    )
}
const Notif = ({ notif, onClick }) => {
    console.log(notif);
    return (
        <div className='notif' onClick={onClick}>
            {notif['message']}
        </div>
    )
}


export default NotifsList

// const ListNotifs = () => {
//     const { firebase, setFirebase, loggedIn } = useContext(FirebaseContext);
//     const { showNotif, setShowNotif } = useContext(ShowNotifsContext);
//     const { notifs, isLoadingNotifs, fetchMore, isEnd } = useFetchNotifs(firebase, showNotif, `users/${firebase.uid}/notifs`, 10, '');
    
//     return ( <Menu
//         anchorEl={anchorEl}
//         anchorOrigin={{
//             vertical: 'top',
//             horizontal: 'right',
//         }}
//         id={menuId}
//         keepMounted
//         transformOrigin={{
//             vertical: 'top',
//             horizontal: 'right',
//         }}
//         open={isMenuOpen}
//         onClose={() => setAnchorEl(null)}
//     >

//         {}
//     </Menu>)
// };