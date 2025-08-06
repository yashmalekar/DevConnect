import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search,MessageSquare, User, Users, Github, LogOut } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../../Redux/authSlice'
import { auth } from '../../backend/config'
import { toast } from '@/hooks/use-toast';

export const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state)=>state.auth.user)

  const handleSignOut = () => {
    dispatch(clearUser())
    auth.signOut();
      setTimeout(() => {
      toast({
        title: "Signed Out Successfully",
        className: "bg-green-600 text-white border-green-500",
      });
    }, 500);
    navigate('/');
  };

  return (
    <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">DC</span>
            </div>
            <h1 className="text-xl font-bold text-white">DevConnect</h1>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search developers, projects, or skills..."
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-4">
            <Link to="/discover">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-700">
                <Users className="w-4 h-4 mr-2" />
                Discover
              </Button>
            </Link>
            <Link to="/projects">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-700">
                <Github className="w-4 h-4 mr-2" />
                Projects
              </Button>
            </Link>
            <Link to="/feed">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-700">
                Feed
              </Button>
            </Link>
            
            {user ? (
              <>
                <Link to="/chat">
                  <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white">
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="ghost" size="icon" className="text-slate-300 bg-slate-700">
                    <User className="w-4 h-4" />
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-slate-300 hover:text-red-400"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Link to="/signin">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                  Sign In
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
