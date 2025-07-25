import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, X, Github } from 'lucide-react';
import { useSelector } from 'react-redux';
import { handleProjectSubmit } from '../../backend/utils.js'

const AddProject = () => {
  const navigate = useNavigate();
  const data = useSelector((state)=>state.auth.data);
  useEffect(() => {
    if(!data)
      navigate('/signin');
  }, [])
  
  const [projectData, setProjectData] = useState({
    uid: data.uid,
    title: '',
    description: '',
    author: data.firstName + data.lastName,
    avatar: data.profilePicture || '',
    githubUrl: data.githubUrl || '',
    demoUrl: '',
    image: '',
    tech: [] as string[],
  });
  const [techInput, setTechInput] = useState('');
  const [gitUrl, setGitUrl] = useState('');

  const handleAddTech = () => {
    if (techInput.trim() && !projectData.tech.includes(techInput.trim())) {
      setProjectData(prev => ({
        ...prev,
        tech: [...prev.tech, techInput.trim()]
      }));
      setTechInput('');
    }
  };

  const handleRemoveTech = (techToRemove: string) => {
    setProjectData(prev => ({
      ...prev,
      tech: prev.tech.filter(tech => tech !== techToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    //Send project data to firebase
    const res = await handleProjectSubmit(projectData);
    if(res)
      navigate(res)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <Button
            variant="default"
            onClick={() => navigate('/dashboard')}
            className="text-slate-300 hover:text-white bg-transparent hover:bg-transparent mr-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-white">Add New Project</h1>
        </div>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Project Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-300">Project Title</Label>
                <Input
                  id="title"
                  value={projectData.title}
                  onChange={(e) => setProjectData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter project title"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-300">Description</Label>
                <Textarea
                  id="description"
                  value={projectData.description}
                  onChange={(e) => setProjectData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your project..."
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 min-h-[120px]"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="githubUrl" className="text-slate-300">GitHub URL (Optional)</Label>
                  <Input
                    id="githubUrl"
                    value={gitUrl}
                    onChange={(e)=>setGitUrl(e.target.value)}
                    placeholder="https://github.com/username/repo"
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="demoUrl" className="text-slate-300">Demo URL (Optional)</Label>
                  <Input
                    id="demoUrl"
                    value={projectData.demoUrl}
                    onChange={(e) => setProjectData(prev => ({ ...prev, demoUrl: e.target.value }))}
                    placeholder="https://your-demo.com"
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image" className="text-slate-300">Project Image URL (Optional)</Label>
                <Input
                  id="image"
                  value={projectData.image}
                  onChange={(e) => setProjectData(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Technologies Used</Label>
                <div className="flex space-x-2">
                  <Input
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    placeholder="Add technology (e.g., React, Node.js)"
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                  />
                  <Button
                    type="button"
                    onClick={handleAddTech}
                    variant="outline"
                    className="border-slate-600 text-slate-700 hover:text-white hover:bg-slate-700"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {projectData.tech.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {projectData.tech.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => handleRemoveTech(tech)}
                          className="ml-2 hover:text-red-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex space-x-4 pt-6">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                  <Github className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  className="border-slate-600 text-slate-700 hover:text-white hover:bg-slate-700"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddProject;
