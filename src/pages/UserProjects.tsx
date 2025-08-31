import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Github, ExternalLink, Code, MoreHorizontal} from 'lucide-react';
import { useSelector } from 'react-redux';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

const UserProjects = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.data);
  const [editProject, setEditProject] = useState(null);
  const [isEditOpen,setIsEditOpen] = useState(false);
  const [isEditTags, setIsEditTags] = useState('');

    useEffect(() => {
      if(!user)
        navigate('/signin')
      getProject();
      window.scrollTo(0,0);
    }, [user])
  
    const [projects, setProjects] = useState([]);
    
    const getProject = async ()=>{
      const data = await fetch('http://localhost:5000/get-projects').then(res=>res.json());
      const projects1 = data.filter((project)=>project.uid===user.uid);
      setProjects(projects1); 
    }

    const deleteProject = async (id:String,uid:String)=>{
      setProjects(prev=>prev.filter((project)=>project.id!==id))
      await fetch('http://localhost:5000/delete-project',{method:"POST",headers:{'Content-Type':'application/json'},body:JSON.stringify({id,uid})});
      toast({
        title: "Project deleted",
        variant:"destructive",
        description: "Your Project has been successfully deleted.",
      })
    }

    const handleEditProject = async (project:any)=>{
      setEditProject(project);
      setIsEditOpen(true);
      setIsEditTags(project.tech.join(', '));
    }

    const handleSaveEdit = async()=>{
      setIsEditOpen(false);
      const updatedProjects = projects.map((project)=>
        project.id === editProject.id ?
        {
          ...editProject,
          tech: isEditTags.split(', ').map((tag)=>tag.trim()).filter((tag)=>tag),
        }
        : project
      );
      setProjects(updatedProjects);
      const res = await fetch('http://localhost:5000/edit-project',{method:"POST",headers:{'Content-Type':'application/json'},body:JSON.stringify({uid:editProject.uid,projectId:editProject.id,updatedData:updatedProjects.filter((project) => project.id === editProject.id)[0]})});
      if(res.ok){
        toast({
          title: "Project updated",
          description: "Your Project has been successfully updated.",
        });
      }
      setEditProject(null);
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
            className="bg-gradient-to-r from-blue-500 to-purple-600 active:from-blue-600 active:to-purple-700"
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='default' className='absolute top-2 right-2 rounded-lg hover:text-white hover:bg-primary transition-all duration-300 cursor-pointer'>
                          <MoreHorizontal className='w-6 h-6' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='start' className='bg-primary text-white border-primary'>
                        <DropdownMenuItem onClick={()=>handleEditProject(project)} className='cursor-pointer'>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={()=>deleteProject(project.id,project.uid)} className="hover:bg-destructive focus:bg-destructive cursor-pointer hover:text-destructive-foreground focus:text-destructive-foreground">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>

              <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className='bg-slate-800 border-slate-800'>
                  <DialogHeader>
                    <DialogTitle className='text-white'>Edit Project</DialogTitle>
                    <DialogDescription className='text-slate-400'>
                      Make changes to your project here. Click save when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className='text-white'>Project Title</Label>
                      <Input
                      defaultValue={project?.title}
                      onChange={(e)=>setEditProject({...editProject,title:e.target.value})}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder='Project title' />
                    </div>
                    <div className="space-y-2">
                      <Label className='text-white'>Project Description</Label>
                      <Textarea
                      defaultValue={project?.description}
                      onChange={(e)=>setEditProject({...editProject,description:e.target.value})}
                      className="min-h-[100px] rounded-md bg-slate-700 border-slate-600 text-white"
                      placeholder='Project description' />
                    </div>
                    <div className="space-y-2">
                      <Label className='text-white'>Technologies (comma and space separated)</Label>
                      <Input defaultValue={isEditTags}
                      onChange={(e)=>setIsEditTags(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder='Tech used' />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className='text-white'>Github Link</Label>
                    <Input
                    defaultValue={project?.githubUrl}
                    onChange={(e)=>setEditProject({...editProject,githubUrl:e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder='Github link' />
                  </div>
                  <div className="space-y-2">
                    <Label className='text-white'>Demo Link</Label>
                    <Input
                    defaultValue={project?.demoUrl}
                    onChange={(e)=>setEditProject({...editProject,demoUrl:e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder='Demo URL' />
                  </div>
                  <DialogFooter>
                    <Button type='submit' onClick={handleSaveEdit} className='bg-blue-600 active-bg-blue-700 hover:bg-blue-600'>
                      Save Changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

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
                    <Badge key={tech} variant="default" className="bg-blue-500/20 cursor-pointer text-blue-300 text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {project.tech.length > 3 && (
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
                      +{project.tech.length - 3} more
                    </Badge>
                  )}
                  {project.tech.slice(3).map((skill) => (
                    <Badge 
                      key={skill} 
                      variant="default" 
                      className="bg-blue-500/20 cursor-pointer text-blue-300 text-xs hidden-tech hidden"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
                {(project.githubUrl || project.demoUrl) && (
                <div className="text-center border-t border-slate-700" />
                )}

                <div className="flex gap-2">
                  {project.githubUrl &&(
                    <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-slate-600 text-slate-700 hover:bg-primary hover:text-white"
                    onClick={() => window.open(project.githubUrl, '_blank')}
                    >
                      <Github className="w-4 h-4 mr-1" />
                      Code
                    </Button>
                  )}
                  {project.demoUrl && (
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 active:from-blue-600 active:to-purple-700"
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
              className="bg-gradient-to-r from-blue-500 to-purple-600 active:from-blue-600 active:to-purple-700"
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