import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, X, Send, Image } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from '@/hooks/use-toast.js';
import { uploadPostImage } from '../../backend/utils.js'

const CreatePost = () => {
  const navigate = useNavigate();
  const data = useSelector((state)=>state.auth.data);
  const [imageFiles, setImageFiles] = useState<File[] | null>(null);
  const [postData, setPostData] = useState({
    uid: data.uid,
    author: data.firstName + ' ' +  data.lastName,
    avatar: data.profilePicture || '',
    username: data.username,
    content: '',
    tags: [] as string[],
    githubLink: data.githubUrl || '',
    images: [] as string[]
  });
  const [tagInput, setTagInput] = useState('');

  const handleAddTag = () => {
    if (tagInput.trim() && !postData.tags.includes(tagInput.trim())) {
      setPostData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setPostData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let res=null;
    //Upload Post images to cloudinary
    if(imageFiles){
      let updatedData = {...postData};
      if(imageFiles.length>0){
        const imagesRes = await uploadPostImage(imageFiles,data.uid);
        const imageArray = imagesRes.map((image: any) => image.url);
        updatedData = {...updatedData,images:imageArray};
      }
  
      //Send post data to Firebase
      res = await fetch('http://localhost:5000/create-post', { method:'POST',headers:{'Content-Type':'application/json'},body: JSON.stringify(updatedData)});
    }else{
      res = await fetch('http://localhost:5000/create-post', { method:'POST',headers:{'Content-Type':'application/json'},body: JSON.stringify(postData)});
    }
    if(res){
      toast({
        title: "Post Published Successfully!",
        description: "Your post has been shared with the developer community.",
        className: "bg-green-600 text-white border-green-500",
      });
      navigate('/feed');  
    }else{
    toast({
        variant:"destructive",
        title:`${res.json()}`
      })
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <Button
            variant="default"
            onClick={() => navigate(-1)}
            className="text-slate-300 hover:text-white hover:bg-transparent bg-transparent mr-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-white">Create New Post</h1>
        </div>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Share Your Thoughts</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="content" className="text-slate-300">Post Content</Label>
                <Textarea
                  id="content"
                  value={postData.content}
                  onChange={(e) => setPostData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="What's on your mind? Share your latest project, thoughts on tech, or ask the community a question..."
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 min-h-[150px]"
                  required
                />
                <div className="text-right text-sm text-slate-400">
                  {postData.content.length}/500 characters
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Images</Label>
                <div className="flex items-center space-x-2">
                  <Input accept='image/*' type='file' id='Images' className='hidden' multiple  onChange={(e)=>{
                    const files = e.target.files;
                    if(files){
                      setImageFiles(Array.from(files));
                    }
                  }} />
                  <Button
                    type="button"
                    variant="outline"
                    className="border-slate-600 text-slate-700 hover:text-white hover:bg-slate-700"
                    onClick={() => document.getElementById('Images')?.click()}
                  >
                    <Image className="w-4 h-4 mr-2" />
                    Add Image
                  </Button>
                  </div>
                    {imageFiles && imageFiles.map((image,index)=>(
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <div className="relative group" key={index}>
                          <img src={URL.createObjectURL(image)} className='w-full h-52 object-cover rounded-lg' alt={`Upload ${index + 1}`} />
                          <button 
                            type="button"
                            onClick={() => setImageFiles(imageFiles.filter((_, i) => i !== index))}
                            className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Tags</Label>
                <div className="flex space-x-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add tags (e.g., React, JavaScript, UI/UX)"
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  />
                  <Button
                    type="button"
                    onClick={handleAddTag}
                    variant="outline"
                    className="border-slate-600 text-slate-700 hover:text-white hover:bg-slate-700"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {postData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {postData.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 hover:text-red-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="githubLink" className="text-slate-300">GitHub Link (Optional)</Label>
                <Input
                  id="githubLink"
                  value={data?.githubUrl || postData?.githubLink}
                  onChange={(e)=>setPostData(prev => ({ ...prev, githubLink: e.target.value }))}
                  placeholder="https://github.com/username/repo"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>

              <div className="border-t border-slate-700 pt-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-400">
                    Your post will be visible to all developers in the community
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/dashboard')}
                      className="border-slate-600 text-slate-700 hover:text-white hover:bg-slate-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-blue-500 to-purple-600 active:from-blue-600 active:to-purple-700 text-white"
                      disabled={!postData.content.trim()}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Publish Post
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreatePost;
