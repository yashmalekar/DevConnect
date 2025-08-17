import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Send, Heart, Github } from 'lucide-react';
import { useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import io from 'socket.io-client';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

const PostLoader = ()=>{
  return(
    <div className='mb-4'>
      <Card className='bg-slate-800/50 border-slate-700 hover:bg-slate-800/70'>
        <CardHeader className='pb-3'>
          <div className="flex items-center space-x-3">
            <Skeleton className='w-12 h-12 rounded-full bg-slate-700' />
            <div className="flex-1">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Skeleton className='h-2 w-2/12 bg-slate-700' />
                  <Skeleton className='h-2 w-2/12 bg-slate-700' />
                </div>
                <div className="flex items-center space-x-2">
                  <Skeleton className='h-2 w-2/12 bg-slate-700' />
                  <Skeleton className='h-2 w-2/12 bg-slate-700' />
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-3">
            <Skeleton className='h-3 w-3/4 bg-slate-700' />
            <Skeleton className='h-3 w-3/4 bg-slate-700' />
            <span className='flex flex-wrap gap-2'>
              <Skeleton className='h-3 w-10 bg-slate-700' />
              <Skeleton className='h-3 w-10 bg-slate-700' />
              <Skeleton className='h-3 w-10 bg-slate-700' />
              <Skeleton className='h-3 w-10 bg-slate-700' />
            </span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-700">
            <div className="flex items-center space-x-6 text-slate-400">
              <Skeleton className='h-5 w-5 bg-slate-700' />
              <Skeleton className='h-5 w-5 bg-slate-700' />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const AddCommLoader = ()=>{
  return (
      <CardContent className='pb-3 pt-6'>
        <div className="flex space-x-3">
          <Skeleton className='w-12 h-12 rounded-full bg-slate-700' />
          <div className="flex-1 flex space-x-3">
                <Skeleton className='bg-slate-700 min-h-[75px] w-3/4' />
                <Skeleton className='h-8 w-10 bg-slate-700 self-end' />
          </div>
        </div>
      </CardContent>
  )
}

const CommLoader = () =>{
  return(
    <div className='space-y-4 mb-2'>
      <Card className='bg-slate-800/50 border-slate-700'>
        <CardContent className='pb-3 pt-6'>
          <div className="flex space-x-3 mb-2">
            <Skeleton className='w-12 h-12 rounded-full bg-slate-700' />
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Skeleton className='h-2 w-2/12 bg-slate-700' />
                <Skeleton className='h-2 w-2/12 bg-slate-700' />
                <Skeleton className='h-2 w-1 bg-slate-700' />
                <Skeleton className='h-2 w-2/12 bg-slate-700' />
              </div>
            </div>
          </div>
          <Skeleton className='bg-slate-700 h-3 w-3/4 mb-2' />
          <Skeleton className='bg-slate-700 h-3 w-3/4 mb-2' />
          <div className='flex items-center border-t border-slate-700 space-x-2'>
          </div>
          <div className="space-x-2 flex">
            <Skeleton className='h-4 w-4 bg-slate-700 mt-2' />
            <Skeleton className='h-4 w-4 bg-slate-700 mt-2' />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const Comments = () => {
  const location = useLocation();
  const user = useSelector((state)=>state.auth.data);
  const socket = io('http://localhost:5000');
  const navigate = useNavigate();
  const[post,setPost] = useState<Object | null>({});
  const [postLoading, setPostLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [comments,setComments] = useState([]);

  useEffect(()=>{
    window.scrollTo(0,0);
    postData();
    
    socket.on("receiveComment",(data)=>{
      setComments((prev)=>[...prev,data]);
    })

    return ()=>{
      socket.off("receiveComment");
    }
  },[]);

  useEffect(()=>{
    if(post && post.docId && post.uid){
      getComments(post.docId,post.uid);
    }
  },[post])

  const postData = async ()=>{
    const data = await fetch('http://localhost:5000/get-posts',{method:"GET"}).then(res=>res.json());
    const data1 = data.filter((post1)=>post1.docId===location.pathname.slice(6))[0]
    setPost(data1);
    setPostLoading(false);
  }

  const getComments = async (postId:String,postUid:String)=>{
    const data = await fetch(`http://localhost:5000/get-comments?postId=${postId}&userId=${postUid}`,{method:'GET'});
    const data1 = await data.json();
    setComments(Array.isArray(data1) ? data1 : []);
    setCommentLoading(false);
  }

  const handleCommentLike = async (userId:String,postOwnerId:String ,postId:String, commId:String, likesArray:String[])=>{
    if(!user || !user.uid){
      navigate('/signin');
      return ;
    }
    const alreadyLiked = likesArray ? likesArray.includes(user.uid) : false;
    const likeData = {userId, postOwnerId,  postId, commId, alreadyLiked};
    const res = await fetch('http://localhost:5000/like-comment', {method:"POST", headers:{'Content-Type':'application/json'}, body:JSON.stringify(likeData)});
    if(res.ok){
      setComments(prevComments =>
        prevComments.map(comment =>
          comment.commId === commId
            ? {
                ...comment,
                likes: alreadyLiked
                  ? comment.likes.filter((id: string) => id !== user.uid)
                  : (comment.likes ? [...comment.likes, user.uid] : [user.uid])
              }
            : comment
        )
      );
    }
  }

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;

    socket.emit("sendComment",{
      userId: post.uid,
      postId: post.docId,
      author: user.firstName + ' ' + user.lastName,
      avatar: user.profilePicture,
      username: user.username,
      content: newComment,
    });

    setNewComment('');
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

        {postLoading ? <PostLoader />:(
          <Card className="bg-slate-800/50 border-slate-700 mb-6">
          {/* Original Post */}
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Avatar className="w-12 h-12 cursor-pointer">
                    <AvatarImage src={post.avatar} alt={post.author} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      {post.author}
                    </AvatarFallback>
                  </Avatar>
                </DialogTrigger>
                <DialogContent className="max-w-md p-0 border-0 bg-transparent">
                  <img src={post.avatar} alt={post.author} className="w-full h-auto max-h-[80vh] object-contain rounded-lg" />
                </DialogContent>
              </Dialog>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-white">
                    <Link to={`/profile/${post.username}`}>
                      {post.author}
                    </Link>
                  </h3>
                  <span className="text-slate-400 text-sm">
                    <Link to={`/profile/${post.username}`}>
                      @{post.username}
                    </Link>
                  </span>
                  <span className="text-slate-500 text-sm">·</span>
                  <span className="text-slate-400 text-sm">{post.createdAt?._seconds? formatDistanceToNow(new Date(post.createdAt._seconds * 1000), { addSuffix: true }): "just now"}</span>
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
              {/* Image gallery */}
              {post.images && post.images.length > 0 && (
                  <div className={`grid gap-2 ${
                    post.images.length === 1 ? 'grid-cols-1' : 
                    post.images.length === 2 ? 'grid-cols-2' : 
                    post.images.length === 3 ? 'grid-cols-3' :
                    post.images.length >= 4 ? 'grid-cols-2' : 'grid-cols-2'
                  }`}>
                    {post.images.length <= 4 ? (
                      // Show all images if 4 or fewer
                      post.images.map((image, index) => (
                        <Dialog key={index}>
                          <DialogTrigger asChild>
                            <img
                              src={image}
                              alt={`Post image ${index + 1}`}
                              className="w-full h-48 object-cover rounded-lg hover:opacity-90 transition-opacity cursor-pointer hover:scale-[1.02]"
                            />
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] p-0 border-0 bg-transparent">
                            <div className="relative">
                              <img
                                src={image}
                                alt={`Post image ${index + 1}`}
                                className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
                              />
                            </div>
                          </DialogContent>
                        </Dialog>
                      ))
                    ) : (
                      // Show first 3 images and a gallery preview for the rest
                      <>
                        {post.images.slice(0, 3).map((image, index) => (
                          <Dialog key={index}>
                            <DialogTrigger asChild>
                              <img
                                src={image}
                                alt={`Post image ${index + 1}`}
                                className="w-full h-48 object-cover rounded-lg hover:opacity-90 transition-opacity cursor-pointer hover:scale-[1.02]"
                              />
                            </DialogTrigger>
                            <DialogContent className="max-w-6xl max-h-[90vh] p-4 border-0 bg-slate-900/95 backdrop-blur-sm">
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[80vh] overflow-y-auto">
                                {post.images.map((galleryImage, galleryIndex) => (
                                  <Dialog key={galleryIndex}>
                                    <DialogTrigger asChild>
                                      <img
                                        src={galleryImage}
                                        alt={`Gallery image ${galleryIndex + 1}`}
                                        className="w-full h-32 object-cover rounded-lg hover:opacity-90 transition-opacity cursor-pointer hover:scale-105"
                                      />
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl max-h-[90vh] p-0 border-0 bg-transparent">
                                      <img
                                        src={galleryImage}
                                        alt={`Full size image ${galleryIndex + 1}`}
                                        className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
                                      />
                                    </DialogContent>
                                  </Dialog>
                                ))}
                              </div>
                            </DialogContent>
                          </Dialog>
                        ))}
                        <Dialog>
                          <DialogTrigger asChild>
                            <div className="relative w-full h-48 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors cursor-pointer flex items-center justify-center group">
                              <div className="text-center text-white">
                                <div className="text-2xl font-bold mb-1">+{post.images.length - 3}</div>
                                <div className="text-sm opacity-80">more</div>
                              </div>
                              <div 
                                className="absolute inset-0 bg-cover bg-center rounded-lg opacity-30 group-hover:opacity-50 transition-opacity"
                                style={{ backgroundImage: `url(${post.images[3]})` }}
                              />
                            </div>
                          </DialogTrigger>
                          <DialogContent className="max-w-6xl max-h-[90vh] p-4 border-0 bg-slate-900/95 backdrop-blur-sm">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[80vh] overflow-y-auto">
                              {post.images.map((galleryImage, galleryIndex) => (
                                <Dialog key={galleryIndex}>
                                  <DialogTrigger asChild>
                                    <img
                                      src={galleryImage}
                                      alt={`Gallery image ${galleryIndex + 1}`}
                                      className="w-full h-32 object-cover rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                                    />
                                  </DialogTrigger>
                                  <DialogContent className="max-w-4xl max-h-[90vh] p-0 border-0 bg-transparent">
                                    <img
                                      src={galleryImage}
                                      alt={`Full size image ${galleryIndex + 1}`}
                                      className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
                                    />
                                  </DialogContent>
                                </Dialog>
                              ))}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </>
                    )}
                </div>
              )}
            <div className="flex flex-wrap gap-2">
              {(post.tags || []).map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30">
                  #{tag}
                </Badge>
              ))}
            </div>
            <div className="flex items-center space-x-6 mt-4 pt-4 border-t border-slate-700">
              <span className="text-slate-400 text-sm">{post.likes && post.likes.length || 0} likes</span>
              <span className="text-slate-400 text-sm">{post.comment && post.comment.length || 0} comments</span>
            </div>
          </CardContent>
        </Card>
        )}


        {/* Add Comment Section */}
        {user && (
          <Card className="bg-slate-800/50 border-slate-700 mb-6">
          {postLoading ? <AddCommLoader /> :(
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
          )}
          </Card>
        )}

        {!postLoading && commentLoading && Array.from({length:3}).map((_,index)=>(
          <CommLoader key={`skeleton-${index}`} />
        ))}

        {/* Comments List */}
        <div className="space-y-4">
          {comments && comments.reverse().map((comment) => (
            <Card key={comment.commId} className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <div className="flex space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={comment.avatar} alt={comment.author} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm">
                      {comment.author.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-white text-sm">{comment.author}</h4>
                      <span className="text-slate-400 text-xs">@{comment.username}</span>
                      <span className="text-slate-500 text-xs">·</span>
                      <span className="text-slate-400 text-xs">{comment.createdAt?formatDistanceToNow(comment.createdAt, {addSuffix:true} ): "just now"}</span>
                    </div>
                    <p className="text-slate-200 text-sm leading-relaxed mb-3">{comment.content}</p>
                    <div className="flex items-center text-slate-400 space-x-4">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleCommentLike(user?user.uid:'', comment.userId, comment.postId, comment.commId, comment.likes)}
                        className='text-slate-400 bg-transparent hover:bg-transparent hover:text-red-400'
                      >
                        <Heart fill={(comment?(comment.likes && user ? comment.likes.includes(user.uid):false):false) ? 'red' : 'none' } className={`w-3 h-3 ${(comment?(comment.likes && user ? comment.likes.includes(user.uid):false):false) ? 'text-red-400' : '' }`} />
                      </Button>
                        {comment.likes && comment.likes.length || 0}
                      {/* <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-slate-400 hover:text-white hover:bg-primary"
                      >
                        Reply
                      </Button> */}
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