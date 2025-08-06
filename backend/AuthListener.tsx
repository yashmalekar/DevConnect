import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "../Redux/authSlice";
import { Loader } from "lucide-react";

const AuthListener = ({ children }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true); // 👈 add loading state
  const user = auth.currentUser;
  
  useEffect(() => {
    if(user){
      dispatch(setUser(user));
      setLoading(false);
      return ;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser(user));
      } else {
        dispatch(clearUser());
      }
      setLoading(false); // ✅ ready to render
    });

    return () => unsubscribe();
  }, [dispatch]);

  // if (loading) {
  //   return (
  //   <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
  //     <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
  //     {loading && (
  //       <div className="flex items-center space-x-2 text-xl">
  //         <Loader className="w-4 h-4 mr-2 animate-spin" />
  //         Loading...
  //       </div>
  //     )}
  //     </div>
  //   ); // or spinner
  // }

  return children; // ✅ finally render the app
};

export default AuthListener;