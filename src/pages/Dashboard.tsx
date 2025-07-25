import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import EditProfile from '@/components/EditProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Github, MessageSquare, Heart, TrendingUp, Calendar, MapPin, Linkedin, ExternalLink } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserData, getUserPostCount, getUserProjectCount} from '../../backend/utils.js'
import { setData } from '../../Redux/authSlice.js'
import TrendingContent from '@/components/TrendingContent.js';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [postCount, setPostCount] = useState('0');
  const [projectCount, setProjectCount] = useState('0');
  const [userData, setUserData] = useState<any>({});
  const user = useSelector((state)=>state.auth.user)
  const data = useSelector((state)=>state.auth.data);

  useEffect(()=>{
    const isAuthenticated = user;
    if(!isAuthenticated)
      navigate('/signin')
    if (!data) {
      getData(); // Only fetch if not already present
    } 
    else {
      setUserData(data); // Use Redux data
    }
    updatePostCount();
    updateProjectCount();
    window.scrollTo(0,0);
  },[data]);

  const getData = async ()=>{
    //Load user data
  const storedUserData = await getUserData(user.uid);
  if (storedUserData) {
    dispatch(setData(storedUserData)); // store in redux
    setUserData(storedUserData);       // store in local state
  }
  }

  const updatePostCount = async ()=>{
    setPostCount(await getUserPostCount(user.uid))
  }

  const updateProjectCount = async ()=>{
    setProjectCount(await getUserProjectCount(user.uid));
  }

  // Refresh user data when returning from edit profile
  const handleBackFromEdit = () => {
    setShowEditProfile(false);
    getData();
    window.scrollTo(0,0);
  };

  if (showEditProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Header />
        <EditProfile user={user} data={userData} onBack={handleBackFromEdit} />
      </div>
    );
  }

  const userEmail = user.email;
  const userName = user.reloadUserInfo.screenName || userData.username || ""
  const displayName = user.reloadUserInfo.displayName || userData.firstName + " " + userData.lastName || ""
  const joinedAt = new Date(user.metadata.creationTime).toLocaleDateString('en-GB',{
    month:'long',
    year:'numeric'
  })

  const stats = [
    { label: 'Posts', value: postCount, icon: MessageSquare, color: 'text-blue-400' },
    { label: 'Followers', value: '248', icon: Users, color: 'text-green-400' },
    { label: 'Following', value: '189', icon: Heart, color: 'text-purple-400' },
    { label: 'Projects', value: projectCount, icon: Github, color: 'text-yellow-400' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <Avatar className="w-24 h-24 mx-auto">
                    <AvatarImage src={user.photoURL || userData.profilePicture || ""} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-2xl">
                      {userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h2 className="text-2xl font-bold text-white capitalize">{displayName}</h2>
                    <p className="text-slate-400">{`@${userData.username}` || `@${userName}`}</p>
                    <p className="text-slate-400 text-sm">{userEmail}</p>
                  </div>

                  <div className="space-y-2">
                    {userData.location && (
                      <div className="flex items-center justify-center text-slate-300 text-sm">
                        <MapPin className="w-4 h-4 mr-1" />
                        {userData.location}
                      </div>
                    )}
                    <div className="flex items-center justify-center text-slate-300 text-sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      Joined {joinedAt}
                    </div>
                  </div>

                  {userData.bio && (
                    <p className="text-slate-300 text-sm">
                      {userData.bio}
                    </p>
                  )}

                  {userData.jobTitle && (
                    <p className="text-slate-400 text-sm">
                      {userData.jobTitle} {userData.company && `at ${userData.company}`}
                    </p>
                  )}

                  {userData.skills && userData.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center">
                      {userData.skills.slice(0, 6).map((skill: string, index: number) => (
                        <Badge key={index} variant="default" className="bg-blue-500/20 cursor-pointer text-blue-300 text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {userData.skills.length > 6 && (
                        <Badge variant="default" className="bg-gray-500/20 cursor-pointer text-gray-300 text-xs">
                          +{userData.skills.length - 6} more
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Social Links */}
                  {(userData.githubUrl || userData.linkedinUrl || userData.portfolioUrl) && (
                    <div className="flex justify-center space-x-4 py-2">
                      {userData.githubUrl && (
                        <a 
                          href={userData.githubUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          <Github className="w-5 h-5" />
                        </a>
                      )}
                      {userData.linkedinUrl && (
                        <a 
                          href={userData.linkedinUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          <Linkedin className="w-5 h-5" />
                        </a>
                      )}
                      {userData.portfolioUrl && (
                        <a 
                          href={userData.portfolioUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  )}


                  <Button 
                    onClick={() => setShowEditProfile(true)}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                  >
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4 text-center">
                    <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-700/50 ${stat.color} mb-2`}>
                      <stat.icon className="w-4 h-4" />
                    </div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-slate-400">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Trending Content */}
            <TrendingContent />

            {/* Quick Actions */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button onClick={()=>navigate('/feed/create')} variant="outline" className="border-slate-600 text-slate-700 hover:text-white hover:bg-slate-700">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Create Post
                  </Button>
                  <Button onClick={()=>navigate('/projects/add')} variant="outline" className="border-slate-600 text-slate-700 hover:text-white hover:bg-slate-700">
                    <Github className="w-4 h-4 mr-2" />
                    Add Project
                  </Button>
                  <Button onClick={()=>navigate("/discover")} variant="outline" className="border-slate-600 text-slate-700 hover:text-white hover:bg-slate-700">
                    <Users className="w-4 h-4 mr-2" />
                    Find Developers
                  </Button>
                  <Button variant="outline" className="border-slate-600 text-slate-700 hover:text-white hover:bg-slate-700">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
