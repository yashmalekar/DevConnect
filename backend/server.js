import cloudinary from "./cloudinary.js";
import express from "express";
import multer from "multer";
import fs from 'fs';
import cors from 'cors';
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const app = express();
const upload = multer({dest: 'uploads/'});
const firebaseConfig = {
    apiKey: process.env.APIKEY,
    authDomain: process.env.AUTHDOMAIN,
    projectId: process.env.PROJECTID,
    storageBucket: process.env.STORAGEBUCKET,
    messagingSenderId: process.env.MESSAGINGSENDERID,
    appId: process.env.APPID,
    measurementId: process.env.MEASUREMENTID
}
const app1 = initializeApp(firebaseConfig);
const db = getFirestore(app1);

app.use(cors());    
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/upload-profile',upload.single('image'),async(req,res)=>{
    const file = req.file;
    const { userId } = req.body;

    try {
        const result = await cloudinary.uploader.upload(file.path, {
            public_id: `profiles/profile_${userId}`,
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

app.post('/delete-profile',async(req,res)=>{
    const { public_id } = req.body;
    try {
        await cloudinary.uploader.destroy(public_id);
        res.json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Delete failed', error: err.message });
    }
})

// app.get('/get-users',async (req,res)=>{
//     try {
//         const dataRef = collection(db,'users');
//         const userDataSnap = await getDocs(dataRef);
//         if(!userDataSnap.empty){
//             const users = userDataSnap.docs.map(doc =>({...doc.data()}));
//             res.json(users);
//         }else{
//             res.json([]);
//         }
//     } catch (error) {
//         console.error(error);
//     }
// })

app.listen(5000,()=>console.log('Server running on port 5000'));