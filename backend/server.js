import cloudinary from "./cloudinary.js";
import express from "express";
import multer from "multer";
import fs from 'fs';
import cors from 'cors';
import { admin, db } from './firebase.js'
import { createServer } from "http";
import { Server } from "socket.io";
import { extractPublicId } from 'cloudinary-build-url';

const app = express();
const server = createServer(app);
const io = new Server(server,{
    cors:{origin:'*'}
});
const upload = multer({dest: 'uploads/'});

app.use(cors());    
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

io.on("connection",(socket)=>{
    socket.on("sendComment",async(data)=>{
        const {author,avatar,username,content,userId,authorId,postId} = data;
        const createdAt = Date.now();
        const commentObj = {author,avatar, username, content, userId,authorId, postId, createdAt};
        const commRef = await db.collection('users').doc(userId).collection('posts').doc(postId).collection('comments').add(commentObj);
        await db.collection('users').doc(userId).collection('posts').doc(postId).update({comment:admin.firestore.FieldValue.arrayUnion(commRef.id)});
        
        io.emit("receiveComment",{
            commId: commRef.id,author,avatar,username,createdAt,content, likes:[], userId, postId, authorId
        });
    });
});

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

//Delete Project
app.post('/delete-project',async(req,res)=>{
    const { id, uid } = req.body;
    try {
        await db.collection('users').doc(uid).collection('projects').doc(id).delete();
        await db.collection('users').doc(uid).update({projects: admin.firestore.FieldValue.arrayRemove(id)})
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.json({message:error.message});
    }
})

//Get All Users
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
            res.json(data.docs.map(doc =>({id: doc.id,...doc.data()})));
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
    const posts1 = snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }))
    const sortedPosts = posts1.slice().sort((a, b) => {
        const dateA = new Date(a.createdAt._seconds * 1000 + a.createdAt._nanoseconds / 1e6);
        const dateB = new Date(b.createdAt._seconds * 1000 + b.createdAt._nanoseconds / 1e6);
        return dateB.getTime() - dateA.getTime(); // newest → oldest
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
    const { docId, uid, imageUrls } = req.body;
    try {
        await db.collection('users').doc(uid).collection('posts').doc(docId).delete();
        await db.collection('users').doc(uid).update({posts: admin.firestore.FieldValue.arrayRemove(docId)});
        const public_ids = imageUrls.map((img)=>{return extractPublicId(img)});
        cloudinary.uploader.destroy(public_ids); 
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

//Get-commments
app.get('/get-comments',async(req,res)=>{
    const { postId, userId } = req.query;
    try {
        const data = await db.collection('users').doc(userId).collection('posts').doc(postId).collection('comments').get();
        if(!data.empty){
            const comments = data.docs.map(doc =>({commId: doc.id, ...doc.data()}));
            const sortedPosts = comments.slice().sort((a, b) => {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
                return dateB.getTime() - dateA.getTime(); // newest → oldes
                });
            res.json(sortedPosts);
        }else{
            res.json({});
        }
    } catch (error) {
        console.error(error);
    }
})

//Like Comment
app.post('/like-comment',async(req,res)=>{
    const { userId, postOwnerId, postId, commId, alreadyLiked} = req.body;
    try {
        const commentRef = db.collection('users').doc(postOwnerId).collection('posts').doc(postId).collection('comments').doc(commId);
        if(alreadyLiked){
            await commentRef.update({likes: admin.firestore.FieldValue.arrayRemove(userId)});
            res.json({ message: 'Comment unliked successfully' });
        }else{
            await commentRef.update({likes: admin.firestore.FieldValue.arrayUnion(userId)});
            res.json({ message: 'Comment liked successfully' });
        }
    } catch (error) {
        res.json({message:error.message});
    }
})

//Delete Comment
app.post('/delete-comment',async(req,res)=>{
    const {commId, postId, postOwnerId} = req.body;
    try{
        await db.collection('users').doc(postOwnerId).collection('posts').doc(postId).collection('comments').doc(commId).delete();
        await db.collection('users').doc(postOwnerId).collection('posts').doc(postId).update({comment:admin.firestore.FieldValue.arrayRemove(commId)});
        res.json({ message: 'Comment deleted successfully' });
    }catch(error){
        res.json({message:error.message});
    }
})

//Delete User References after deleting account
app.post('/delete-user-references', async(req,res)=>{
    const { uid } = req.body;
    const userSnapShot = await db.collection('users').get();
    const bulkWriter = db.bulkWriter();
    for (const doc of userSnapShot.docs){
        const userRef = doc.ref;
        const data = doc.data();
        if(data.followers?.includes(uid)){
            bulkWriter.update(userRef,{
                followers: admin.firestore.FieldValue.arrayRemove(uid)
            });
        }
        if(data.following?.includes(uid)){
            bulkWriter.update(userRef,{
                following: admin.firestore.FieldValue.arrayRemove(uid)
            });
        }
        if(data.likes?.includes(uid)){
            bulkWriter.update(userRef,{
                likes: admin.firestore.FieldValue.arrayRemove(uid)
            })
        }
        const postSnapShot = await userRef.collection('posts').get();
            for(const postDoc of postSnapShot.docs){
            const commentRef = postDoc.ref.collection('comments');
            const commentSnapShots = await commentRef.where('authorId','==',uid).get();
            for(const commentDoc of commentSnapShots.docs){
                bulkWriter.update(postDoc.ref,{comment: admin.firestore.FieldValue.arrayRemove(commentDoc.id)});
                bulkWriter.delete(commentDoc.ref);
            }
        }
    }
    await bulkWriter.close().then(()=>{
        res.json({ message: 'User references deleted successfully' });
    }).catch((error)=>{
        res.json({message:error.message});
    })
})

//Edit Project
app.post('/edit-project',async (req,res)=>{
    const {uid, projectId, updatedData } = req.body;
    try {
        await db.collection('users').doc(uid).collection('projects').doc(projectId).update(updatedData);
        res.json({ message: 'Project updated successfully' });
    } catch (error) {
        res.json({message:error.message});
    }
})


server.listen(5000,()=>console.log('Server running on port 5000'));