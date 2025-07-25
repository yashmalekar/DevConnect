import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Github, MapPin, Star } from 'lucide-react';
import { getUsers } from '../../backend/utils.js'

const Discover = () => {

  useEffect(() => {
    fetchDevelopers();
  }, []);
  

  const [developers,setDevelopers] = useState([]);

  const fetchDevelopers = async()=>{
    const users = await getUsers();
    setDevelopers(users);
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
          {developers.map((dev) => (
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
                <p className="text-slate-300 text-sm text-center">{dev.bio}</p>
                
                <div className="flex items-center justify-center text-slate-400 text-sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  {dev.location}
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                  {dev.skills.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="default" className="bg-blue-500/20 cursor-pointer text-blue-300 text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {dev.skills.length > 3 && (
                    <Badge variant="default" className="bg-slate-500/20 cursor-pointer text-slate-400 text-xs">
                      +{dev.skills.length - 3} more
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4 text-center py-3 border-t border-slate-700">
                  <div>
                    <div className="font-semibold text-white">{dev.followers}</div>
                    <div className="text-xs text-slate-400">Followers</div>
                  </div>
                  <div>
                    <div className="font-semibold text-white">{dev.following}</div>
                    <div className="text-xs text-slate-400">Following</div>
                  </div>
                  <div>
                    <div className="font-semibold text-white">{dev.projects}</div>
                    <div className="text-xs text-slate-400">Projects</div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                    <Users className="w-4 h-4 mr-2" />
                    Follow
                  </Button>
                  <Button variant="outline" className="border-slate-600 text-slate-400 hover:text-white hover:bg-slate-700">
                    <Github className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Discover;