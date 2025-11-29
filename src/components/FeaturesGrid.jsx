import React from 'react';
import { FileText, Zap, Github } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-black p-8 hover:bg-neutral-900 transition-colors group">
    <div className="mb-4 text-white p-2 border border-gray-800 inline-block group-hover:border-white transition-colors">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
  </div>
);

const FeaturesGrid = () => {
  const features = [
    {
      icon: FileText,
      title: "Context Aware",
      description: "The AI understands dependency trees. It doesn't just read files; it understands how your modules interact."
    },
    {
      icon: Zap,
      title: "Instant Setup Guides",
      description: "Automatically generates 'npm install' or 'pip install' instructions based on your lock files."
    },
    {
      icon: Github,
      title: "Direct PR Integration",
      description: "Don't want to copy-paste? We can open a Pull Request directly to your repository with the new README."
    }
  ];

  return (
    <div id="features" className="border-t border-gray-800 bg-neutral-950 relative z-20">
      <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-800 border border-gray-800">
          {features.map((f, i) => (
            <FeatureCard key={i} {...f} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesGrid;