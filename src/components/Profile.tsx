/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Calendar, Compass, Shield, User, Award, Activity, Heart, Eye } from 'lucide-react';
import { motion } from 'motion/react';
import { Language, TRANSLATIONS } from '../translations';

interface SkillBar {
  name: string;
  value: number;
  icon: string;
  color: string;
  desc: string;
}

export default function Profile({ lang }: { lang: Language }) {
  const [visitorCount, setVisitorCount] = useState(128);
  const [statusIdx, setStatusIdx] = useState(0);

  const t = TRANSLATIONS[lang];

  // Simulate visitors and pick a random activity index
  useEffect(() => {
    const saved = localStorage.getItem('zhuang_visitors');
    let count = 128;
    if (saved) {
      count = parseInt(saved, 10) + 1;
    } else {
      count = 128 + Math.floor(Math.random() * 20);
    }
    setVisitorCount(count);
    localStorage.setItem('zhuang_visitors', count.toString());

    // Random status index (0 to 4)
    setStatusIdx(Math.floor(Math.random() * 5));
  }, []);

  const statusClasses = [
    'bg-[#F1F3EF] text-[#5A6A58] border-[#E6E2D3]',
    'bg-[#E9EDC9]/40 text-[#5A6A58] border-[#CCD5AE]',
    'bg-[#FEFAE0] text-[#A67C52] border-[#E6E2D3]',
    'bg-[#F1F3EF] text-[#5A6A58] border-[#E6E2D3]',
    'bg-[#FDF2E9] text-[#A67C52] border-[#F0EDE4]'
  ];

  const currentStatusText = t[`radarStatus${statusIdx}` as keyof typeof t] || t.radarStatus0;
  const currentStatusClass = statusClasses[statusIdx];

  const SKILLS: SkillBar[] = [
    { name: t.skillsSwimName, value: 85, icon: '🏊‍♂️', color: 'bg-natural-green', desc: t.skillsSwimDesc },
    { name: t.skillsAnglingName, value: 95, icon: '🎣', color: 'bg-[#CCD5AE]', desc: t.skillsAnglingDesc },
    { name: t.skillsPaddleName, value: 90, icon: '🏄‍♂️', color: 'bg-natural-sand', desc: t.skillsPaddleDesc },
    { name: t.skillsCodingName, value: 80, icon: '💻', color: 'bg-natural-dark', desc: t.skillsCodingDesc },
    { name: t.skillsMechaName, value: 85, icon: '🤖', color: 'bg-natural-darkgreen', desc: t.skillsMechaDesc },
    { name: t.skills3DPrintName, value: 88, icon: '🖨️', color: 'bg-sky-400', desc: t.skills3DPrintDesc },
  ];

  return (
    <div id="profile-container" className="space-y-6">
      {/* Bio Presentation Block */}
      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-natural-border flex flex-col md:flex-row gap-6 items-center">
        {/* Kid Avatar Visual Layout */}
        <div className="relative shrink-0 flex flex-col items-center">
          <div className="w-32 h-32 rounded-full border-4 border-natural-border-light bg-gradient-to-tr from-natural-green via-natural-olive to-natural-sand p-1 shadow-xs relative overflow-hidden flex items-center justify-center">
            {/* Simple high quality child visual representation */}
            <span className="text-6xl select-none animate-playful-bounce">👦</span>
          </div>
          
          <div className="absolute -bottom-2 bg-natural-darkgreen text-white text-[10px] font-bold px-3 py-1 rounded-full border-2 border-white shadow-xs">
            {t.grade}
          </div>
        </div>

        {/* Text biography details */}
        <div className="flex-1 text-center md:text-left space-y-3.5">
          <div className="flex flex-col md:flex-row items-center md:items-baseline gap-2.5">
            <h2 className="text-2xl font-black text-natural-heading font-display">
              {lang === 'zh' ? '我是壮壮' : 'I am Zhuangzhuang'}
            </h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#F1F3EF] border border-[#E6E2D3] rounded-full text-[#5A6A58] text-xs font-bold font-sans">
              {t.identityBadge}
            </span>
          </div>

          {/* Slogan */}
          <p className="text-sm text-natural-text font-bold bg-natural-bg/50 p-4 rounded-2xl border border-[#F0EDE4] max-w-lg leading-relaxed italic">
            {t.slogan}
          </p>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs font-semibold text-[#6B6B5E] font-sans">
            <div className="flex items-center justify-center md:justify-start gap-1.5">
              <Calendar className="w-4 h-4 text-[#A3A38E]" />
              <span>{t.infoConstellation}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-1.5">
              <Compass className="w-4 h-4 text-[#A3A38E]" />
              <span>{t.infoDream}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-1.5">
              <Heart className="w-4 h-4 text-natural-sand fill-current" />
              <span>{t.infoFood}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-1.5">
              <Eye className="w-4 h-4 text-[#A3A38E]" />
              <span>{t.infoBadge}</span>
            </div>
          </div>

          {/* Current Activity Banner */}
          <div className="pt-2 border-t border-[#F0EDE4] flex flex-col sm:flex-row items-center gap-2 text-xs">
            <span className="text-[#A3A38E] font-bold">{t.radarLabel}</span>
            <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${currentStatusClass} animate-pulse`}>
              {currentStatusText}
            </span>
          </div>
        </div>
      </div>

      {/* Skills Progress Dashboard */}
      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-natural-border">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-natural-green" />
          <h3 className="text-base font-bold text-natural-heading font-display">{t.superpowersTitle}</h3>
        </div>

        <div className="space-y-4">
          {SKILLS.map((skill) => (
            <div key={skill.name} className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#4A4A40] flex items-center gap-1">
                  <span>{skill.icon}</span>
                  <span>{skill.name}</span>
                </span>
                <span className="font-bold text-[#A3A38E]">{skill.value} / 100</span>
              </div>
              
              <div className="w-full bg-[#F1F3EF] h-2.5 rounded-full overflow-hidden relative border border-[#E6E2D3]/50">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.value}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className={`h-full rounded-full ${skill.color}`}
                />
              </div>
              <p className="text-[10px] text-[#A3A38E] font-semibold pl-6">{skill.desc}</p>
            </div>
          ))}
        </div>

        {/* Counter of visits at bottom */}
        <div className="mt-6 pt-4 border-t border-[#F0EDE4] flex justify-between items-center text-[11px] text-[#A3A38E] font-bold font-sans">
          <span>{t.anniversary}</span>
          <span className="bg-[#F1F3EF] border border-[#E6E2D3] px-2.5 py-1 rounded-lg text-[#6B6B5E]">
            {t.visitorLabel.replace('{count}', visitorCount.toString())}
          </span>
        </div>
      </div>
    </div>
  );
}
