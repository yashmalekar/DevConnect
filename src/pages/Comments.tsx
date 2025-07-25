import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Send, Heart, Github } from 'lucide-react';
import { useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';

const Comments = () => {
  const location = useLocation();
  const user = useSelector((state)=>state.auth.data);
  const data = useSelector((state) => state.auth.postData).find((post) => post.docId === location.pathname.slice(6));
  const navigate = useNavigate();
  const[post,setPost] = useState({});
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'John Doe',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      username: '@johndoe',
      time: '2h ago',
      content: 'Great work! This looks really useful. Can\'t wait to try it out.',
      likes: 5,
      liked: false
    },
    {
      id: 2,
      author: 'Jane Smith',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c2c2?w=100&h=100&fit=crop&crop=face',
      username: '@janesmith',
      time: '1h ago',
      content: 'Amazing project! I love how clean the code structure is. Would love to contribute if it\'s open source.',
      likes: 3,
      liked: false
    },
    {
      id: 3,
      author: 'Mike Johnson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      username: '@mikej',
      time: '45m ago',
      content: 'This is exactly what I needed for my current project. Thanks for sharing!',
      likes: 2,
      liked: false
    },
    {
      id: 4,
      author: 'Sarah Wilson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      username: '@sarahw',
      time: '30m ago',
      content: 'Fantastic implementation! The TypeScript integration is really well done. Could you share some insights on your testing approach?',
      likes: 7,
      liked: true
    },
    {
      id: 5,
      author: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      username: '@alexc',
      time: '15m ago',
      content: 'This is inspiring! I\'ve been working on something similar but your approach is much more elegant.',
      likes: 1,
      liked: false
    }
  ]);

  useEffect(()=>{
    setPost(data);
  })


  const handleCommentLike = (commentId: number) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { 
            ...comment, 
            liked: !comment.liked,
            likes: comment.liked ? comment.likes - 1 : comment.likes + 1
          }
        : comment
    ));
  };

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;

    const newCommentObj = {
      id: comments.length + 1,
      author: 'You',
      avatar: '',
      username: '@you',
      time: 'now',
      content: newComment,
      likes: 0,
      liked: false
    };

    setComments(prev => [newCommentObj, ...prev]);
    setNewComment('');
    console.log('New comment added:', newComment);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <Button
            variant="default"
            onClick={() => navigate(-1)}
            className="text-slate-400 bg-transparent hover:text-white mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-white">Comments</h1>
        </div>

        {/* Original Post */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={post.avatar} alt={post.author} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  {/* {post.author.split(' ').map(n => n[0]).join('')} */}
                  {post.author}
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
                <a href={`${post.githubLink}`} target='_blank'>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-700">
                    <Github className="w-4 h-4" />
                  </Button>
                </a>
              )}
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className="text-slate-200 leading-relaxed">{post.content}</p>
            <div className="flex flex-wrap gap-2">
              {(post.tags || []).map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30">
                  #{tag}
                </Badge>
              ))}
            </div>
            <div className="flex items-center space-x-6 mt-4 pt-4 border-t border-slate-700">
              <span className="text-slate-400 text-sm">{post.likes || 0} likes</span>
              <span className="text-slate-400 text-sm">{post.comments || 0} comments</span>
            </div>
          </CardContent>
        </Card>

        {/* Add Comment Section */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardContent className="pt-6">
            <div className="flex space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user.profilePicture} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm">
                  {user.firstName.charAt(0).toUpperCase() + user.lastName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 flex space-x-3">
                <Textarea
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 min-h-[80px]"
                />
                <Button
                  onClick={handleCommentSubmit}
                  disabled={!newComment.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white self-end"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id} className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <div className="flex space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={comment.avatar} alt={comment.author} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm">
                      {comment.author.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-white text-sm">{comment.author}</h4>
                      <span className="text-slate-400 text-xs">{comment.username}</span>
                      <span className="text-slate-500 text-xs">·</span>
                      <span className="text-slate-400 text-xs">{comment.time}</span>
                    </div>
                    <p className="text-slate-200 text-sm leading-relaxed mb-3">{comment.content}</p>
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCommentLike(comment.id)}
                        className={`text-xs ${comment.liked ? 'text-red-400 hover:text-red-300' : 'text-slate-400 hover:text-red-400'}`}
                      >
                        <Heart className={`w-3 h-3 mr-1 ${comment.liked ? 'fill-current' : ''}`} />
                        {comment.likes}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-slate-400 hover:text-blue-400"
                      >
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Comments;