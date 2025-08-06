import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ArrowLeft, Send, Phone, Video, MoreVertical, Search, Pin, Archive, Trash2, UserX, Flag } from 'lucide-react';

const Chat = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock user data
  const currentUser = {
    name: 'John Doe',
    username: '@johndoe',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face'
  };

  // Mock conversations data
  const conversations = [
    {
      id: 1,
      name: 'Sarah Chen',
      username: '@sarahdev',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c2c2?w=100&h=100&fit=crop&crop=face',
      isOnline: true,
      lastSeen: 'Active now',
      lastMessage: 'Great! I\'ll fork the repo and start working on some test utilities this weekend.',
      lastMessageTime: '2:37 PM',
      unreadCount: 2
    },
    {
      id: 2,
      name: 'Alex Rodriguez',
      username: '@alexcodes',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      isOnline: false,
      lastSeen: '2 hours ago',
      lastMessage: 'Thanks for the code review!',
      lastMessageTime: 'Yesterday',
      unreadCount: 0
    },
    {
      id: 3,
      name: 'Maya Patel',
      username: '@mayatech',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face',
      isOnline: true,
      lastSeen: 'Active now',
      lastMessage: 'Let\'s discuss the UI improvements tomorrow',
      lastMessageTime: '11:30 AM',
      unreadCount: 1
    },
    {
      id: 4,
      name: 'David Kim',
      username: '@daviddev',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      isOnline: false,
      lastSeen: '1 day ago',
      lastMessage: 'The mobile app looks great!',
      lastMessageTime: 'Monday',
      unreadCount: 0
    },
    {
      id: 5,
      name: 'Emma Wilson',
      username: '@emmacodes',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      isOnline: true,
      lastSeen: 'Active now',
      lastMessage: 'Docker setup is working perfectly now',
      lastMessageTime: 'Friday',
      unreadCount: 0
    }
  ];

  // Function to get messages for a specific user
  const getMessagesForUser = (user: any) => [
    {
      id: 1,
      sender: user.username,
      content: 'Hey! I saw your React TypeScript boilerplate. Looks awesome!',
      timestamp: '2:30 PM',
      isOwn: false
    },
    {
      id: 2,
      sender: currentUser.username,
      content: 'Thanks! I\'ve been working on it for a while. Feel free to contribute if you\'d like!',
      timestamp: '2:32 PM',
      isOwn: true
    },
    {
      id: 3,
      sender: user.username,
      content: 'I\'d love to! I have some ideas for testing utilities that might be useful.',
      timestamp: '2:33 PM',
      isOwn: false
    },
    {
      id: 4,
      sender: currentUser.username,
      content: 'That sounds perfect! Testing is definitely an area where we could improve.',
      timestamp: '2:35 PM',
      isOwn: true
    },
    {
      id: 5,
      sender: user.username,
      content: 'Great! I\'ll fork the repo and start working on some test utilities this weekend.',
      timestamp: '2:37 PM',
      isOwn: false
    }
  ];

  useEffect(() => {
    // If username is provided in URL, find and select that user
    if (username) {
      const user = conversations.find(conv => conv.username.replace('@', '') === username);
      if (user) {
        setSelectedUser(user);
        setMessages(getMessagesForUser(user));
      }
    }
  }, [username]);

  useEffect(() => {
    // Load messages when user is selected
    if (selectedUser) {
      setMessages(getMessagesForUser(selectedUser));
    }
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && selectedUser) {
      const newMessage = {
        id: messages.length + 1,
        sender: currentUser.username,
        content: message.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true
      };
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
    }
  };

  const handleUserSelect = (user: any) => {
    setSelectedUser(user);
    navigate(`/chat/${user.username.replace('@', '')}`);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="text-slate-300 hover:text-white mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-white">Messages</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[75vh]">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800/50 border-slate-700 h-full flex flex-col">
              <CardHeader className="border-b border-slate-700 pb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search conversations..."
                    className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                  />
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-y-auto p-0">
                {filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => handleUserSelect(conv)}
                    className={`flex items-center space-x-3 p-4 hover:bg-slate-700/50 cursor-pointer border-b border-slate-700/30 transition-colors ${
                      selectedUser?.id === conv.id ? 'bg-slate-700/70 border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={conv.avatar} alt={conv.name} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                          {conv.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {conv.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-white truncate">{conv.name}</h3>
                        <span className="text-xs text-slate-400">{conv.lastMessageTime}</span>
                      </div>
                      <p className="text-sm text-slate-400 truncate">{conv.lastMessage}</p>
                      <p className="text-xs text-slate-500">{conv.lastSeen}</p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <Badge className="bg-blue-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center">
                        {conv.unreadCount}
                      </Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            {selectedUser ? (
              <Card className="bg-slate-800/50 border-slate-700 h-full flex flex-col">
                {/* Chat Header */}
                <CardHeader className="border-b border-slate-700 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                            {selectedUser.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {selectedUser.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{selectedUser.name}</h3>
                        <p className="text-sm text-slate-400">{selectedUser.username}</p>
                        <p className="text-xs text-green-400">{selectedUser.lastSeen}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                        <Video className="w-4 h-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-slate-800 border-slate-700 text-white">
                          <DropdownMenuItem className="hover:bg-slate-700 focus:bg-slate-700">
                            <Pin className="w-4 h-4 mr-2" />
                            Pin Chat
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-slate-700 focus:bg-slate-700">
                            <Archive className="w-4 h-4 mr-2" />
                            Archive Chat
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-slate-700 focus:bg-slate-700">
                            <UserX className="w-4 h-4 mr-2" />
                            Block User
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-slate-700 focus:bg-slate-700">
                            <Flag className="w-4 h-4 mr-2" />
                            Report User
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-red-600 focus:bg-red-600 text-red-400 hover:text-white focus:text-white">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Chat
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${msg.isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        {!msg.isOwn && (
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs">
                              {selectedUser.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className={`rounded-2xl px-4 py-2 ${
                          msg.isOwn 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                            : 'bg-slate-700 text-slate-200'
                        }`}>
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                          <p className={`text-xs mt-1 ${msg.isOwn ? 'text-blue-100' : 'text-slate-400'}`}>
                            {msg.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </CardContent>

                {/* Message Input */}
                <div className="border-t border-slate-700 p-4">
                  <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                    />
                    <Button 
                      type="submit" 
                      size="icon"
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                      disabled={!message.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </Card>
            ) : (
              <Card className="bg-slate-800/50 border-slate-700 h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="text-6xl">💬</div>
                  <h3 className="text-xl font-semibold text-white">Select a conversation</h3>
                  <p className="text-slate-400">Choose a contact to start messaging</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;