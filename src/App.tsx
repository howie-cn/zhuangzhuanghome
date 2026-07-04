/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, Heart, MessageSquare, Camera, Sparkles, BookOpen, Music, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Profile from './components/Profile';
import Hobbies from './components/Hobbies';
import PhotoScrapbook from './components/PhotoScrapbook';
import InteractionHub from './components/InteractionHub';
import { Language, TRANSLATIONS } from './translations';

type TabId = 'profile' | 'hobbies' | 'scrapbook' | 'interaction';

interface TabConfig {
  id: TabId;
  labelKey: keyof typeof TRANSLATIONS['zh'];
  icon: React.ReactNode;
  activeColor: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('profile');
  const [bgMusic, setBgMusic] = useState(false);
  const [lang, setLang] = useState<Language>('zh');

  const t = TRANSLATIONS[lang];

  const TABS: TabConfig[] = [
    {
      id: 'profile',
      labelKey: 'aboutTab',
      icon: <User className="w-4 h-4" />,
      activeColor: 'bg-natural-green text-white shadow-xs'
    },
    {
      id: 'hobbies',
      labelKey: 'hobbiesTab',
      icon: <Sparkles className="w-4 h-4" />,
      activeColor: 'bg-[#CCD5AE] text-natural-darkgreen shadow-xs'
    },
    {
      id: 'scrapbook',
      labelKey: 'photosTab',
      icon: <Camera className="w-4 h-4" />,
      activeColor: 'bg-natural-sand text-white shadow-xs'
    },
    {
      id: 'interaction',
      labelKey: 'circlesTab',
      icon: <MessageSquare className="w-4 h-4" />,
      activeColor: 'bg-natural-dark text-white shadow-xs'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <Profile lang={lang} />;
      case 'hobbies':
        return <Hobbies lang={lang} />;
      case 'scrapbook':
        return <PhotoScrapbook lang={lang} />;
      case 'interaction':
        return <InteractionHub lang={lang} />;
      default:
        return <Profile lang={lang} />;
    }
  };

  return (
    <div className="min-h-screen bg-natural-bg font-sans text-natural-text selection:bg-[#E9EDC9] selection:text-[#4A4A40] pb-12">
      {/* Decorative Top Wave Ribbon with Natural Tones */}
      <div className="h-2.5 bg-gradient-to-r from-natural-green via-natural-olive to-natural-sand w-full" />

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        
        {/* Top Header & Navigation Banner */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white px-6 py-4 rounded-[32px] border border-natural-border shadow-sm">
          <div className="flex items-center gap-3">
            {/* Playful animated logo */}
            <div className="w-12 h-12 bg-natural-green rounded-2xl flex items-center justify-center shadow-xs">
              <span className="text-2xl animate-playful-bounce select-none">🐳</span>
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-xl font-extrabold text-natural-heading font-display tracking-tight flex items-center justify-center sm:justify-start gap-1">
                <span>{t.siteTitle}</span>
                <span className="text-natural-green text-sm font-sans font-medium">{t.siteSubtitle}</span>
              </h1>
              <p className="text-[10px] text-natural-muted font-bold uppercase tracking-wider">
                {t.siteSubText}
              </p>
            </div>
          </div>

          {/* Interactive music button, language switcher and quick status */}
          <div className="flex items-center gap-2.5">
            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
              className="p-2 px-3 rounded-xl border border-natural-border bg-white text-xs font-bold text-natural-muted hover:text-natural-heading hover:bg-natural-bg transition-all cursor-pointer flex items-center gap-1 shadow-xs"
              title={lang === 'zh' ? 'Switch to English' : '切换至中文'}
            >
              🌐 <span className="font-sans">{lang === 'zh' ? 'English' : '中文'}</span>
            </button>

            {/* Cute ambient sounds controller */}
            <button
              onClick={() => setBgMusic(!bgMusic)}
              className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold shadow-xs ${
                bgMusic 
                  ? 'bg-[#F1F3EF] border-natural-green text-natural-darkgreen font-bold' 
                  : 'bg-white hover:bg-natural-bg border-natural-border text-natural-muted'
              }`}
              title="背景白噪音/音乐"
            >
              {bgMusic ? (
                <>
                  <Volume2 className="w-4 h-4 text-natural-green animate-pulse" />
                  <span className="hidden md:inline">{t.musicOn}</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span className="hidden md:inline">{t.musicOff}</span>
                </>
              )}
            </button>

            {/* Hidden audio tag for calming rain focus sound */}
            {bgMusic && (
              <audio
                autoPlay
                loop
                src="https://assets.mixkit.co/active_storage/sfx/2433/2433-84.wav"
                onError={() => console.log('Audio file failed to load, ignore')}
              />
            )}
          </div>
        </header>

        {/* Tab Selection Navigation */}
        <nav className="bg-white p-2 rounded-2xl border border-natural-border shadow-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
            {TABS.map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? tab.activeColor
                      : 'text-natural-muted hover:text-natural-heading hover:bg-[#F1F3EF]'
                  }`}
                >
                  {tab.icon}
                  <span>{TRANSLATIONS[lang][tab.labelKey]}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Main Panel Content with Slide-In Transitions */}
        <main className="min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Playful kid-friendly Footer */}
        <footer className="text-center space-y-2.5 pt-6 border-t border-natural-border">
          <div className="flex justify-center items-center gap-2 text-xs font-semibold text-natural-muted">
            <span>{t.designedWith}</span>
            <Heart className="w-3.5 h-3.5 text-natural-sand fill-current animate-pulse" />
            <span>{t.designedBy}</span>
          </div>
          <p className="text-[10px] text-natural-muted font-bold">
            {t.footerCopyright}
          </p>
        </footer>

      </div>
    </div>
  );
}
