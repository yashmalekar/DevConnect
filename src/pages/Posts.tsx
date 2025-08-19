import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { useSelector } from 'react-redux';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Heart, MessageSquare, Calendar, Edit, Trash2, Image, X } from 'lucide-react';

const Posts = () => {
  const navigate = useNavigate();
  const {toast} = useToast();
  const [posts,setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [isEditOpen ,setIsEditOpen] = useState(false);
  const [editTags, setEditTags] = useState('');
  const user = useSelector((state)=>state.auth.user)

  useEffect(() => {
    getPost();
  }, [])

    const handleLike = async (docId:String, postOwnerId:String,likesArray:String[]) =>{
    if(!user || !user.uid){
      navigate('/signin');
      return;
    }
    const alreadyLiked = likesArray ? likesArray.includes(user.uid) : false;
    const likeData = { postId:docId, postOwnerId, userId:user.uid, liked: alreadyLiked };
    const res = await fetch('http://localhost:5000/like-post', { method:'POST',headers:{'Content-Type':'application/json'},body: JSON.stringify(likeData)});
    if(res.ok){
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.docId === docId
          ? {
            ...post,
            likes: alreadyLiked
            ? post.likes.filter((id: string) => id !== user.uid)
            : [...post.likes, user.uid]
          }
          : post
        )
      );
    }
  }

    const handleEditPost = (post) => {
    setEditingPost(post);
    setEditContent(post.content);
    setIsEditOpen(true);
    setEditTags(post.tags.join(', '));
  };

  const handleSaveEdit = async () => {
    if (!editingPost) return;
    
    const updatedPosts = posts.map(post => 
      post.docId === editingPost.docId 
        ? { 
            ...post,
            content: editContent, 
            tags: editTags.split(',').map(tag => tag.trim()).filter(tag => tag)
          }
        : post
    );
    setPosts(updatedPosts);
    await fetch("http://localhost:5000/edit-post",{method:"POST", headers:{"Content-Type":"application/json"},body:JSON.stringify({docId:editingPost.docId,updatedData:updatedPosts.filter((post) => post.docId === editingPost.docId)[0]})});
    setEditingPost(null);
    setIsEditOpen(false);
    toast({
      title: "Post updated",
      description: "Your post has been successfully updated.",
    });
  };

  const handleDeletePost = async (postId:String, imageUrls:String[]) => {
    const updatedPosts = posts.filter(post => post.docId !== postId);
    setPosts(updatedPosts);
    await fetch("http://localhost:5000/delete-post",{method:"POST", headers:{"Content-Type":"application/json"},body:JSON.stringify({docId:postId, uid: user.uid, imageUrls})});
    toast({
      title: "Post deleted",
      description: "Your post has been successfully deleted.",
    });
  };

  const getPost = async ()=>{
    const data = await fetch('http://localhost:5000/get-posts',{method:"GET"});
    const posts1 = await data.json();
    setPosts(posts1.map((post) => ((post.uid === user.uid) ? post : null)).filter((post) => post !== null));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">My Posts</h1>
              <p className="text-slate-400">Manage and view your published content</p>
            </div>
          </div>
          <Button 
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            onClick={() => navigate('/feed/create')}
          >
            Create New Post
          </Button>
        </div>

        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.docId} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <Link to={`/profile/${post.username}`}>
                            <AvatarImage src={post.avatar} />
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                              {post.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Link>
                        </Avatar>
                        <div>
                          <Link to={`/profile/${post.username}`} className="font-medium text-white hover:underline cursor-pointer">{post.author}</Link>
                          <div className="flex items-center text-slate-400 text-sm">
                            <Calendar className="w-3 h-3 mr-1" />
                            {post.createdAt?._seconds? formatDistanceToNow(new Date(post.createdAt._seconds * 1000), { addSuffix: true }): "just now"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-slate-300 text-sm line-clamp-2">{post.content}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0,3).map((tag) => (
                        <Badge key={tag} variant="default" className="bg-blue-500/20 text-blue-300 text-xs cursor-pointer">
                          #{tag}
                        </Badge>
                      ))}
                      {post.tags.length > 3 && (
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
                      +{post.tags.length - 3} more
                    </Badge>
                  )}
                  {post.tags.slice(3).map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="default" 
                      className="bg-blue-500/20 cursor-pointer text-blue-300 text-xs hidden-tech hidden"
                    >
                      #{tag}
                    </Badge>
                  ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                        <div className="flex items-center space-x-6 text-slate-400">
                            <Button onClick={()=>handleLike(post.docId,post.uid,post.likes)} variant="default" size="sm" className="text-slate-400 bg-transparent hover:bg-transparent hover:text-red-400">
                                <Heart fill={`${(posts?(post.likes && user ? post.likes.includes(user.uid) : false):false) ? 'red' : 'none'}`} className={`w-4 h-4 ${(posts?(post.likes && user? post.likes.includes(user.uid) : false):false) ? 'text-red-700': ''}`} />
                            </Button>
                            {post.likes? post.likes.length : 0}
                            <Button onClick={()=>navigate(`/post/${post.docId}`)} variant="default" size="sm" className="text-slate-400 bg-transparent hover:bg-transparent hover:text-blue-400">
                                <MessageSquare className="w-4 h-4 mr-1" />
                                <span className='text-slate-400 font-normal text-[15px]'>{post.comments && post.comments.length || 0}</span>
                                </Button>
                        </div>
                      <div className="flex gap-2">
                        <Dialog  open={isEditOpen} onOpenChange={setIsEditOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="secondary" 
                              className="text-slate-700 hover:text-white hover:bg-primary"
                              onClick={() => handleEditPost(post)}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-slate-800 border-slate-700">
                            <DialogHeader>
                              <DialogTitle className="text-white">Edit Post</DialogTitle>
                              <DialogDescription className="text-slate-400">
                                Make changes to your post here. Click save when you're done.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <Label htmlFor="content" className="text-white">Content</Label>
                                <Textarea
                                  id="content"
                                  value={editContent}
                                  onChange={(e) => setEditContent(e.target.value)}
                                  className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="tags" className="text-white">Tags (comma separated)</Label>
                                <Input
                                  id="tags"
                                  value={editTags}
                                  onChange={(e) => setEditTags(e.target.value)}
                                  className="bg-slate-700 border-slate-600 text-white"
                                  placeholder="React, JavaScript, Web Development"
                                />
                              </div>
                              <Label className="text-slate-300">Images</Label>
                              <div className="flex items-center space-x-2">
                                <Input accept='image/*' type='file' id='Images' className='hidden' multiple  onChange={(e)=>{
                                  const files = e.target.files;
                                  if(files){
                                    // setImageFiles(Array.from(files));
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
                              {editingPost &&  editingPost.images.map((image,index)=>(
                                <div className="flex justify-between items-center gap-2 p-2 bg-slate-700 rounded" key={index}>
                                  <img src={image} alt={index} className='w-12 h-12 object-cover rounded' />
                                  <Button size='sm' variant='outline' className='border-red-600 text-red-400 hover:bg-red-600 hover:text-white'>
                                    <X className='w-4 h-4 cursor-pointer' />
                                  </Button>
                                </div>
                              ))}
                            </div>
                            <DialogFooter>
                              <Button 
                                type="submit" 
                                onClick={handleSaveEdit}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                Save changes
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-slate-800 border-slate-700">
                            <DialogHeader>
                              <DialogTitle className="text-white">Delete Post</DialogTitle>
                              <DialogDescription className="text-slate-400">
                                Are you sure you want to delete this post? This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <DialogTrigger asChild>
                                <Button variant="outline" className="border-slate-600 text-slate-400 hover:bg-slate-700">
                                  Cancel
                                </Button>
                              </DialogTrigger>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="destructive"
                                  onClick={() => handleDeletePost(post.docId,post.images)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </Button>
                              </DialogTrigger>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>

              {post.images && post.images.length > 0 && (
                <div className="w-32 h-24 flex-shrink-0">
                  <img
                    src={post.images[0]}
                    alt="Post Image"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-slate-400 text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
            <p className="text-slate-400 mb-4">Start sharing your thoughts and experiences with the community</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Posts;