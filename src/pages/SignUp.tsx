import React, { useState, KeyboardEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Github, Mail, Lock, ArrowLeft, User, MapPin, Link as LinkIcon, Briefcase, X, EyeClosed, Eye } from 'lucide-react';
import { handleEmailSignUp, handleGithubLogin, handleGoogleAuthLogin } from '../../backend/config.js'
import { toast } from '@/hooks/use-toast.js';
import { useSelector } from 'react-redux';

const SignUp = () => {

  const user = useSelector((state)=>state.auth.user);

  useEffect(() => {
    window.scrollTo(0,0);
    if(user)
      navigate('/dashboard');
  }, [user]);

  
  const [formData, setFormData] = useState({
    // Basic Information
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    
    // Profile Information
    username: '',
    bio: '',
    location: '',
    
    // Professional Information
    jobTitle: '',
    company: '',
    experience: '',
    
    // Social Links
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',

    profilePicture: '',
    
    followers: [],
    following: [],
    projects: [],
    
    // Preferences
    agreeToTerms: false
  });

  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confPassVisible, setConfPassVisible] = useState(false);

  const navigate = useNavigate();

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSkillKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill();
    }
  };

  const addSkill = () => {
    const skill = currentSkill.trim();
    if (skill && !skills.includes(skill)) {
      setSkills(prev => [...prev, skill]);
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(prev => prev.filter(skill => skill !== skillToRemove));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      toast({
          variant: "destructive",
          title: "Passwords do not match",
        });
      return;
    }
    
    if (!formData.agreeToTerms) {
      toast({
          variant: "destructive",
          title: "Please agree to the terms and conditions"
        });
      return;
    }

    const user = await handleEmailSignUp({...formData,skills});
    if(user){
      navigate('/dashboard');
      setTimeout(() => {
      toast({
        title: "User Created Successfully",
        className: "bg-green-600 text-white border-green-500",
      });
    }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Back to Home */}
        <Link to="/" className="inline-flex items-center text-slate-300 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">DC</span>
            </div>
            <h1 className="text-2xl font-bold text-white">DevConnect</h1>
          </div>
          <p className="text-slate-400">Join the developer community</p>
        </div>

        {/* Sign Up Form */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Create Your Account</CardTitle>
            <CardDescription className="text-slate-400">
              Fill in your details to join the developer community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-slate-600 pb-2">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-slate-200">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-slate-200">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-200">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-200">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        id="password"
                        name="password"
                        type={passwordVisible ? "text" : "password"}
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={handleInputChange}
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-slate-200">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={confPassVisible ? "text" : "password"}
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                        required
                      />
                    { confPassVisible ? 
                    <Eye size={17} className='bg-transparent text-slate-400 cursor-pointer absolute right-1 top-1/2 -translate-y-1/2 -translate-x-1/2 hover:bg-transparent' onClick={()=>setConfPassVisible(!confPassVisible)} />
                    :
                    <EyeClosed size={17} className='bg-transparent text-slate-400 cursor-pointer absolute right-1 top-1/2 -translate-y-1/2 -translate-x-1/2 hover:bg-transparent' onClick={()=>setConfPassVisible(!confPassVisible)} />
                    }
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-slate-600 pb-2">Profile Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-slate-200">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="@johndoe"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-slate-200">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    placeholder="Tell us about yourself and your interests..."
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 min-h-[80px]"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-slate-200">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      id="location"
                      name="location"
                      type="text"
                      placeholder="San Francisco, CA"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-slate-600 pb-2">Professional Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle" className="text-slate-200">Job Title</Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        id="jobTitle"
                        name="jobTitle"
                        type="text"
                        placeholder="Software Engineer"
                        value={formData.jobTitle}
                        onChange={handleInputChange}
                        className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-slate-200">Company</Label>
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      placeholder="Tech Corp"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience" className="text-slate-200">Years of Experience</Label>
                  <Input
                    id="experience"
                    name="experience"
                    type="text"
                    placeholder="e.g., 3 years"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills" className="text-slate-200">Skills</Label>
                  <div className="space-y-2">
                    <Input
                      id="skills"
                      name="skills"
                      type="text"
                      placeholder="Type a skill and press Enter"
                      value={currentSkill}
                      onChange={(e) => setCurrentSkill(e.target.value)}
                      onKeyDown={handleSkillKeyPress}
                      onBlur={addSkill}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                    />
                    {skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                          <Badge
                            key={index}
                            variant="default"
                            className="bg-blue-500/20 text-blue-300 pr-1"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="ml-1 hover:bg-blue-500/30 rounded-full p-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-slate-600 pb-2">Social Links</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="githubUrl" className="text-slate-200">GitHub Profile</Label>
                    <div className="relative">
                      <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        id="githubUrl"
                        name="githubUrl"
                        type="url"
                        placeholder="https://github.com/username"
                        value={formData.githubUrl}
                        onChange={handleInputChange}
                        className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedinUrl" className="text-slate-200">LinkedIn Profile</Label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        id="linkedinUrl"
                        name="linkedinUrl"
                        type="url"
                        placeholder="https://linkedin.com/in/username"
                        value={formData.linkedinUrl}
                        onChange={handleInputChange}
                        className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="portfolioUrl" className="text-slate-200">Portfolio Website</Label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        id="portfolioUrl"
                        name="portfolioUrl"
                        type="url"
                        placeholder="https://yourportfolio.com"
                        value={formData.portfolioUrl}
                        onChange={handleInputChange}
                        className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="flex items-center space-x-2">
                <Checkbox
                id="agreeToTerms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => handleCheckboxChange('agreeToTerms', checked as boolean)}
                />
                <Label htmlFor="agreeToTerms" className="text-slate-200 text-sm">
                    I agree to the{' '}
                    <Link to="/terms" className="text-blue-400 hover:text-blue-300">
                    Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-blue-400 hover:text-blue-300">
                    Privacy Policy
                    </Link>
                </Label>
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 active:from-blue-600 active:to-purple-700 text-white">
                Create Account
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
              Already have an account?{' '}
              <Link to="/signin" className="text-blue-400 hover:text-blue-300">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
