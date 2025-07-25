import { updateDoc, getDoc, doc, getFirestore, addDoc, collection, getDocs, where, query, limit, orderBy, startAfter } from "firebase/firestore";
import { auth } from './config.js'
import { toast } from '../src/hooks/use-toast.ts';
import { store } from '../Redux/store'
import { setPostData, setProjectData } from "../Redux/authSlice.js";

const db = getFirestore(auth.app);

const getUserData = async (uid)=>{
  try {
    const dataRef = doc(db,'users',uid);
    const userDataSnap = await getDoc(dataRef);
    if(userDataSnap.exists()){
      const userData = userDataSnap.data();
      return userData;
    }
  } catch (error) {
    console.log(error)
  }
}

const updateUserData = async (uid, updatedData)=>{
  try {
    const userDocRef = doc(db,"users",uid);

    await updateDoc(userDocRef, updatedData);

    console.log("Updated Data Successfully")
  } catch (error) {
    console.log("Error Updating Profile data:- ",error)
  }
}

const uploadToCloudinary = async (file,uid,existingPublicId=null) =>{
  try {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('userId',uid);
    formData.append('existingPublicId',existingPublicId)
    const res = await fetch('http://localhost:5000/upload-profile', {
      method:'POST',
      body:formData,
    })

    const data = await res.json();
    console.log(data.url);
    return data.url;
  } catch (error) {
    console.log()
  }
}

const deleteProfileImage = async (uid) => {
  
  const res = await fetch('http://localhost:5000/delete-profile', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({'public_id':uid}),
  })
}

const handlePostSubmit = async (postData) =>{
  try {
    const res = await addDoc(collection(db,"posts"),{
      ...postData
    })
    if(res){
      toast({
        title: "Post Published Successfully!",
        description: "Your post has been shared with the developer community.",
        className: "bg-green-600 text-white border-green-500",
      });
      return '/feed';
    }
  } catch (error) {
    toast({
        variant:"destructive",
        title:`${error.message}`
      })
  }
}

const handleProjectSubmit = async (projectData) =>{
  try{
    const res = await addDoc(collection(db,"projects"),{
      ...projectData
    })
    if(res){
      toast({
        title: "Project Created Successfully!",
        description: "Your project has been added to your portfolio.",
        className: "bg-green-600 text-white border-green-500",
      });
      return '/projects';
    }
  }catch(error){
    toast({
        variant:"destructive",
        title:`${error.message}`
      })
  }
}

const getPosts = async (limitCount = 5, startAfterDoc = null) => {
  try {
    const postsRef = collection(db, "posts");

    let q = query(postsRef, orderBy("time", "desc"), limit(limitCount));
    if (startAfterDoc) {
      q = query(postsRef, orderBy("time", "desc"), startAfter(startAfterDoc), limit(limitCount));
    }

    const snapshot = await getDocs(q);
    const posts = snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }));

    const lastVisible = snapshot.docs[snapshot.docs.length - 1];

    store.dispatch(setPostData(posts));

    return { posts, lastVisible };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { posts: [], lastVisible: null };
  }
};

const getUserPostCount = async (uid) => {
  const postsRef = collection(db, "posts");
  const q = query(postsRef, where("id", "==", uid));
  const snapshot = await getDocs(q);
  return snapshot.size;
};

const getUserProjectCount = async (uid) => {
  const projectsRef = collection(db, "projects");
  const q = query(projectsRef, where("uid", "==", uid));
  const snapshot = await getDocs(q);
  return snapshot.size;
};

const getProjects = async ()=>{
  try {
    const projectsRef = collection(db,"projects");
    const projectSnap = await getDocs(projectsRef);
    if(!projectSnap.empty){
      const projects = projectSnap.docs.map(doc =>({...doc.data()}));
      store.dispatch(setProjectData(projects))
      return projects;
    }
  } catch (error) {
    console.log(error);
  }
}

const getUsers = async ()=>{
  const dataRef = collection(db,'users');
  const userDataSnap = await getDocs(dataRef);
  if(!userDataSnap.empty){
    const users = userDataSnap.docs.map(doc =>({...doc.data()}));
    return users;
  }else{
    return [];
  }
}

export {getUserData, getUsers, updateUserData, uploadToCloudinary, deleteProfileImage, handlePostSubmit, getPosts, getProjects, getUserPostCount, getUserProjectCount, handleProjectSubmit}