import React from "react";
import { useState } from "react/cjs/react.development";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, increment, Timestamp, runTransaction } from "firebase/firestore";

export const usePostUpload = (firebase, loggedIn, onUpload) => {
    const [isUploading, setIsUploading] = useState(false);

    const uploadPost = (data) => {
        setIsUploading(true);
        const ctime = Date.now();
        const imageRef = ref(firebase.storage, `images/${firebase.uid}/${ctime}`);
        uploadBytes(imageRef, data['image_file'])
            .then(snapshot => {
                console.log("file uploaded", snapshot);
                return getDownloadURL(imageRef)
            })
            .then(downloadURL => {
                console.log(downloadURL);
                const updatePost = async (transaction) => {
                    // const batch = writeBatch(firebase.firestore);
                    const assignedID = `${firebase.uid}-${ctime}`
                    const notExistsTags = [];
                    for (let tag of data['tags']) {
                        const tagDoc = await transaction.get(doc(firebase.firestore, 'tags', tag));
                        if (!tagDoc.exists()) {
                            notExistsTags.push(tag);
                        }
                    }
                    transaction.set(doc(firebase.firestore, 'posts', assignedID), {
                        postTitle: data['post_title'],
                        postAltTitle: data['post_alt_title'],
                        photoLink: downloadURL,
                        uid: firebase.uid,
                        lastEdited: Timestamp.now(),
                        postedBy: firebase.displayName,
                        tags: data['tags'],
                        store_id: ctime,
                        // likeCount: collection(firebase.firestore, 'posts', `${firebase.uid}-${Date.now()}`, 'xmas')
                    })
                    transaction.set(doc(firebase.firestore, 'likes', assignedID), {
                        count: 0
                        // likeCount: collection(firebase.firestore, 'posts', `${firebase.uid}-${Date.now()}`, 'xmas')
                    })

                    for (let tag of notExistsTags) {
                        transaction.set(doc(firebase.firestore, 'tags', tag), {
                            count: 0,
                        })
                    }
                    for (let tag of data['tags']) {
                        transaction.update(doc(firebase.firestore, 'tags', tag), {
                            count: increment(1),
                        });
                    }
                }
                return runTransaction(firebase.firestore, updatePost);
            })
            .then(_ => {
                console.log("posted")
                setIsUploading(false);
                onUpload();
            })
            .catch(err => {
                console.log(err);
                setIsUploading(false);
            })

    }
    return [isUploading, uploadPost];
}