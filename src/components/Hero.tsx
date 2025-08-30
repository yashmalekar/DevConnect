import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Github, Users, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const Hero = () => {

  const user = useSelector((state)=>state.auth.user)

  useEffect(() => {
    window.scrollTo(0,0);
  }, [])
  
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          {/* Badge */}
          <Badge className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-blue-300 border-blue-500/30 hover:bg-gradient-to-r hover:from-blue-500/30 hover:to-purple-600/30">
            🚀 Where developers connect and grow
          </Badge>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="text-white">The</span>{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
                Developer
              </span>{' '}
              <span className="text-white">Social Network</span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Connect with developers worldwide, showcase your projects, share knowledge, and build your professional network in tech.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {!user && (
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 active:from-blue-600 active:to-purple-700 text-slate-900 px-8 py-3 text-lg">
                <Users className="w-5 h-5 mr-2" />
                  Join DevConnect
              </Button>
            </Link>
            )}
            <Link to="/projects">
              <Button variant="outline" size="lg" className="border-slate-600 text-slate-700 hover:bg-slate-800 hover:text-white px-8 py-3 text-lg">
                  <Github className="w-5 h-5 mr-2" />
                    Explore Projects
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-md mx-auto pt-8">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white">10K+</div>
              <div className="text-sm text-slate-400">Developers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white">25K+</div>
              <div className="text-sm text-slate-400">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white">50K+</div>
              <div className="text-sm text-slate-400">Connections</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
