import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Github, MessageSquare, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CommunityStats = () => {
  const stats = [
    {
      icon: Users,
      label: 'Active Developers',
      value: '10,247',
      growth: '+12% this month',
      color: 'text-blue-400'
    },
    {
      icon: Github,
      label: 'Projects Shared',
      value: '25,891',
      growth: '+8% this month',
      color: 'text-purple-400'
    },
    {
      icon: MessageSquare,
      label: 'Discussions',
      value: '89,432',
      growth: '+15% this month',
      color: 'text-green-400'
    },
    {
      icon: Star,
      label: 'Stars Given',
      value: '156,789',
      growth: '+23% this month',
      color: 'text-yellow-400'
    }
  ];

  return (
    <section className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-white">Growing Community</h2>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          Join thousands of developers who are already part of our thriving community. Connect, learn, and grow together.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 hover:scale-105">
            <CardContent className="p-6 text-center space-y-4">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-slate-700/50 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
                <div className="text-xs text-green-400">{stat.growth}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 border border-blue-500/20 rounded-xl p-8 text-center space-y-6">
        <h3 className="text-2xl font-bold text-white">Ready to join the community?</h3>
        <p className="text-slate-300 max-w-lg mx-auto">
          Connect with like-minded developers, showcase your projects, and accelerate your career growth.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/signup">
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-slate-900 px-8">
              Get Started Free
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="border-slate-600 text-slate-700 hover:text-white hover:bg-slate-800">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
};
