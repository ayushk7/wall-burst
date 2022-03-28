import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Link, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import EditSection from './components/EditSection';
import Firebase from './components/firebase/firebase';
import { useState, useEffect } from 'react';
import FirebaseContext from './components/firebase/FirebaseContext';
import { addDoc, collection, setDoc, doc, Timestamp, getDoc } from 'firebase/firestore'
import SignInPopup from './components/SignInPopup';
import { createContext } from 'react/cjs/react.development';
import CreatePost from './components/CreatePost';
import { searchQueryAtom, signInPoputAtom } from './components/atom';
import { useAtom } from 'jotai';
export const SignInWithPopupContext = createContext(null);
export const QueryContext = createContext(null);
function App() {
  const [firebase, setFirebase] = useState(new Firebase());
  const [loggedIn, setLoggedIn] = useState(firebase.auth.currentUser ? true : false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [showSingInWithPopup, setSignInWithPopUp] = useAtom(signInPoputAtom);
  const [showNotif, setShowNotif] = useState(false);
  // const [queryType, setQueryType] = useState({ location: 'posts', limit: 2, isTagged: false, tag: null });
  const [queryType, setQueryType] = useAtom(searchQueryAtom);

  useEffect(() => {
    const unsubscribe = firebase.auth.onAuthStateChanged((result) => {
      console.log('signed state changed', result);
      if (!firebase.auth.currentUser) {
        firebase.userLikedPostsId = {};
        firebase.userPosts = {};
      }
      setLoggedIn(firebase.auth.currentUser ? true : false);
      firebase.uid = firebase.auth.currentUser ? result.uid : null;
      firebase.displayName = firebase.auth.currentUser ? result.displayName : null;
      const manageUser = async () => {
        await setDoc(doc(firebase.firestore, 'users', `${result.uid}`), {
          lastSignedIn: Timestamp.now()
        })
      }
      if (firebase.auth.currentUser) {
        manageUser()
        setSignInWithPopUp(false);
        setIsLoadingData(true);
        fetchPostsLikedByUser(firebase, { isLoadingData, setIsLoadingData });
      }
    });

    return () => {
      return unsubscribe;
    }
  }, [])
  return (
    <FirebaseContext.Provider value={{ firebase, setFirebase, loggedIn, setLoggedIn, isLoadingData }}>
      <Router>
          <SignInWithPopupContext.Provider value={{ showSingInWithPopup, setSignInWithPopUp }}>
            <Navbar />
            <SignInPopup />
            <QueryContext.Provider value={{ queryType, setQueryType }}>
              <Routes>
                <Route exact path='/' element={<Home />} />
                <Route exact path='/your-profile' element={<EditSection />} />
                <Route exact path='/create-post' element={<CreatePost />} />
              </Routes>
            </QueryContext.Provider>
          </SignInWithPopupContext.Provider>
      </Router>
    </FirebaseContext.Provider>
  );
}

export default App;
export function fetchPostsLikedByUser(firebase, { isLoadingData, setIsLoadingData }) {
  const fetchUserLikedPosts = async () => {
    const userLikesRef = doc(firebase.firestore, 'user_likes', `${firebase.uid}`);
    try {
      const data = await getDoc(userLikesRef);
      if (data.exists())
        firebase.userLikedPostsId = data.data();
      else firebase.userLikedPostsId = {}
      // console.log(firebase.userLikedPostsId);
      setIsLoadingData(false);
    }
    catch (err) {
      console.log(err);
    }
  };
  if (firebase.auth.currentUser) {
    fetchUserLikedPosts();
  }
}

