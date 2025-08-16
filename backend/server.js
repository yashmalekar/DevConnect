import cloudinary from "./cloudinary.js";
import express from "express";
import multer from "multer";
import fs from 'fs';
import cors from 'cors';
import { admin, db } from './firebase.js'

const app = express();
const upload = multer({dest: 'uploads/'});

app.use(cors());    
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Upload-profileImage
app.post('/upload-profile',upload.single('image'),async(req,res)=>{
    const file = req.file;
    const { userId } = req.body;

    try {
        const result = await cloudinary.uploader.upload(file.path, {
            public_id: `profiles/profile_${userId}`,
            folder:'posts',
            overwrite: true
        });

        fs.unlinkSync(file.path);

        res.json({
            url: result.secure_url,
            public_id: result.public_id,
            message: 'Image uploaded successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Upload failed', error: err.message });
    }
})

//Delete ProfileImage
app.post('/delete-profile',async(req,res)=>{
    const { public_id } = req.body;
    try {
        await cloudinary.uploader.destroy(`profiles/${public_id}`);
        res.json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Delete failed', error: error.message });
    }
})

//Update User Data
app.post('/update-userData',async(req,res)=>{
    const updatedData = req.body;
    const { uid } = req.query;
    try {
        await db.collection('users').doc(uid).update(updatedData);
        res.json({ message: 'Data updated successfully' });
    } catch (error) {
        console.error(error);
    }
})

//Create Post
app.post('/create-post',async(req,res)=>{
    const postData = req.body;
    const userId = postData.uid;
    try {
        const ref = await db.collection('users').doc(userId).collection('posts').add({...postData,createdAt: admin.firestore.FieldValue.serverTimestamp()});
        await db.collection('users').doc(userId).update({posts: admin.firestore.FieldValue.arrayUnion(ref.id)})
        res.json({ message: 'Post created successfully' });
    } catch (error) {
        res.json({message:error.message});
    }
})

//Create Project
app.post('/create-project',async(req,res)=>{
    const projectData = req.body;
    const { userId } = req.query;
    try {
        const ref = await db.collection('users').doc(userId).collection('projects').add(projectData);
        await db.collection('users').doc(userId).update({projects: admin.firestore.FieldValue.arrayUnion(ref.id)})
        res.json({ message: 'Project created successfully' });
    } catch (error) {
        console.log(error);
    }
})

//Get Users
app.get('/get-users', async(req,res)=>{
    try {
        const data = await db.collection('users').get();
        if(!data.empty){
            res.json(data.docs.map(doc =>({...doc.data()})));
        }else{
            res.json([]);
        }
    } catch (error) {
        console.error(error);
    }
})

//Get User Data of specific user
app.get('/get-userData', async(req,res)=>{
    const { uid } = req.query;
    try {
        const data = await db.collection('users').doc(uid).get();
        if(data.exists){
            res.json(data.data());
        }else{
            res.json({});
        }
    } catch (error) {
        console.error(error);
    }
})

//Get Projects
app.get('/get-projects', async(req,res)=>{
    try {
        const data = await db.collectionGroup('projects').get();
        if(!data.empty){
            res.json(data.docs.map(doc =>({dodId: doc.id,...doc.data()})));
        }else{
            res.json([]);
        }
    } catch (error) {
        console.error(error);
    }
})

//Get Posts
app.get('/get-posts', async (req,res) => {
    const posts = db.collectionGroup('posts')
    const snapshot = await posts.get();
    const posts1 = snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }));
    const sortedPosts = posts1.sort((a, b) => {
        const getMillis = (ts) => {
            if (!ts) return 0;
            if (typeof ts.toMillis === 'function') return ts.toMillis();
            if (ts instanceof Date) return ts.getTime();
            if (typeof ts === 'string') return new Date(ts).getTime();
            return 0;
        };
        return getMillis(a.createdAt) - getMillis(b.createdAt); // descending
        });
    res.json(sortedPosts);
})

//Handle Likes
app.post('/like-post',async(req,res)=>{
    const { postId, userId: uid, postOwnerId, liked } = req.body;
    const update = liked
      ? { likes: admin.firestore.FieldValue.arrayRemove(uid) }
      : { likes: admin.firestore.FieldValue.arrayUnion(uid) };
    try {
        await db.collection('users').doc(postOwnerId).collection('posts').doc(postId).update(update);
        liked ? res.json({ message: 'Post unliked successfully' }) : res.json({ message: 'Post liked successfully' });
    } catch (error) {
        res.json({message:error.message});
    }
})

//Handle followers
app.post('/follow', async (req, res) => {
  const { targetUid, followerUid, following } = req.body;
  try {
    const targetRef = db.collection('users').doc(targetUid);   // The user being followed
    const followerRef = db.collection('users').doc(followerUid); // The user doing the follow

    if (following) {
      // Already following → so UNFOLLOW
      await targetRef.update({
        followers: admin.firestore.FieldValue.arrayRemove(followerUid),
      });
      await followerRef.update({
        following: admin.firestore.FieldValue.arrayRemove(targetUid),
      });
    } else {
      // Not following → so FOLLOW
      await targetRef.update({
        followers: admin.firestore.FieldValue.arrayUnion(followerUid),
      });
      await followerRef.update({
        following: admin.firestore.FieldValue.arrayUnion(targetUid),
      });
    }

    res.json({ message: following ? 'Unfollowed' : 'Followed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Handle Edit Post
app.post('/edit-post',async(req,res)=>{
    const { docId, updatedData } = req.body;
    try {
        await db.collection('users').doc(updatedData.uid).collection('posts').doc(docId).update(updatedData);
        res.json({ message: 'Post updated successfully' });
    } catch (error) {
        res.json({message:error.message});
    }
})

//Delete Post
app.post('/delete-post',async(req,res)=>{
    const { docId, uid } = req.body;
    try {
        await db.collection('users').doc(uid).collection('posts').doc(docId).delete();
        await db.collection('users').doc(uid).update({posts: admin.firestore.FieldValue.arrayRemove(docId)});
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.json({message:error.message});
    }
})

//Upload Post image
app.post('/upload-post-image',upload.array('images'),async(req,res)=>{
    const {userId} = req.body
    const images = req.files;
    try {
        const results = [];
        for(const image of images){
            const result = await cloudinary.uploader.upload(image.path, {
                public_id: `image_${userId}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                folder:'posts',
                overwrite: true
            });
            results.push({
                url: result.secure_url,
                public_id: result.public_id,
            });
            fs.unlinkSync(image.path);
        }

        res.json({
            uploads :results,
            message: 'Image uploaded successfully'
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Upload failed', error: error.message });
    }
})

//Delete Post Image
app.post('/delete-post-image',async(req,res)=>{
    const { public_id } = req.body;
    try {
        await cloudinary.uploader.destroy(`posts/${public_id}`);
        res.json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Delete failed', error: error.message });
    }
})

app.listen(5000,()=>console.log('Server running on port 5000'));