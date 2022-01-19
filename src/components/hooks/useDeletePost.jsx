import React from "react";
import { useState } from "react";
import {ref, deleteObject, uploadBytes} from 'firebase/storage';
import {doc, increment, Timestamp, runTransaction, Transaction} from 'firebase/firestore';

export const useDeletePost = (firebase, loggedIn, onDelete) => {
    
    const [isDeleting, setIsDeleting] = useState(false);

    const deletePost = (created_at, image_id, tags) => {
        setIsDeleting(true);
        const imageRef = ref(firebase.storage, `images/${firebase.uid}/${created_at}`);
        deleteObject(imageRef)
            .then(() => {
                console.log("file deleted");
                return Promise.resolve();
            })
            .then(() => {
                const updateDB = async (transaction) => {
                    // const batch = writeBatch(firebase.firestore);
                    const assignedID = image_id;
                    transaction.delete(doc(firebase.firestore, 'posts', assignedID));
                    transaction.delete(doc(firebase.firestore, 'likes', assignedID));
                    for (let tag of tags) {
                        transaction.update(doc(firebase.firestore, 'tags', tag), {
                            count: increment(-1),
                        });
                    }
                }
                return runTransaction(firebase.firestore, updateDB);
            })
            .then(_ => {
                console.log("deleted")
                setIsDeleting(false);
                onDelete();
            })
            .catch(err => {
                console.log(err);
                setIsDeleting(false);
            })

    }
    return [isDeleting, deletePost];
}