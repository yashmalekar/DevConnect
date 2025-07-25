import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Github, ExternalLink } from 'lucide-react';
import { AvatarFallback, Avatar, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { getProjects } from '../../backend/utils.js'
import { useSelector } from 'react-redux';

const Projects = () => {

  const navigate = useNavigate();
  const data = useSelector((state)=>state.auth.projectData);

  useEffect(() => {
    if(data){
      setProjects(data);
    }else{
      getProject();
    }
    window.scrollTo(0,0);
  }, [])

  const [projects, setProjects] = useState([]);

  const getProject = async ()=>{
    setProjects(await getProjects());
  }

  const handleAuthClick = (username:string) =>{
    const cleanUserName = username.replace('@',"");
    navigate(`/profile/${cleanUserName}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-white">Featured Projects</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Explore innovative projects built by the developer community. Get inspired and contribute to open source.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <Card key={project.id} className="bg-slate-800/50 border-slate-700 overflow-hidden hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 group">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-xl leading-tight">{project.title}</h3>
                </div>
                <p className="text-slate-300 leading-relaxed">{project.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <Badge key={tech} variant="secondary" className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8 mx-auto">
                    <AvatarImage src={project.avatar || ""} alt={project.author || ""} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      {project.author.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                    <span className="text-slate-300 text-sm">by {project.author}</span>
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-slate-900">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Demo
                  </Button>
                  <Button variant="outline" className="border-slate-600 text-slate-700 hover:text-white hover:bg-slate-800">
                    <Github className="w-4 h-4 mr-2" />
                    Code
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

export default Projects;
