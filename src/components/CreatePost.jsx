import React, {useContext} from "react";
import FirebaseContext from "./firebase/FirebaseContext";
import { useForm } from "react-hook-form";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, Timestamp, writeBatch } from "firebase/firestore";
const CreatePost = () => {
    const { firebase, setFirebase, loggedIn } = useContext(FirebaseContext);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = (data) => {
        // console.log(data);
        const imageRef = ref(firebase.storage, `images/${firebase.uid}/${firebase.uid}-${data["create-post-upload-image"][0].name}`);
        // console.log(imageRef);
        uploadBytes(imageRef, data["create-post-upload-image"][0])
            .then(snapshot => {
                console.log("file uploaded", snapshot);
                return getDownloadURL(imageRef)

            })
            .then(downloadURL => {
                console.log(downloadURL);
                const updatePost = () => {
                    const batch = writeBatch(firebase.firestore);
                    const assignedID = `${firebase.uid}-${Date.now()}`
                    batch.set(doc(firebase.firestore, 'posts', assignedID), {
                        title: data["create-post-title"],
                        photoLink: downloadURL,
                        uid: firebase.uid,
                        lastEdited: Timestamp.now(),
                        postedBy: firebase.displayName,
                        // likeCount: collection(firebase.firestore, 'posts', `${firebase.uid}-${Date.now()}`, 'xmas')
                    })
                    batch.set(doc(firebase.firestore, 'likes', assignedID), {
                        count: 0
                        // likeCount: collection(firebase.firestore, 'posts', `${firebase.uid}-${Date.now()}`, 'xmas')
                    })
                    return batch.commit();
                }
                return updatePost();
            })
            .then(res => {
                console.log('posted');
            })
            .catch(err => {
                console.log(err);
            })
        // console.log(errors);
    }

    return (
        <div className='create-post-container'>
            <div className='create-post-inner-container'>
                <form className='create-post-form' onSubmit={handleSubmit(onSubmit)}>
                    <div className='create-post-input-container'>
                        <label htmlFor="create-post-title">Title: </label>
                        <input {...register("create-post-title", { required: true, maxLength: 200 })} type="text" name="create-post-title" id="create-post-title" />
                    </div>
                    <div className='create-post-input-container'><label htmlFor="create-post-upload-image">Image: </label>
                        <input {...register("create-post-upload-image", { required: true })} type="file" name="create-post-upload-image" id="create-post-upload-image" accept="image/*" />
                    </div>
                    <div className='create-post-input-container' id="submit-post-btn"><input type="submit" value="Post" />
                    </div>
                </form>
            </div>
        </div>
    )
}
export default CreatePost;