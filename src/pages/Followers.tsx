import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, UserCheck, UserPlus, MapPin, Github } from 'lucide-react';
import { useSelector } from 'react-redux';
import { handleFollow } from '../../backend/utils.js';

const Followers = () => {
  const navigate = useNavigate();
  const userFollowers: String[] = useSelector((state)=>state.auth.data.followers);
  const currentUser = useSelector((state)=>state.auth.user);
  const [followers,setFollowers] = useState([]);
  useEffect(() => {
    if(!currentUser)
      navigate('/signin')
    window.scrollTo(0, 0);
    setFollowersData();
  }, [currentUser])

  const setFollowersData = async()=>{
    const followersData = await fetch('http://localhost:5000/get-users').then(res=>res.json());
    const data = followersData.filter((user:any)=>Array.isArray(userFollowers) && userFollowers.includes(user.uid));
    const data1 = data.map((user:any)=>({...user,isFollowing:user.followers.includes(currentUser.uid)}));
    setFollowers(data1);
  }
  const followRequest = async (userId: String, alreadyFollowing:boolean) => {
    // Toggle follow status
    const res = await handleFollow(userId,currentUser.uid,alreadyFollowing);
    if(res.ok){
      setFollowersData();
    }
  };

  const renderUserCard = (user:any) => (
    <Card key={user.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16 flex-shrink-0">
            <AvatarImage src={user.profilePicture} alt={user.firstName} />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              {user.firstName.charAt(0) + user.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-white text-lg">{user.firstName + " " + user.lastName}</h3>
                <p className="text-slate-400 text-sm">{user.username}</p>
              </div>
              <Button
                size="sm"
                variant={user.isFollowing ? "outline" : "default"}
                onClick={() => followRequest(user.uid,user.isFollowing)}
                className={user.isFollowing 
                  ? "border-slate-600 text-slate-700 hover:bg-red-500 hover:text-white hover:border-red-500" 
                  : "bg-gradient-to-r from-blue-500 to-purple-600 active:from-blue-600 active:to-purple-700"
                }
              >
                {user.isFollowing ? (
                  <>
                    <UserCheck className="w-4 h-4 mr-1" />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-1" />
                    Follow
                  </>
                )}
              </Button>
            </div>

            {user.bio && (
              <p className="text-slate-300 text-sm mb-3 line-clamp-2">{user.bio}</p>
            )}

            {user.location && (
              <div className="flex items-center text-slate-400 text-sm mb-3">
                <MapPin className="w-3 h-3 mr-1" />
                {user.location}
              </div>
            )}

            {user.skills && user.skills.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {user.skills.slice(0, 3).map((skill: string) => (
                  <Badge key={skill} variant="secondary" className="bg-blue-500/20 text-blue-300 text-xs">
                    {skill}
                  </Badge>
                ))}
                {user.skills.length > 3 && (
                  <Badge variant="secondary" className="bg-slate-500/20 text-slate-400 text-xs">
                    +{user.skills.length - 3}
                  </Badge>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="border-slate-600 text-slate-700 hover:bg-primary hover:text-white"
                onClick={() => navigate(`/profile/${user.uid}`)}
              >
                View Profile
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-slate-600 text-slate-700 hover:bg-primary hover:text-white"
              >
                <Github className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="text-slate-300 hover:bg-slate-700 hover:text-whitee"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
           <h1 className="text-3xl font-bold text-white">Followers</h1>
            <p className="text-slate-400">People following you ({followers.length})</p>
          </div>
        </div>

        <div className="space-y-4">
          {followers.length > 0 ? (
            followers.map(user => renderUserCard(user))
          ) : (
            <div className="text-center py-16">
              <div className="text-slate-400 text-6xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-white mb-2">No followers yet</h3>
              <p className="text-slate-400 mb-4">Share great content to attract followers</p>
              <Button 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                onClick={() => navigate('/feed/create')}
              >
                Create Your First Post
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Followers;