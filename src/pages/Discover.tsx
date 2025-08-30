import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Github, MapPin, Star, MessageSquare } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { handleFollow } from '../../backend/utils.js';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const SkeletonCard = ()=>{
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="text-center space-y-4">
        <Skeleton className="h-20 w-20 rounded-full mx-auto bg-slate-700" />
        <div className="space-y-2">
          <Skeleton className='h-4 w-32 mx-auto bg-slate-700' />
          <Skeleton className='h-4 w-32 mx-auto bg-slate-700' />
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        <Skeleton className='h-3 w-full bg-slate-700' />
        <Skeleton className='h-3 w-3/4 mx-auto bg-slate-700' />
        <Skeleton className='h-3 w-24 mx-auto bg-slate-700' />
        <div className="flex gap-2 justify-center">
          <Skeleton className='h-5 w-16 bg-slate-700' />
          <Skeleton className='h-5 w-20 bg-slate-700' />
          <Skeleton className='h-5 w-14 bg-slate-700' />
        </div>
        <div className='grid grid-cols-3 gap-4'>
          <Skeleton className='h-8 bg-slate-700' />
          <Skeleton className='h-8 bg-slate-700' />
          <Skeleton className='h-8 bg-slate-700' />
        </div>
        <div className="flex space-x-2">
          <Skeleton className='h-9 flex-1 bg-slate-700' />
          <Skeleton className='h-9 w-12 bg-slate-700' />
        </div>
      </CardContent>
    </Card>
  )
}

const Discover = () => {

  const navigate = useNavigate();

  useEffect(() => {
    fetchDevelopers();
  }, []);
  

  const [developers,setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state)=>state.auth.user);

  const fetchDevelopers = async()=>{
    const users = await fetch('http://localhost:5000/get-users').then(res=>res.json());
    setDevelopers(users);
    setLoading(false);
  }
  
    const followRequest = async(devId:String, alreadyFollowing:boolean) =>{
      if(user==null)
        navigate('/signin');
      const res = await handleFollow(devId,user.uid,alreadyFollowing);
      if(res.ok){
        fetchDevelopers();
      }
    }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-white">Discover Developers</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Connect with talented developers from around the world. Find your next collaborator or mentor.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {loading && Array.from({length:3}).map((_,index)=>(
            <SkeletonCard key={`skeleton-${index}`} />
          ))}

          {developers && developers.map((dev) => (
            <Card key={dev.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center space-y-4">
                <Avatar className="w-20 h-20 mx-auto">
                  <AvatarImage src={dev.profilePicture} alt={dev.firstName+' '+ dev.lastName} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl">
                    {dev.firstName.charAt(0).toUpperCase()+dev.lastName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-white text-lg">{dev.firstName + ' ' + dev.lastName}</h3>
                  <p className="text-slate-400 text-sm">{dev.username}</p>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                 {dev.bio && (
                    <p className="text-slate-300 text-sm text-center">{dev.bio}</p>
                  )}
                  
                  {dev.location && (
                    <div className="flex items-center justify-center text-slate-400 text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      {dev.location}
                    </div>
                  )}

                  {dev.skills && dev.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center">
                      {dev.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="default" className="bg-blue-500/20 text-blue-300 text-xs cursor-pointer">
                          {skill}
                        </Badge>
                      ))}
                      {dev.skills.length > 3 && (
                    <Badge 
                      variant="default" 
                      className="bg-blue-500/20 cursor-pointer text-blue-300 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        const techContainer = e.currentTarget.parentElement;
                        const hiddenTechs = techContainer?.querySelectorAll('.hidden-tech');
                        const moreButton = e.currentTarget;
                        
                        if (hiddenTechs) {
                          hiddenTechs.forEach(tech => tech.classList.toggle('hidden'));
                          moreButton.style.display = 'none';
                        }
                      }}
                    >
                      +{dev.skills.length - 3} more
                    </Badge>
                  )}
                  {dev.skills.slice(3).map((tech) => (
                    <Badge 
                      key={tech} 
                      variant="default" 
                      className="bg-blue-500/20 cursor-pointer text-blue-300 text-xs hidden-tech hidden"
                    >
                      {tech}
                    </Badge>
                  ))}
                    </div>
                  )}

                <div className="grid grid-cols-3 gap-4 text-center py-3 border-t border-slate-700">
                  <div>
                    <div className="font-semibold text-white">{dev.followers ? dev.followers.length : 0}</div>
                    <div className="text-xs text-slate-400">Followers</div>
                  </div>
                  <div>
                    <div className="font-semibold text-white">{dev.following ? dev.following.length : 0}</div>
                    <div className="text-xs text-slate-400">Following</div>
                  </div>
                  <div>
                    <div className="font-semibold text-white">{dev.projects ? dev.projects.length : 0}</div>
                    <div className="text-xs text-slate-400">Projects</div>
                  </div>
                </div>

                {(user && user.uid===dev.uid) ? (
                  <div className='flex'>
                    <Button variant='outline' onClick={()=>navigate(`/profile/${dev.username}`)} className='flex-1 border-slate-600 text-slate-700 hover:text-white hover:bg-primary'>
                        View Profile
                      </Button>
                  </div>
                ): (
                <div className="space-y-2">
                  {(user && (dev.following && dev.followers.includes(user.uid))) ? (
                    <div className="flex gap-2">
                      <Button onClick={()=>followRequest(dev.uid,true)} className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 active:from-blue-600 active:to-purple-700 text-white">
                        <Users className="w-4 h-4 mr-2" />
                        Following
                        </Button>
                        <Button 
                          variant="outline"
                          className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                          onClick={(e) => handleMessage(e, dev.username)}
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                    </div>
                  ):(
                  <Button onClick={()=>followRequest(dev.uid,false)} className="flex-1 w-full bg-gradient-to-r from-blue-500 to-purple-600 active:from-blue-600 active:to-purple-700 text-white">
                    <Users className="w-4 h-4 mr-2" />
                    Follow
                  </Button>
                  )}
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={()=>window.open(dev.githubUrl,'_blank')} className="flex-1 border-slate-600 text-slate-700 hover:text-white hover:bg-primary">
                      <Github className="w-4 h-4" />
                      </Button>
                      <Button variant='outline' onClick={()=>navigate(`/profile/${dev.username}`)} className='flex-1 border-slate-600 text-slate-700 hover:text-white hover:bg-primary'>
                        View Profile
                      </Button>
                  </div>
                </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Discover;