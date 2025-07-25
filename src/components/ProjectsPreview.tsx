import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AvatarFallback, Avatar, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { getProjects } from '../../backend/utils.js'
import { useSelector } from 'react-redux';

export const ProjectsPreview = () => {

  const data = useSelector((state)=>state.auth.projectData);

  useEffect(() => {
    if(data){
      setProjects(data);
    }else{
      getProject();
    }
  }, [])
  
  const [projects, setProjects] = useState([]);
  
  const getProject = async ()=>{
    setProjects(await getProjects());
  }

  return (
    <section className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-white">Featured Projects</h2>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          Discover amazing projects built by the community. Get inspired, learn new techniques, and showcase your own work.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...projects].sort(()=>Math.random()-0.5).slice(0,3).map((project) => (
          <Card key={project.id} className="bg-slate-800/50 border-slate-700 overflow-hidden hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 group">
            <div className="relative overflow-hidden">
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-lg leading-tight">{project.title}</h3>
                <div className="flex space-x-2">
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{project.description}</p>
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
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Link to="/projects">
          <Button variant="outline" size="lg" className="border-slate-600 text-slate-700 hover:text-white hover:bg-slate-800">
            Explore All Projects
          </Button>
        </Link>
      </div>
    </section>
  );
};
