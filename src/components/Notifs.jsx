import React, { useContext, useEffect } from 'react'
import { useFetchNotifs } from './hooks/useFetchPosts'
import MenuDropDown from './MenuDropDown'

const NotifsList = () => {
    const { notifs, isLoadingNotifs, fetchMore, isEnd } = useFetchNotifs(firebase, showNotif, `users/${firebase.uid}/notifs`, 10, '');
    useEffect(() => {
        setShowNotif(false);
        return () => {
        }
    }, [loggedIn])
    const clickHandler = () => {
        setShowNotif(false);
    }
    return ( 
        showNotif &&
            <MenuDropDown items={notifs.map(notif => {return {title: `${notif['message']} on ${notif['time']}`, clickHandler}})} anchorEl={} />
    )
}

export default NotifsList

