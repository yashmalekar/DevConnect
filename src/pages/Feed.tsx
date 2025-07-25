import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Github, Heart, MessageSquare, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getPosts } from '../../backend/utils.js'
import { formatDistanceToNow } from 'date-fns';

const Feed = () => {

  const navigate = useNavigate();
  const user = useSelector((state)=>state.auth.user)
  const data = useSelector((state)=>state.auth.postData)
  
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState(data);

  
  useEffect(() => {
    window.scrollTo(0,0);
    getPost();

  }, [])
  
  const loadMorePosts = async () => {
    if (!lastDoc) return;
    
    setLoading(true);
    const { posts: newPosts, lastVisible: newLastDoc } = await getPosts(5, lastDoc);

    setPosts(prev => [...prev, ...newPosts]);
    setLastDoc(newLastDoc);
    setHasMore(newPosts.length === 5);
    setLoading(false);
};


  const handlePost = ()=>{
    const isAuthenticated = user;
    if (isAuthenticated===null) {
      navigate('/signin');
    }else
    navigate('/feed/create')
  };

  
  const getPost = async () => {
    setLoading(true);
    const { posts: fetchedPosts, lastVisible } = await getPosts(5);
    setPosts(fetchedPosts);
    setLastDoc(lastVisible);
    setHasMore(fetchedPosts.length === 5);
    setLoading(false)
  };


    const handleAuthClick = (username:string) =>{
      const cleanUserName = username.replace('@',"");
      navigate(`/profile/${cleanUserName}`);
    };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Developer Feed</h1>
          <Button onClick={()=>handlePost()} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create Post
          </Button>
        </div>

        <div className="space-y-6">
          {posts && posts.map((post) => (
            <Card key={post.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={post.avatar} alt={post.author} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      {post.author.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-white">{post.author}</h3>
                      <span className="text-slate-400 text-sm">@{post.username}</span>
                      <span className="text-slate-500 text-sm">·</span>
                      <span className="text-slate-400 text-sm">{post.time?.seconds? formatDistanceToNow(new Date(post.time.seconds * 1000), { addSuffix: true }): "just now"}</span>
                    </div>
                  </div>
                  {post.githubLink && (
                    <a href={`${post.githubLink}`} target='_blank'>
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-700">
                      <Github className="w-4 h-4" />
                    </Button>
                    </a>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-200 leading-relaxed">{post.content}</p>

              {/* Image gallery */}
              {post.images && post.images.length > 0 && (
                <div className={`grid gap-2 ${post.images.length === 1 ? 'grid-cols-1' : post.images.length === 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
                  {post.images.map((image:any, index:any) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Post image ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg hover:opacity-90 transition-opacity"
                    />
                  ))}
                </div>
              )}
                
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                <div className="flex items-center space-x-6 text-slate-400">
                  <Button variant="default" size="sm" className="text-slate-400 bg-transparent hover:bg-transparent hover:text-red-400">
                    <Heart className="w-4 h-4" />
                  </Button>
                    {/* {post.likes} */}28
                  <Button onClick={()=>navigate(`/post/${post.docId}`)} variant="default" size="sm" className="text-slate-400 bg-transparent hover:bg-transparent hover:text-blue-400">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    <span className='text-slate-400 font-normal text-[15px]'>{/* {post.comments} */}28</span>
                  </Button>
                </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {posts.length === 0 && !loading && (
            <div className="text-white text-center text-2xl">No Posts Found</div>
            )}
        </div>

        {hasMore &&
        <div className="text-center mt-8">
          <Button variant="outline" size="lg" disabled={loading} onClick={loadMorePosts} className="border-slate-600 text-slate-700 hover:text-white hover:bg-slate-800">
            {loading ? 'Loading...' :'Load More Posts'}
          </Button>
        </div>
        }
      </div>
    </div>
  );
};

export default Feed;
