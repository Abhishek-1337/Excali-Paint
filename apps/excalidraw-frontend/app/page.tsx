"use client"

import React, { useState, useEffect } from 'react';
import { Pencil, Sparkles, Palette, Users, Zap, Download } from 'lucide-react';

export default function DrawingAppLanding() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const parallaxOffset = scrollY * 0.3;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Subtle background texture */}
      <div className="fixed inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      {/* Navigation */}
      <nav className="relative z-10 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 border-2 border-gray-900 rounded-lg flex items-center justify-center transform rotate-12">
              <Pencil className="w-5 h-5 -rotate-12" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold tracking-tight">ExcaliPaint</span>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-2 rounded-lg hover:bg-blue-800 hover:text-white transition-all duration-200 font-medium bg-blue-600 text-white cursor-pointer">
              Sign in
            </button>
            <button className="px-6 py-2 border-2 border-gray-900 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium cursor-pointer">
              Sign up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="container mx-auto px-6 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-8">
              <span className="px-4 py-2 border border-gray-300 rounded-full text-sm text-gray-600">
                Free & Open Source
              </span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight tracking-tight">
              Draw Your
              <br />
              <span className="relative inline-block">
                Ideas
                <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 400 12" fill="none">
                  <path d="M2 6C50 2, 350 10, 398 6" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              A minimalist canvas for sketching ideas, wireframing designs, 
              and bringing your creative visions to life
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
              <button className="px-8 py-4 bg-gray-900 text-white rounded-lg text-lg font-medium hover:bg-gray-800 transition-all duration-200 hover:shadow-lg">
                Start Creating
              </button>
              <button className="px-8 py-4 border-2 border-gray-900 rounded-lg text-lg font-medium hover:bg-gray-50 transition-all duration-200">
                View Examples
              </button>
            </div>

            {/* Drawing preview mockup */}
            <div 
              className="relative"
              style={{ transform: `translateY(${-parallaxOffset * 0.5}px)` }}
            >
              <div className="mx-auto max-w-5xl border-2 border-gray-200 rounded-2xl p-8 bg-gray-50 shadow-2xl">
                <div className="bg-white rounded-xl p-12 aspect-video flex items-center justify-center relative border border-gray-200">
                  <svg viewBox="0 0 400 200" className="w-full h-full">
                    <path
                      d="M 50 150 Q 100 50, 150 150 T 250 150 Q 300 100, 350 150"
                      stroke="#000"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                      opacity="0.8"
                    />
                    <circle cx="80" cy="80" r="30" stroke="#000" strokeWidth="2.5" fill="none" opacity="0.7" />
                    <rect x="280" y="60" width="60" height="60" stroke="#000" strokeWidth="2.5" fill="none" opacity="0.7" rx="8" />
                    <line x1="180" y1="50" x2="220" y2="50" stroke="#000" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
                    <line x1="200" y1="30" x2="200" y2="70" stroke="#000" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-6 py-24">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-20 tracking-tight">
            Simple Tools, Powerful Results
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { icon: Zap, title: 'Lightning Fast', desc: 'Smooth drawing experience with zero lag' },
              { icon: Users, title: 'Collaborate', desc: 'Work together with your team in real-time' },
              { icon: Palette, title: 'Customizable', desc: 'Infinite colors and creative freedom' },
              { icon: Download, title: 'Export', desc: 'Save as PNG, SVG, or share with a link' },
              { icon: Sparkles, title: 'Hand-drawn', desc: 'Beautiful sketchy aesthetic' },
              { icon: Pencil, title: 'Intuitive', desc: 'Everything you need, nothing you don\'t' }
            ].map((feature, i) => (
              <div 
                key={i}
                className="group p-8 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 border-2 border-gray-900 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 container mx-auto px-6 py-24">
        <div className="max-w-3xl mx-auto text-center border-2 border-gray-900 rounded-2xl p-16 bg-gray-50">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Ready to Start
            <br />
            Creating?
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Join thousands of creators, designers, and dreamers already using SketchFlow
          </p>
          <button className="px-10 py-5 bg-gray-900 text-white rounded-lg text-xl font-medium hover:bg-gray-800 transition-all duration-200 hover:shadow-xl">
            Get Started for Free
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-200 py-12 bg-gray-50">
        <div className="container mx-auto px-6 text-center text-gray-600">
          <p className="font-medium">Made with care for creators everywhere</p>
          <p className="mt-2 text-sm">Open source • Privacy-first • No sign-up required</p>
        </div>
      </footer>
    </div>
  );
}