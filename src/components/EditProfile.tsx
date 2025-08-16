import React, { useState, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Github, Mail, User, MapPin, Link as LinkIcon, Briefcase, X, Save, ArrowLeft, Trash2, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { deleteUserAuth } from '../../backend/config.js'
import { useToast } from '@/hooks/use-toast.js';
import bcrypt from 'bcryptjs';
import { uploadToCloudinary , deleteProfileImage } from '../../backend/utils.js'

interface EditProfileProps {
  user:any;
  data:any;
  onBack: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ user, data, onBack }) => {
  const navigate = useNavigate();
  const {toast} = useToast();
  
  // Get existing user data from localStorage or use defaults
  // const existingData = data || "";
  const [existingData, setExistingData] = useState(data || '')
  const userEmail = user.email || 'user@example.com';
  const displayName = user.displayName;
  const [fname, lname] = displayName===null?"" : displayName.split(" ");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: fname || existingData.firstName || '',
    lastName: lname || existingData.lastName || '',
    email: userEmail,
    username: user.reloadUserInfo.screenName || existingData.username || '',
    bio: existingData.bio || '',
    location: existingData.location || '',
    jobTitle: existingData.jobTitle || '',
    company: existingData.company || '',
    experience: existingData.experience || '',
    githubUrl: existingData.githubUrl || '',
    linkedinUrl: existingData.linkedinUrl || '',
    portfolioUrl: existingData.portfolioUrl || '',
  });

  const [skills, setSkills] = useState<string[]>(existingData.skills || []);
  const [currentSkill, setCurrentSkill] = useState('');
  const [password, setPassword] = useState('');
  const [deleteText, setDeleteText] = useState('');
  const passwordVisible = user.providerData[0]?.providerId === 'password';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
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

  const handleDeleteProfileImage = async () => {
    const updatedData = {...existingData, profilePicture: ''};
    setExistingData(updatedData);
    await fetch(`http://localhost:5000/update-userData?uid=${encodeURIComponent(user.uid)}`,{method:"POST",headers:{'Content-Type':'application/json'},body:JSON.stringify(updatedData)});
    await deleteProfileImage(`profile_${user.uid}`);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    let profilePicture = '';
    if (selectedFile) {
      try {
        profilePicture = await uploadToCloudinary(selectedFile,user.uid);
        const updatedData = { ...formData, skills, profilePicture};
        await fetch(`http://localhost:5000/update-userData?uid=${encodeURIComponent(user.uid)}`,{method:"POST",headers:{'Content-Type':'application/json'},body:JSON.stringify(updatedData)});
        onBack(); // Go back to dashboard
      } catch (err) {
        console.error('Image upload failed:', err);
        toast({
          variant: "destructive",
          title: "Upload Failed",
          description: "Could not upload profile picture",
        });
        return;
      }
    }else{
      // Save updated profile data
      const updatedData = { ...formData, skills};
      await fetch(`http://localhost:5000/update-userData?uid=${encodeURIComponent(user.uid)}`,{method:"POST",headers:{'Content-Type':'application/json'},body:JSON.stringify(updatedData)});
      onBack(); // Go back to dashboard
    }
  };

  const userName = formData.firstName || formData.email.split('@')[0];

  const handleDeleteProfile = async () => {
    const providerId = user.providerData[0]?.providerId;
    if(providerId === 'password'){
      if(await bcrypt.compare(password,existingData.hashedPass)){
        navigate('/signin');
        await deleteProfileImage(`profile_${user.uid}`);
        await deleteUserAuth(user,password);
      }else{
        setPassword('');
        toast({
          variant:"destructive",
          title: "Incorrect Password",
          description:"Enter Correct Password"
        });
      }
    }else if(providerId==='google.com'){
      if(deleteText === existingData.username){
        navigate('/');
        await deleteUserAuth(user);
      }else{
        setDeleteText('');
        toast({
          variant:"destructive",
          title: "Incorrect Username",
          description:"Enter Correct Username to delete account"
        });
      }
    }else if(providerId==='github.com'){
      if(deleteText === existingData.username){
        navigate('/');
        await deleteUserAuth(user)
      }else{
        setDeleteText('');
        toast({
          variant:"destructive",
          title: "Incorrect Username",
          description:"Enter Correct Username to delete account"
        });
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-slate-300 hover:text-white hover:bg-slate-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="relative group">
              <Avatar className="w-16 h-16">
                <AvatarImage src={previewUrl || existingData.profilePicture || user.photoURL} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl">
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {existingData.profilePicture && (
                <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button
                  size="sm"
                  onClick={handleDeleteProfileImage}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 p-0 hover:scale-110 transition-transform duration-200"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              )}
              <Input 
              type="file"
              accept="image/*"
              id="fileInput"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {setSelectedFile(file);
                  const url = URL.createObjectURL(file)
                  setPreviewUrl(url);
                }
              }}
              />
                <Button
                size="sm"
                className="absolute -bottom-2 -right-2 rounded-full bg-blue-600 hover:bg-blue-700 w-8 h-8 p-0"
                onClick={()=>document.getElementById('fileInput')?.click()}
                >
                  <Camera className="w-3 h-3" />
                </Button>
              </div>
              <div>
                <CardTitle className="text-white">Edit Profile</CardTitle>
                <p className="text-slate-400">Update your profile information</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
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
                    />
                  </div>
                </div>

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
                    />
                  </div>
                </div>
              </div>

              {/* Profile Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-slate-600 pb-2">Profile Information</h3>
                
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

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button type="button" variant="outline" onClick={onBack} className="border-slate-600 text-slate-700 hover:text-white hover:bg-slate-700">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Delete Profile Section */}
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Profile
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-slate-800 border-slate-700">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription className="text-slate-400">
                        This action cannot be undone. This will permanently delete your profile and remove all your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    {passwordVisible ?( <div className="space-y-2">
                      <Label htmlFor="delete-password" className="text-slate-200">
                        Enter your password to confirm
                        </Label>
                        <Input
                        id="delete-password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                        />
                        </div>):(
                          <div className="space-y-2">
                      <Label htmlFor="delete-password" className="text-slate-200">
                        Enter your username to confirm
                        </Label>
                        <Input
                        id="delete-username"
                        type="text"
                        placeholder={`${existingData.username}`}
                        value={deleteText}
                        onChange={(e) => setDeleteText(e.target.value)}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                        />
                        </div>
                        )}
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDeleteProfile}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Yes, delete my profile
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
      </div>
    </div>
  );
};

export default EditProfile;
