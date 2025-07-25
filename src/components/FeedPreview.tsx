
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageSquare, Github, ExternalLink } from 'lucide-react';
import { getPosts } from '../../backend/utils.js'
import { formatDistanceToNow } from 'date-fns';
import { useSelector } from 'react-redux';

export const FeedPreview = () => {

  const data = useSelector((state)=>state.auth.postData)
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if(data)
      {
        setPosts(data);
      }
      else
        getPost();
  }, [])

    const getPost = async () => {
      const posts1= await getPosts();
      setPosts(posts1.posts);
    };

  return (
    <section className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-white">Developer Feed</h2>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          Stay updated with the latest from the developer community. Share your projects, insights, and connect with peers.
        </p>
      </div>

      <div className="grid gap-6 max-w-4xl mx-auto">
        {[...posts].sort(()=>Math.random()-0.5).slice(0,3).map((post) => (
          <Card key={post.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 hover:scale-[1.02]">
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
                    <span className="text-slate-400 text-sm">{post.username}</span>
                    <span className="text-slate-500 text-sm">·</span>
                    <span className="text-slate-400 text-sm">{post.time?.seconds? formatDistanceToNow(new Date(post.time.seconds * 1000), { addSuffix: true }): "just now"}</span>
                  </div>
                </div>
                {post.githubLink && (
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                    <Github className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-200 leading-relaxed">{post.content}</p>
              
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Link to="/feed">
          <Button variant="outline" size="lg" className="border-slate-600 text-slate-700 hover:text-white hover:bg-slate-800">
            View More Posts
          </Button>
        </Link>
      </div>
    </section>
  );
};
