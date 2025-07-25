import React from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { FeedPreview } from '@/components/FeedPreview';
import { ProjectsPreview } from '@/components/ProjectsPreview';
import { CommunityStats } from '@/components/CommunityStats';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        <FeedPreview />
        <ProjectsPreview />
        <CommunityStats />
      </div>
    </div>
  );
};

export default Index;
