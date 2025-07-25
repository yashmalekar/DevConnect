import { initializeApp } from "firebase/app";
import { getAuth, GithubAuthProvider, GoogleAuthProvider , signInWithPopup, createUserWithEmailAndPassword , signInWithEmailAndPassword, deleteUser, EmailAuthProvider, reauthenticateWithCredential, setPersistence, browserLocalPersistence, reauthenticateWithPopup } from 'firebase/auth'
import { setUser } from '../Redux/authSlice'
import { store } from '../Redux/store'
import { deleteDoc, doc, getDoc, getFirestore, setDoc } from 'firebase/firestore'
import bcrypt from 'bcryptjs'
import { toast } from "../src/hooks/use-toast";

const firebaseConfig = {
  apiKey: "AIzaSyDvdgL6-zePFf1Q4RvOTlJEr9X-jjF3FH4",
  authDomain: "devconnect-27473.firebaseapp.com",
  projectId: "devconnect-27473",
  storageBucket: "devconnect-27473.firebasestorage.app",
  messagingSenderId: "51021702420",
  appId: "1:51021702420:web:c6ee2d7f29b8f885490e01",
  measurementId: "G-NSTG1JQPBV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app);
const githubProvider = new GithubAuthProvider();
const googleAuthProvider = new GoogleAuthProvider();

//Handle Email and Password Login
const handleEmailLogin = async (email,password)=>{
  try {
    await setPersistence(auth, browserLocalPersistence);
    const userCred = await signInWithEmailAndPassword(auth,email,password);
    store.dispatch(setUser(userCred.user));
    return userCred;
  } catch (error) {
    console.log(error);
  }
}

const handleGoogleAuthLogin = async ()=>{
  try {
    await setPersistence(auth, browserLocalPersistence);
    const userCred = await signInWithPopup(auth, googleAuthProvider);
    const user = userCred.user
    const dataRef = doc(db,'users',user.uid);
    const userDataSnap = await getDoc(dataRef);
    if(!userDataSnap.exists()){
      await setDoc(doc(db,'users',user.uid),{
        uid: user.uid,
        profilePicture: user.photoURL,
        firstName: user.reloadUserInfo.displayName.split(" ")[0],
        lastName : user.reloadUserInfo.displayName.split(" ")[1],
        email: user.email,
        username : user.reloadUserInfo.displayName.toLowerCase().replace(" ",""),
        bio: "",
        location: "",
        jobTitle:"",
        company: "",
        experience:"",
        githubUrl:'',
        linkedinUrl:"",
        portfolioUrl:"",
        agreeToTerms:true,
        skills:[]
      })
    }
    return userCred;
  } catch (error) {
    toast({
      variant: "destructive",
      title: "Unable to Sign In with Google",
      description: `${error.message}`
    });
  }
}

//Handle Github Login
const handleGithubLogin = async ()=>{
  try {
    await setPersistence(auth, browserLocalPersistence);
    const userCred = await signInWithPopup(auth,githubProvider);
    const credential = GithubAuthProvider.credentialFromResult(userCred);
    const accessToken = credential.accessToken;

const githubUserRes = await fetch('https://api.github.com/user', {
  headers: {
    Authorization: `token ${accessToken}`
  }
});

const githubUser = await githubUserRes.json();
    store.dispatch(setUser(userCred.user));
    const user = userCred.user;
    const dataRef = doc(db,'users',user.uid);
    const userDataSnap = await getDoc(dataRef);
    if(!userDataSnap.exists()){
      const [firstName, ...rest] = user.displayName.split(" ");
      const lastName = rest.length > 0 ? rest: "";
      await setDoc(doc(db,"users",user.uid),{
        uid: user.uid,
        profilePicture: user.photoURL,
        firstName,
        lastName,
        email: user.email,
        username : user.reloadUserInfo.screenName,
        bio: githubUser.bio,
        location: githubUser.location,
        jobTitle:"",
        company: githubUser.company,
        experience:"",
        githubUrl:`https://github.com/${user.screenName}`,
        linkedinUrl:"",
        portfolioUrl:"",
        agreeToTerms:true,
        skills:[]
      })
    }
    return userCred;
  } catch (error) {
    console.log(error);
    toast({
      variant: "destructive",
      title: "Unable to Sign In with Github",
      description: `${error.message}`
    });
  }
}

const handleEmailSignUp = async (formData)=>{
  const {firstName, lastName, email, password, confirmPassword, username, bio, location, jobTitle, company, experience, githubUrl, linkedinUrl, portfolioUrl, profilePicture, agreeToTerms, skills} = formData;
  try{
    await setPersistence(auth, browserLocalPersistence);
    const userCred = await createUserWithEmailAndPassword(auth,email,password);
    const user = userCred.user;
    const hashedPass = await bcrypt.hash(password,12);
    const hashedConfPass = await bcrypt.hash(confirmPassword,12);
    await setDoc(doc(db,"users",user.uid),{
      uid: user.uid,
      profilePicture,
      firstName,
      lastName,
      email,
      hashedPass,
      hashedConfPass,
      username,
      bio,
      location,
      jobTitle,
      company,
      experience,
      githubUrl,
      linkedinUrl,
      portfolioUrl,
      agreeToTerms,
      skills
    })
    store.dispatch(setUser(userCred.user));
    return user;
  }
  catch(error){
    console.log("Signup Error:- ",error);
    toast({
      variant: "destructive",
      title: "An account with this email already exists.",
      description: "Please log in or use a different email to create a new account."
    });
  }
}

const deleteUserAuth = async (user,password=null)=>{
  try{
    await deleteDoc(doc(db,"users",user.uid));
    console.log("User Data Deleted Successfully from Firebase Database")
    const providerId = user.providerData[0]?.providerId;
    if(providerId === 'password'){
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
    }else if(providerId === 'google.com'){
      await reauthenticateWithPopup(user,googleAuthProvider)
    }else if(providerId === 'github.com'){
      await reauthenticateWithPopup(user, githubProvider);
    }
    await deleteUser(user);
    toast({
      title: "User Deleted Successfully",
      description: "The user account has been permanently removed from the system.",
      className: "bg-green-600 text-white border-green-500",
    });
  }catch(error){
    toast({
      variant:"destructive",
      title: "Error Deleting Account",
      description:"We were unable to delete your account due to a system or permission issue. Please verify your identity and try again."
    });
  }
}

export { auth, githubProvider, handleGithubLogin, handleEmailLogin, handleEmailSignUp, deleteUserAuth, handleGoogleAuthLogin }