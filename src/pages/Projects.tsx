import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Github, ExternalLink } from 'lucide-react';
import { AvatarFallback, Avatar, AvatarImage } from '@/components/ui/avatar';
import { Link, useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const SkeletonCard = () =>{
  return (
    <Card className='bg-slate-800/50 border-slate-700'>
      <Skeleton className='w-full h-48 bg-slate-700' />
      <CardHeader className='pb-3'>
        <Skeleton className='h-5 w-1/2 bg-slate-700' />
        <Skeleton className='h-4 w-full bg-slate-700' />
        <Skeleton className='h-4 w-full bg-slate-700' />
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex gap-2'>
          <Skeleton className='h-4 w-14 bg-slate-700' />
          <Skeleton className='h-4 w-14 bg-slate-700' />
          <Skeleton className='h-4 w-14 bg-slate-700' />
          <Skeleton className='h-4 w-14 bg-slate-700' />
        </div>
        <div className="flex items-center justify-between border-t border-slate-700">
          <div className='flex items-center space-x-2 pt-2'>
            <Skeleton className='h-9 w-9 rounded-full bg-slate-700' />
            <Skeleton className='h-4 w-28 bg-slate-700' />
            </div>
        </div>
        <div className='flex space-x-2 pt-2'>
          <Skeleton className='flex-1 h-9 bg-slate-700' />
          <Skeleton className='h-9 w-12 bg-slate-700' />
        </div>
      </CardContent>
    </Card>
  )
}

const Projects = () => {

  const navigate = useNavigate();
  const [loading,setLoading] = useState(true);

  useEffect(() => {
    getProject();
    window.scrollTo(0,0);
  }, [])

  const [projects, setProjects] = useState([]);

  const getProject = async ()=>{
    setProjects(await fetch('http://localhost:5000/get-projects').then(res=>res.json()));
    setLoading(false);
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

          {loading && Array.from({length:4}).map((_,index)=>(
            <SkeletonCard key={`skeleton-${index}`} />
          ))}

          {projects && projects.map((project) => (
            <Card key={project.docId} className="bg-slate-800/50 border-slate-700 overflow-hidden hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 group">
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
                  {project.tech.slice(0,3).map((tech) => (
                    <Badge key={tech} variant="secondary" className="cursor-pointer bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {project.tech.length > 3 && (
                    <Badge 
                      variant="default" 
                      className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 cursor-pointer text-xs"
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
                      +{project.tech.length - 3} more
                    </Badge>
                  )}
                  {project.tech.slice(3).map((skill) => (
                    <Badge 
                      key={skill} 
                      variant="default" 
                      className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 cursor-pointer text-xs hidden-tech hidden"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  <Link to={`/profile/${project.username}`} className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8 mx-auto">
                    <AvatarImage src={project.avatar || ""} alt={project.author || ""} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      {project.author.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                    <span className="text-slate-300 text-sm">by {project.author}</span>
                  </Link>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-slate-900">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Demo
                  </Button>
                  <Button variant="outline" className="border-slate-600 text-slate-700 hover:text-white hover:bg-primary">
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
