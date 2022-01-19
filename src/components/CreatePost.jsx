import React, { useContext } from "react";
import FirebaseContext from "./firebase/FirebaseContext";
import { useForm } from "react-hook-form";
import { FaCross, FaGoogle, FaPlus, FaTrash } from "react-icons/fa";
import { usePostUpload } from "./hooks/usePostUpload";
import { useRef, useState } from "react/cjs/react.development";
import { useNavigate } from "react-router-dom";
import SVGLoader from './SVGLoader'

const CreatePost = () => {
    const { firebase, setFirebase, loggedIn } = useContext(FirebaseContext);
    const { register, handleSubmit, formState: { errors } } = useForm({ mode: "onBlur" });
    const [dragBoxHighlight, setDragBoxHighlight] = useState(false);
    const [dragBoxDispayMessage, setDragBoxDisplayMessage] = useState("Click or drag here to upload");
    const [formData, setFormData] = useState({ post_title: '', alt_title: '', image_file: null });
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageSource, setImageSource] = useState(null);
    const [currentTag, setCurrentTag] = useState('');
    const [tagsList, setTagsList] = useState([]);
    const postTitleRef = useRef(null);
    const postAltTitleRef = useRef(null);
    const imageInputRef = useRef(null);
    const addTagRef = useRef(null);
    const changeRoute = useNavigate();
    const onUpload = () => {
        changeRoute('/your-profile');
    }
    const [isUploading, uploadPost] = usePostUpload(firebase, loggedIn, onUpload);
    const onSubmit = () => {
        const data = validateData();
        console.log(data);
        if(data)
            uploadPost(data)
        return
    }
    const validateData = () => {
        if (formData['post_title'].length === 0) {
            postTitleRef.current.focus();
            // console.log('yo');
            return null;
        }
        else if (formData['alt_title'].length === 0) {
            postAltTitleRef.current.focus();
            return null;
        }
        else if (formData.image_file === null) {
            setDragBoxDisplayMessage(<p style={{ color: "red" }}> Please Upload An Image File </p>);
            return null;
        }
        else if (tagsList.length === 0) {
            addTagRef.current.focus();
            return null;
        }
        return {
            'post_title': formData['post_title'],
            'post_alt_title': formData['alt_title'],
            'image_file': formData.image_file,
            'tags': tagsList
        }
    }

    const handleFileUpload = (e) => {
        if (e.target.files.length && e.target.files[0].type.startsWith("image/")) {
            setFormData({ ...formData, image_file: e.target.files[0] });
            setImageLoaded(false);
            setImageSource(URL.createObjectURL(e.target.files[0]))
            setDragBoxDisplayMessage("Loading...")
        }
        else {
            setDragBoxDisplayMessage(<p style={{ color: "red" }}> Please Drag An Image File </p>);
            setFormData({ ...formData, image_file: null });
        }
        setDragBoxHighlight(false);
    }
    const handleDragOver = (e) => {
        e.preventDefault();
        setDragBoxHighlight(true);
    }
    const handleDragEnd = (e) => {
        e.preventDefault();
        setDragBoxHighlight(false);
    }
    const handleTitleChange = (e, name) => {
        setFormData({...formData, [name]: e.target.value});
    }
    const handleTagChange = (e) => {
        setCurrentTag(e.target.value);
    }
    const handleAddTag = (e) => {
        const tmp = currentTag.toLowerCase();
        if (tmp.length && tagsList.find((value) => value === tmp) === undefined && tagsList.length < 5) {
            // formData.tags.push(currentTag.toLowerCase());
            setTagsList([...tagsList, tmp]);
        }
    }
    const handleTagDelete = (e, value) => {
        setTagsList(tagsList.filter(v => value !== v));
    }


    return (
        <div className="home-page">
            {   isUploading &&
                <div className="sign-in-popup-whole-window">
                    {/* <h3 style={{ color: "white" }}>Posting...</h3> */}
                    <SVGLoader />
                </div>
            }
            {
                loggedIn ?
                    <div className="create-post-container">
                        <div className="create-post-inner">
                            <div className="image-upload-container" onDragOver={handleDragOver} onDragLeave={handleDragEnd}>
                                <div className="drag-photo-container">
                                    <div className="drag-photo-inner-container" ref={imageInputRef} style={{ borderColor: dragBoxHighlight ? "tomato" : "grey" }}>
                                        {imageLoaded && <div className="image-uploaded-trash" onClick={() => { setFormData({ ...formData, image_file: null }); setImageLoaded(false); setDragBoxDisplayMessage("Click Or Drag to Upload Image To Upload") }}> <span> <FaTrash /></span></div>}
                                        <div style={{ width: "100%", position: "relative", display: "flex", justifyContent: "center", alignContent: "center" }}>
                                            {imageLoaded ? null : dragBoxDispayMessage}
                                            <img className="img-hover" onLoad={() => setImageLoaded(true)} style={imageLoaded ? { display: "block", maxWidth: "90%", maxHeight: "400px", width: "auto", height: "auto" } : { display: 'none' }} src={imageSource} alt="your file" />
                                        </div>
                                    </div>
                                </div>
                                <input type="file" name="image-upload" className="image-upload-input" onInput={handleFileUpload} accept="image/*" />
                            </div>
                            <div className="image-meta-container">
                                <input type="text" value={formData['post_title']} ref={postTitleRef} name="post-title" placeholder="Post Title" onChange={(e) => handleTitleChange(e, 'post_title')} className="post-titles post-main-title" maxLength={150} />
                                <input type="text" value={formData['alt_title']} ref={postAltTitleRef} name="alt-title" placeholder="Alt Title" onChange={(e) => handleTitleChange(e, 'alt_title')} className="post-titles post-alt-title" maxLength={200} />
                                <div className="add-tag-container">
                                    <input type="text" value={currentTag} ref={addTagRef} name="add-tag" placeholder="Tag Name" onChange={handleTagChange} className="post-tag" maxLength={25} onKeyPress={(e) => {e.key === "Enter" && handleAddTag(e)}} />
                                    <div className="add-tag-btn" onClick={handleAddTag}>Add</div>
                                </div>
                                <div className="tags-list">
                                    {tagsList.map(value => {
                                        return <TagBox key={value} tagName={value} handleTagDelete={handleTagDelete} />
                                    })}
                                </div>
                                <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                    <div className="post-btn" onClick={() => onSubmit()}>Post</div>
                                </div>
                            </div>
                        </div>

                    </div >
                    : <div className='sign-in-popup-outer-box' style={{ marginTop: '10rem' }}>
                        <div className='sign-in-popup-inner-div' onClick={() => firebase.doSignIn.bind(firebase)()}>
                            {/* <div> */}
                            <FaGoogle />
                            <p>
                                Sign In With Google To Create A Post
                            </p>
                            {/* </div> */}
                        </div>
                    </div>
            }</div>
    )
}

const TagBox = ({ tagName, handleTagDelete }) => {
    return <div className="tag-holder" style={{ backgroundColor: "#e4e5f1", color: 'black' }}><span className="tag-trash" onClick={(e) => handleTagDelete(e, tagName)}> <FaPlus /></span>{tagName}</div>

}

export default CreatePost;