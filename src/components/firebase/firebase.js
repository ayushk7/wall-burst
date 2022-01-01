import { initializeApp } from 'firebase/app'
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth'
import { getFirestore, orderBy, query } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'



class Firebase {
    constructor() {
        const firebaseConfig = {
            apiKey: "AIzaSyDsrZjXJ5n_BMrPA7W6q6AulkbyntuoFT8",
            authDomain: "fir-api-test-1dbb5.firebaseapp.com",
            projectId: "fir-api-test-1dbb5",
            storageBucket: "fir-api-test-1dbb5.appspot.com",
            messagingSenderId: "678371456656",
            appId: "1:678371456656:web:6648c5a41855fda8a74a15",
            measurementId: "G-X8VNZW2V7R"
        };

        this.app = initializeApp(firebaseConfig);
        this.auth = getAuth(this.app);
        this.firestore = getFirestore(this.app);
        this.storage = getStorage(this.app);
        this.provider = new GoogleAuthProvider();
        // this.credential = null;
        this.uid = null;
        this.displayName = null;
        this.userLikedPostsId = {};
        this.userPosts = {};
        // this.auth.onAuthStateChanged((result) => {console.log('signed state changed', result);})
    }
    doSignIn(){
        signInWithPopup(this.auth, this.provider)
            .then((result) => {
                this.credential = GoogleAuthProvider.credentialFromResult(result);
                // console.log(this.credential);
            })
            .catch((error) => {
                console.log(error);
            })
    }

}
export default Firebase;