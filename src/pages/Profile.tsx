import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, MapPin, Calendar, Github, Linkedin, Users, Heart, MessageSquare, Star, Code, Trophy, GitFork, Eye, BookOpen, Briefcase, Globe, Zap } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useSelector } from 'react-redux';
import { getProfileData, handleFollow } from '../../backend/utils.js';

const SkeletonCard = ()=>{
  return (
    <span>
    <div className="bg-slate-800/90 backdrop-blur-sm rounded-3xl border border-slate-700 p-8 mb-8">
      <div className="flex flex-col lg:flex-row gap-8 mx-4">
        {/* LEFT SECTION: avatar + buttons + socials */}
        <div className="flex flex-col items-center lg:items-start space-y-6">
          {/* Avatar */}
          <Skeleton className="w-40 h-40 rounded-full bg-slate-700" />

          {/* Action buttons */}
          <div className="flex flex-col gap-3 w-full max-w-sm">
            <Skeleton className="h-10 w-full rounded-xl bg-slate-700" />
            <Skeleton className="h-10 w-full rounded-xl bg-slate-700" />
          </div>

          {/* Social links */}
          <div className="flex gap-3">
            <Skeleton className="w-12 h-12 rounded-xl bg-slate-700" />
            <Skeleton className="w-12 h-12 rounded-xl bg-slate-700" />
            <Skeleton className="w-12 h-12 rounded-xl bg-slate-700" />
          </div>
        </div>

        {/* RIGHT SECTION: name, username, bio, meta + stats grid */}
        <div className="flex-1 space-y-6">
          {/* Name + username + bio */}
          <div>
            <Skeleton className="h-12 w-3/4 mb-2 bg-slate-700" />     {/* Name */}
            <Skeleton className="h-5 w-1/3 mb-4 bg-slate-700" />      {/* @username */}
            <Skeleton className="h-5 w-full mb-2 bg-slate-700" />     {/* bio line 1 */}
            <Skeleton className="h-5 w-4/5 bg-slate-700" />           {/* bio line 2 */}
          </div>

          {/* Meta: location + joined */}
          <div className="flex flex-wrap items-center gap-6">
            <Skeleton className="h-5 w-40 bg-slate-700" />
            <Skeleton className="h-5 w-48 bg-slate-700" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
              key={i}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-4 text-center"
              >
                <Skeleton className="w-12 h-12 rounded-xl mx-auto mb-2 bg-slate-700" />
                <Skeleton className="h-6 w-1/2 mx-auto mb-1 bg-slate-700" />
                <Skeleton className="h-4 w-3/4 mx-auto bg-slate-700" />
              </div>
            ))}
          </div>
        </div>
      </div>

    </div> 
    
    <Card className="bg-slate-800/50 border-slate-700 mb-8">
      <CardHeader>
        <Skeleton className="h-6 w-44 bg-slate-700" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-24 rounded-md bg-slate-700" />
          ))}
        </div>
      </CardContent>
    </Card>
    
    <div className="space-y-4">
      {/* Tabs header */}
      <div className="bg-slate-800/50 border border-slate-700 w-fit rounded-lg p-2 flex gap-2">
        <Skeleton className="h-8 w-24 rounded-md bg-slate-700" />
        <Skeleton className="h-8 w-32 rounded-md bg-slate-700" />
      </div>

      {/* Tabs content list */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-start space-x-4 p-4 bg-slate-700/30 rounded-lg">
              <Skeleton className="w-10 h-10 rounded-lg bg-slate-700" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4 bg-slate-700" />
                <Skeleton className="h-4 w-1/3 bg-slate-700" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
    </span>
  )
}

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const currentUser = useSelector((state)=> state.auth.data);
  const [user, setUser] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  const getData = async () =>{
    const userData = await getProfileData(username);
    setUser(userData);
    setLoading(false);
  }

  useEffect(() => {
    window.scrollTo(0,0);
    getData();
  }, [])

  const stats = [
    { label: 'Followers', value: user.followers ? user.followers.length : 0, icon: Users, color: 'text-blue-400' },
    { label: 'Following', value: user.following ? user.following.length : 0, icon: Heart, color: 'text-green-400' },
    { label: 'Projects', value: user.projects ? user.projects.length : 0, icon: Star, color: 'text-yellow-400' },
    { label: 'Posts', value: user.posts ? user.posts.length : 0, icon: MessageSquare, color: 'text-purple-400' }
  ];

  const followRequest = async(devId:String, alreadyFollowing:boolean) =>{
    const res = await handleFollow(user.uid,devId,alreadyFollowing);
    if(res.ok)
      getData();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="text-slate-300 hover:text-white mb-6 hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      {loading ? (<SkeletonCard />):(
        
        <span>

        {/* Profile Header */}
        <div className="relative mb-8">
          <div className="bg-slate-800/90 backdrop-blur-sm rounded-3xl border border-slate-700 p-8 mb-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Section - Avatar & Basic Info */}
              <div className="flex flex-col items-center lg:items-start space-y-6">
                <div className="relative mx-auto">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Avatar className="w-40 h-40 border-4 border-slate-700 cursor-pointer shadow-xl">
                        <AvatarImage src={user.profilePicture} alt={user.firstName + " " + user.lastName} className="object-cover" />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-4xl">
                          {(user && user.firstName) ? user.firstName.charAt(0).toUpperCase() + " " + user.lastName.charAt(0).toUpperCase() : ""}
                        </AvatarFallback>
                      </Avatar>
                    </DialogTrigger>
                      <DialogContent className='max-w-md p-0 border-0 bg-transparent'>
                        <div className="relative">
                          <img src={user.profilePicture}
                          alt="Profile Image"
                          className='w-full h-auto max-h-[80vh] object-contain rounded-lg'
                          />
                        </div>
                      </DialogContent>
                  </Dialog>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col gap-3 w-full max-w-sm">
                  {(currentUser && (user.followers && !user.followers.includes(currentUser.uid)) )? (
                    <>
                  <Button 
                    onClick={()=>followRequest(currentUser.uid,true)}
                    className={'flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-all duration-200 rounded-xl'}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Following
                  </Button>
                  <Button variant="outline" className="flex-1 rounded-xl border-slate-600 text-slate-700 hover:bg-primary hover:text-white px-6">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                    </>
                  ):(
                  <Button 
                    onClick={()=>!currentUser ? navigate('/signin') : followRequest(currentUser.uid,false)}
                    className={'flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-all duration-200 rounded-xl'}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Follow
                  </Button>
                  )}
                </div>

                {/* Social Links */}
                <div className="relative mx-auto">
                {(user.githubUrl || user.linkedinUrl || user.portfolioUrl) && (
                  <div className="flex gap-3">
                    {user.githubUrl && (
                      <a 
                        href={user.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-12 h-12 bg-slate-700/50 hover:bg-slate-700 hover:text-white text-slate-400 transition-colors rounded-xl"
                      >
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                    {user.linkedinUrl && (
                      <a 
                        href={user.linkedinUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-12 h-12 bg-slate-700/50 hover:bg-slate-700 hover:text-white text-slate-400 transition-colors rounded-xl"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {user.portfolioUrl && (
                      <a 
                        href={user.portfolioUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className='flex items-center justify-center w-12 h-12 bg-slate-700/50 hover:bg-slate-700 hover:text-white text-slate-400 transition-colors rounded-xl'
                      >
                        <Globe className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                )}
                </div>
              </div>

              {/* Right Section - Details */}
              <div className="flex-1 space-y-6">
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">{user.firstName + " " + user.lastName}</h1>
                  <p className="text-xl text-slate-400 mb-4">@{user.username}</p>
                  <p className="text-lg text-slate-300 leading-relaxed">{user.bio}</p>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-slate-300">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{user.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {user.createdAt ? new Date(user.createdAt._seconds * 1000).toLocaleString('en-US', { month: 'long', year: 'numeric' }) : ''}</span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="bg-slate-800/50 backdrop-blur-sm border rounded-2xl p-4 text-center group hover:bg-slate-800/70 border-slate-700 transition-colors">
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-700/50 ${stat.color} mb-2`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-sm text-slate-400">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        {(user.skills &&user.skills.length > 0) && (
          <Card className="bg-slate-800/50 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Code className="w-5 h-5 mr-2 text-blue-400" />
                Skills & Technologies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {user.skills.map((skill: string, index: number) => (
                  <Badge 
                    key={index} 
                    variant="default" 
                    className="bg-blue-500/20 text-blue-300 border cursor-pointer px-3 py-1 text-sm transition-colors"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs Section */}
        <Tabs defaultValue={user.projects && user.projects ? 'projects' : 'activity' } className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="projects" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white">
              Projects
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white">
              Recent Activity
            </TabsTrigger>
          </TabsList>

          {/* <TabsContent value="projects">
            <div className="grid gap-6">
              {user.projects && user.projects.length > 0 ? (
                user.projects.map((project: any, index: number) => (
                  <Card key={index} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <BookOpen className="w-5 h-5 text-blue-400" />
                            <h3 className="text-xl font-semibold text-white">{project.name}</h3>
                          </div>
                          <p className="text-slate-300 mb-4">{project.description}</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.tech.map((tech: string, techIndex: number) => (
                              <Badge key={techIndex} variant="default" className="cursor-pointer bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6 text-slate-400">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4" />
                          <span>{project.stars}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <GitFork className="w-4 h-4" />
                          <span>{project.forks}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-8 text-center">
                    <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-400">No public projects yet</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent> */}

          <TabsContent value="activity">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4 p-4 bg-slate-700/30 rounded-lg">
                    <div className="p-2 rounded-lg bg-blue-500/20">
                      <MessageSquare className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-200 mb-1">Published a new post about React best practices</p>
                      <p className="text-slate-400 text-sm">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 bg-slate-700/30 rounded-lg">
                    <div className="p-2 rounded-lg bg-yellow-500/20">
                      <Star className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-200 mb-1">Started a new project: Advanced Todo App</p>
                      <p className="text-slate-400 text-sm">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 bg-slate-700/30 rounded-lg">
                    <div className="p-2 rounded-lg bg-green-500/20">
                      <Users className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-200 mb-1">Gained 50 new followers</p>
                      <p className="text-slate-400 text-sm">3 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 bg-slate-700/30 rounded-lg">
                    <div className="p-2 rounded-lg bg-purple-500/20">
                      <Code className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-200 mb-1">Contributed to open source project</p>
                      <p className="text-slate-400 text-sm">5 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </span>
      )}
      </div>
    </div>
  );
};

export default Profile;
