import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Github, ExternalLink, Code} from 'lucide-react';

const UserProjects = () => {
  const navigate = useNavigate();

    useEffect(() => {
      getProject();
      window.scrollTo(0,0);
    }, [])
  
    const [projects, setProjects] = useState([]);
  
    const getProject = async ()=>{
      setProjects(await fetch('http://localhost:5000/get-projects').then(res=>res.json())); 
    }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">My Projects</h1>
              <p className="text-slate-400">Manage and showcase your development projects</p>
            </div>
          </div>
          <Button 
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            onClick={() => navigate('/projects/add')}
          >
            <Code className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 overflow-hidden group">
              <div className="relative">
                {project.image && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-white text-lg group-hover:text-blue-300 transition-colors">
                      {project.title}
                    </CardTitle>
                    <p className="text-slate-400 text-sm mt-1 line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-1">
                  {project.tech.slice(0, 3).map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs border-slate-600 text-slate-400">
                      {tech}
                    </Badge>
                  ))}
                  {project.tech.length > 3 && (
                    <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                      +{project.tech.length - 3}
                    </Badge>
                  )}
                </div>
                {(project.githubUrl || project.demoUrl) && (
                <div className="text-center border-t border-slate-700" />
                )}

                <div className="flex gap-2">
                  {project.githubUrl &&(
                    <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-slate-600 text-slate-700 hover:bg-slate-700 hover:text-white"
                    onClick={() => window.open(project.githubUrl, '_blank')}
                    >
                      <Github className="w-4 h-4 mr-1" />
                      Code
                    </Button>
                  )}
                  {project.demoUrl && (
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      onClick={() => window.open(project.demoUrl, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Live
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-16">
            <div className="text-slate-400 text-6xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
            <Button 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              onClick={() => navigate('/projects/add')}
            >
              Create Your First Project
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProjects;