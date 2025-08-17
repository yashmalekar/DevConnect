import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageSquare, Github } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { useSelector } from 'react-redux';

export const FeedPreview = () => {
  const [posts, setPosts] = useState([]);
  const user = useSelector((state)=>state.auth.data);

  useEffect(() => {
    getPost();
  }, [])

    const getPost = async () => {
      const posts1= await fetch('http://localhost:5000/get-posts',{method:"GET"}).then(res => res.json());
      setPosts(posts1);
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
        {posts.sort(()=>Math.random()-0.5).slice(0,3).map((post) => (
          <Card key={post.docId} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 hover:scale-[1.02]">
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
                    <span className="text-slate-400 text-sm">{post.createdAt?._seconds? formatDistanceToNow(new Date(post.createdAt._seconds * 1000), { addSuffix: true }): "just now"}</span>
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
                {post.tags.slice(0,3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30">
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
              <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                <div className="flex items-center space-x-6 text-slate-400">
                  <Button size='sm' variant='default' className="text-slate-400 bg-transparent hover:bg-transparent hover:text-red-400">
                    <Heart fill={`${(posts?(post.likes && user ? post.likes.includes(user.uid) : false):false) ? 'red' : 'none'}`} className={`w-4 h-4 ${(posts?(post.likes && user? post.likes.includes(user.uid) : false):false) ? 'text-red-700': ''}`} />
                  </Button>
                    {post.likes? post.likes.length : 0}
                  <Button size='sm' variant='default' className="text-slate-400 bg-transparent hover:bg-transparent hover:text-blue-400">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    <span className='text-slate-400 font-normal text-[15px]'>{post.comment ? post.comment.length : 0}</span>
                  </Button>
                </div>
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
