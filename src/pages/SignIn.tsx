import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, Mail, Lock, ArrowLeft, Eye, EyeClosed } from 'lucide-react';
import { handleGithubLogin, handleEmailLogin, handleGoogleAuthLogin } from '../../backend/config.js'
import { useToast } from '@/hooks/use-toast.js';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent)=>{
    e.preventDefault();
    const user = await handleEmailLogin(email,password);
    if(user?.user)
      navigate('/dashboard');
    else{
      toast({
          variant: "destructive",
          title: "Invalid Login Credentials",
          description: "Please check your email and password and try again.",
        });
    }
  }

  const handleGitLogin = async () =>{
    const user = await handleGithubLogin();
    if(user?.user)
      navigate('/dashboard');
  }

  const handleGoogleLogin = async () =>{
    const user = await handleGoogleAuthLogin();
    if(user?.user)
      navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back */}
        <Link to='/' className="inline-flex items-center text-slate-300 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Link>

        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">DC</span>
            </div>
            <h1 className="text-2xl font-bold text-white">DevConnect</h1>
          </div>
          <p className="text-slate-400">Welcome back to the developer community</p>
        </div>

        {/* Sign In Form */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Sign In</CardTitle>
            <CardDescription className="text-slate-400">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e)=>handleSignIn(e)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-200">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="password"
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                    required
                  />
                    { passwordVisible ? 
                    <Eye size={17} className='bg-transparent text-slate-400 cursor-pointer absolute right-1 top-1/2 -translate-y-1/2 -translate-x-1/2 hover:bg-transparent' onClick={()=>setPasswordVisible(!passwordVisible)} />
                    :
                    <EyeClosed size={17} className='bg-transparent text-slate-400 cursor-pointer absolute right-1 top-1/2 -translate-y-1/2 -translate-x-1/2 hover:bg-transparent' onClick={()=>setPasswordVisible(!passwordVisible)} />
                    }
                </div>
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                Sign In
              </Button>
            </form>

            <div className="mt-6 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-slate-800 px-2 text-slate-400">Or continue with</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button onClick={()=>handleGoogleLogin()} variant="outline" className="w-full border-slate-600 text-slate-700 hover:text-white hover:bg-slate-700">
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </Button>
                
                <Button onClick={()=>handleGitLogin()} variant="outline" className="w-full border-slate-600 text-slate-700 hover:text-white hover:bg-slate-700">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                  </Button>
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-slate-400">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-400 hover:text-blue-300">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
