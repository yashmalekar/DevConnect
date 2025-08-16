import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ArrowLeft, Send, Phone, Video, MoreVertical, Search, Pin, Archive, Trash2, UserX, Flag, MessageCircle, X, Plus, UserPlus } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

const Chat = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showNewChat, setShowNewChat] = useState(false);
  const [newChatUsername, setNewChatUsername] = useState('');
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

  const handleBackClick = () => {
    setSelectedUser(null);
    setShowNewChat(false);
    setNewChatUsername('');
    setMessages([]);
    navigate(-1);
  };

    const handleNewChat = () => {
    setShowNewChat(true);
    setSearchQuery('');
  };

  const handleStartNewChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (newChatUsername.trim()) {
      const newUser = {
        id: Date.now(),
        name: newChatUsername.charAt(0).toUpperCase() + newChatUsername.slice(1),
        username: `@${newChatUsername.toLowerCase()}`,
        avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`,
        isOnline: true,
        lastSeen: 'Active now',
        lastMessage: '',
        lastMessageTime: 'Now',
        unreadCount: 0
      };
      setSelectedUser(newUser);
      setMessages([]);
      setShowNewChat(false);
      setNewChatUsername('');
      navigate(`/chat/${newUser.username.replace('@', '')}`);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen bg-background dark flex flex-col">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Conversations Sidebar */}
        <div className={`${selectedUser ? 'hidden lg:flex' : 'flex'} lg:w-80 w-full flex-col border-r border-border bg-card`}>
          {/* Sidebar Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBackClick}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-xl font-semibold text-foreground">Messages</h1>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleNewChat}
                className="text-muted-foreground hover:text-foreground"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {showNewChat ? (
              <form onSubmit={handleStartNewChat} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="icon"
                    onClick={() => setShowNewChat(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <h3 className="text-sm font-medium text-foreground">New Chat</h3>
                </div>
                <div className="relative">
                  <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="text"
                    value={newChatUsername}
                    onChange={(e) => setNewChatUsername(e.target.value)}
                    placeholder="Enter username..."
                    className="pl-10 text-white"
                    autoFocus
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={!newChatUsername.trim()}
                >
                  Start Chat
                </Button>
              </form>
            ) : (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="pl-10 text-white"
                />
              </div>
            )}
            </div>
          
          {/* Conversations List */}
          <ScrollArea className="flex-1">
            <div className="p-2">
              {!showNewChat && filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => handleUserSelect(conv)}
                  className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors ${
                    selectedUser?.id === conv.id ? 'bg-accent border-l-4 border-l-primary' : ''
                  }`}
                >
                  <div className="relative">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={conv.avatar} alt={conv.name} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {conv.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                      </DialogTrigger>
                      <DialogContent className='max-w-md p-0 border-0 bg-transparent'>
                        <div className="relative">
                          <img
                          src={conv.avatar}
                          alt="Profile Image"
                          className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                    {conv.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-foreground truncate">{conv.name}</h3>
                      <span className="text-xs text-muted-foreground">{conv.lastMessageTime}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                    <p className="text-xs text-muted-foreground">{conv.lastSeen}</p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <Badge variant="default" className="text-xs min-w-[20px] h-5 flex items-center justify-center">
                      {conv.unreadCount}
                    </Badge>
                  )}
                </div>
              ))}
              {showNewChat && (
                <div className="p-4 text-center text-muted-foreground">
                  <UserPlus className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Enter a username above to start a new conversation</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className={`${selectedUser ? 'flex' : 'hidden lg:flex'} flex-1 flex-col`}>
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border bg-card flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleBackClick}
                    className="lg:hidden text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {selectedUser.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {selectedUser.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{selectedUser.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedUser.username}</p>
                    <p className="text-xs text-green-500">{selectedUser.lastSeen}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-popover border-border text-popover-foreground z-50">
                      <DropdownMenuItem className="hover:bg-destructive focus:bg-destructive text-destructive hover:text-destructive-foreground focus:text-destructive-foreground">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Chat
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4 pb-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${msg.isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        {!msg.isOwn && (
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                              {selectedUser.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className={`rounded-2xl px-4 py-2 ${
                          msg.isOwn 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                          <p className={`text-xs mt-1 opacity-70`}>
                            {msg.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t border-border bg-card">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 text-white"
                  />
                  <Button 
                    type="submit" 
                    size="icon"
                    className="shrink-0"
                    disabled={!message.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-background">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Select a conversation</h3>
                <p className="text-muted-foreground max-w-sm">Choose a contact from your conversations to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;