import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const TrendingContent = () => {
  const [trendingPosts, setTrendingPosts] = useState([]);

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async ()=>{
    const data = await fetch('http://localhost:5000/get-posts',{method:"GET"});
    setTrendingPosts(await data.json());
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
          Trending Content
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Trending Posts */}
        <div>
          <h4 className="text-slate-300 font-medium mb-3 flex items-center">
            <MessageSquare className="w-4 h-4 mr-2 text-green-400" />
            Popular Posts
          </h4>
          <div className="space-y-3">
            {trendingPosts.map((post, index) => (
              <div>
                {(post.likes && post.likes.length >2)  && (
                  <div key={index} className="p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors cursor-pointer">
                    <h5 className="text-slate-200 text-sm font-medium mb-1">{post.content}</h5>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>by {post.author} • {post.createdAt?._seconds? formatDistanceToNow(new Date(post.createdAt._seconds * 1000), { addSuffix: true }): "just now"}</span>
                      </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendingContent;