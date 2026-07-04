/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Waves, Anchor, Trophy, Eye, Info, Sparkles, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FishCatch } from '../types';
import { Language, TRANSLATIONS } from '../translations';

const FISH_SPECIES: Omit<FishCatch, 'weight' | 'length'>[] = [
  { name: '野生鲫鱼 (Crucian Carp)', rarity: 'common', icon: '🐟', color: 'text-slate-400' },
  { name: '金灿灿黄颡鱼 (Yellow Catfish)', rarity: 'common', icon: '🐠', color: 'text-yellow-500' },
  { name: '大口黑鲈 (Black Bass)', rarity: 'rare', icon: '🐟', color: 'text-teal-600 font-bold' },
  { name: '红尾翘嘴鲌 (Culters)', rarity: 'rare', icon: '🐠', color: 'text-rose-400 font-bold' },
  { name: '中华鲟 (Chinese Sturgeon)', rarity: 'epic', icon: '🦈', color: 'text-indigo-600 font-extrabold' },
  { name: '祁连山虹鳟 (Rainbow Trout)', rarity: 'epic', icon: '🐡', color: 'text-pink-500 font-extrabold' },
  { name: '湖底巨无霸青鱼 (Giant Carp)', rarity: 'legendary', icon: '🐳', color: 'text-purple-600 font-black animate-pulse' },
  { name: '一只破旧的红雨靴 (Old Rainboot)', rarity: 'common', icon: '🥾', color: 'text-amber-700' },
];

const getFishName = (name: string, lang: Language) => {
  if (lang === 'zh') {
    return name.split(' (')[0];
  } else {
    const match = name.match(/\(([^)]+)\)/);
    return match ? match[1] : name;
  }
};

export default function FishingGame({ lang }: { lang: Language }) {
  const [gameState, setGameState] = useState<'idle' | 'casting' | 'nibbling' | 'reeled' | 'missed'>('idle');
  const [fishTrophy, setFishTrophy] = useState<FishCatch[]>([]);
  const [currentCatch, setCurrentCatch] = useState<FishCatch | null>(null);
  
  const t = TRANSLATIONS[lang];
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Set initial status message based on language
  useEffect(() => {
    if (gameState === 'idle') {
      setStatusMessage(lang === 'zh' 
        ? '湖水平静，阳光正好。装上壮壮特制红虫饵，准备抛竿吧！🎣' 
        : 'The lake is calm and the sun is shining. Put on Zhuangzhuang’s special redworm bait and get ready to cast! 🎣'
      );
    }
  }, [lang, gameState]);

  // Load trophies from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('zhuang_trophies');
    if (saved) {
      try {
        setFishTrophy(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveTrophy = (newTrophyList: FishCatch[]) => {
    setFishTrophy(newTrophyList);
    localStorage.setItem('zhuang_trophies', JSON.stringify(newTrophyList));
  };

  const castLine = () => {
    if (gameState === 'casting' || gameState === 'nibbling') return;

    setGameState('casting');
    setCurrentCatch(null);
    setStatusMessage(lang === 'zh' 
      ? '🌊 扑通！鱼漂稳稳地立在了水面。屏住呼吸，静静等待...' 
      : '🌊 Splash! The float sits steadily on the water. Hold your breath and wait...'
    );

    const waitTime = 2000 + Math.random() * 3000; // wait 2-5 seconds
    const timeout = setTimeout(() => {
      setGameState('nibbling');
      setNibbleStartTime(Date.now());
      setStatusMessage(lang === 'zh' 
        ? '⚡ 鱼漂猛地一沉！咕噜咕噜！鱼儿咬钩了！快点击「猛烈收线」！！！' 
        : '⚡ The float sinks suddenly! Gurgle gurgle! A fish bit the hook! Click "Reel In" quickly!!!'
      );
      
      // Auto escape if user doesn't reel in within 950ms
      const escapeTimeout = setTimeout(() => {
        setGameState('missed');
        setStatusMessage(lang === 'zh' 
          ? '💨 哎呀！起竿太慢了，聪明的鱼儿吃掉鱼饵溜走了！😭' 
          : '💨 Ah! Too slow! The clever fish ate the bait and swam away! 😭'
        );
      }, 950);
      
      setBiteTimeout(escapeTimeout);
    }, waitTime);

    setBiteTimeout(timeout);
  };

  const [biteTimeout, setBiteTimeout] = useState<NodeJS.Timeout | null>(null);
  const [nibbleStartTime, setNibbleStartTime] = useState<number>(0);

  const reelIn = () => {
    // Clear any active timeouts
    if (biteTimeout) {
      clearTimeout(biteTimeout);
    }

    if (gameState === 'casting') {
      setGameState('missed');
      setStatusMessage(lang === 'zh' 
        ? '💨 收线太早啦！水里的鱼被你吓跑了。钓鱼需要耐心喔！🧘‍♂️' 
        : '💨 Reeled in too early! The fish in the water were scared away. Fishing requires patience! 🧘‍♂️'
      );
      return;
    }

    if (gameState === 'nibbling') {
      const reactionTime = Date.now() - nibbleStartTime;
      setGameState('reeled');

      // Randomly select a fish template
      const roll = Math.random();
      let selectedSpecies: Omit<FishCatch, 'weight' | 'length'>;

      if (roll < 0.4) {
        // Common (40%)
        const commons = FISH_SPECIES.filter(f => f.rarity === 'common');
        selectedSpecies = commons[Math.floor(Math.random() * commons.length)];
      } else if (roll < 0.75) {
        // Rare (35%)
        const rares = FISH_SPECIES.filter(f => f.rarity === 'rare');
        selectedSpecies = rares[Math.floor(Math.random() * rares.length)];
      } else if (roll < 0.95) {
        // Epic (20%)
        const epics = FISH_SPECIES.filter(f => f.rarity === 'epic');
        selectedSpecies = epics[Math.floor(Math.random() * epics.length)];
      } else {
        // Legendary (5%)
        const legendaries = FISH_SPECIES.filter(f => f.rarity === 'legendary');
        selectedSpecies = legendaries[Math.floor(Math.random() * legendaries.length)];
      }

      // Generate random weight/length based on rarity
      let weight = 0.2;
      let length = 15;
      if (selectedSpecies.rarity === 'common') {
        weight = +(0.1 + Math.random() * 0.5).toFixed(2);
        length = +(10 + Math.random() * 15).toFixed(1);
      } else if (selectedSpecies.rarity === 'rare') {
        weight = +(0.6 + Math.random() * 1.5).toFixed(2);
        length = +(22 + Math.random() * 20).toFixed(1);
      } else if (selectedSpecies.rarity === 'epic') {
        weight = +(1.8 + Math.random() * 3.0).toFixed(2);
        length = +(38 + Math.random() * 30).toFixed(1);
      } else {
        weight = +(5.0 + Math.random() * 10.0).toFixed(2);
        length = +(65 + Math.random() * 60).toFixed(1);
      }

      // Special check for trash bootstrap
      if (selectedSpecies.name.includes('雨靴') || selectedSpecies.name.includes('Rainboot')) {
        weight = 1.2;
        length = 30.0;
      }

      const isProtected = selectedSpecies.name.includes('中华鲟') || selectedSpecies.name.includes('Sturgeon');

      const catchResult: FishCatch = {
        name: selectedSpecies.name,
        weight,
        length,
        rarity: selectedSpecies.rarity,
        icon: selectedSpecies.icon,
        color: selectedSpecies.color,
      };

      setCurrentCatch(catchResult);

      if (isProtected) {
        setStatusMessage(lang === 'zh'
          ? `🦈 中华鲟是国家一级保护动物哦！壮壮对它拍了照纪念，并小心地把它放流回大自然中啦！爱心满满，获得大自然守护勋章！🍀`
          : `🦈 The Chinese Sturgeon is a class-A protected species! Zhuangzhuang took a photo to remember it and carefully released it back to nature! Full of love, you gained the Nature Defender Medal! 🍀`
        );
      } else if (selectedSpecies.name.includes('雨靴') || selectedSpecies.name.includes('Rainboot')) {
        setStatusMessage(lang === 'zh'
          ? `♻️ 哎呀，钓上了一个破雨靴！壮壮决定把它分类丢进垃圾桶，保护湖泊生态人人有责！`
          : `♻️ Oh dear, you caught an old rainboot! Zhuangzhuang decided to sort and throw it into the trash can. Protecting lake ecology is everyone's responsibility!`
        );
      } else {
        const transName = getFishName(catchResult.name, lang);
        setStatusMessage(lang === 'zh'
          ? `✨ 完美起竿！反应速度：${(reactionTime / 1000).toFixed(2)}秒！你成功钓起了：${transName}！👏`
          : `✨ Perfect reel! Reaction speed: ${(reactionTime / 1000).toFixed(2)}s! You successfully caught a: ${transName}! 👏`
        );
      }

      // Add to trophies
      const newTrophy = [catchResult, ...fishTrophy];
      saveTrophy(newTrophy);
    } else {
      setGameState('missed');
      setStatusMessage(lang === 'zh'
        ? '❓ 水面静止的时候收线，除了钩子什么都没有喔。'
        : '❓ Reeling in when the water is quiet yields nothing but an empty hook.'
      );
    }
  };

  const clearTrophies = () => {
    const msg = lang === 'zh' 
      ? '确定要清空鱼篓重新钓鱼吗？' 
      : 'Are you sure you want to empty the basket and start over?';
    if (window.confirm(msg)) {
      saveTrophy([]);
    }
  };

  // Calculate stats
  const totalCaught = fishTrophy.length;
  const realFish = fishTrophy.filter(f => !f.name.includes('雨靴') && !f.name.includes('Rainboot'));
  const heaviest = realFish.reduce((max, f) => (f.weight > max ? f.weight : max), 0);
  const longest = realFish.reduce((max, f) => (f.length > max ? f.length : max), 0);
  const releaseCount = fishTrophy.filter(f => f.name.includes('中华鲟') || f.name.includes('Sturgeon')).length;

  return (
    <div id="fishing-game-container" className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 flex flex-col md:flex-row gap-8">
      {/* Fishing Action Zone */}
      <div className="flex-1 flex flex-col items-center justify-between min-h-[350px]">
        <div className="text-center mb-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-sky-50 text-sky-600 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
            <Waves className="w-3.5 h-3.5" /> {lang === 'zh' ? '户外冒险 · 壮壮的钓鱼角' : "Outdoor Adventure · Zhuangzhuang's Corner"}
          </span>
          <h3 className="text-xl font-bold text-slate-800 font-display">{lang === 'zh' ? '快乐生态钓鱼塘' : 'Happy Eco-Fishing Pond'}</h3>
        </div>

        {/* Fishing Pond Visual Stage */}
        <div className="relative w-full max-w-[340px] aspect-[4/3] bg-gradient-to-b from-sky-200 via-sky-300 to-indigo-400 rounded-2xl overflow-hidden shadow-inner flex flex-col items-center justify-center border-4 border-slate-200/60">
          
          {/* Decorative Waves */}
          <div className="absolute inset-0 opacity-25 flex flex-col justify-between p-2 select-none pointer-events-none">
            <div className="animate-pulse text-2xl">〰️</div>
            <div className="text-right text-xl">〰️</div>
            <div className="animate-pulse text-2xl">〰️</div>
          </div>

          <AnimatePresence mode="wait">
            {gameState === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center gap-3 z-10"
              >
                <span className="text-5xl animate-bounce">🎣</span>
                <span className="text-xs bg-slate-900/40 text-white px-3 py-1 rounded-full font-medium">
                  {lang === 'zh' ? '鱼竿已备好' : 'Fishing Rod Ready'}
                </span>
              </motion.div>
            )}

            {gameState === 'casting' && (
              <motion.div
                key="casting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-2 z-10"
              >
                {/* Float floating animation */}
                <motion.div
                  animate={{ y: [0, 8, 0], rotate: [-2, 2, -2] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  className="relative text-4xl mb-2"
                >
                  🔴
                  <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-white/20 rounded-full -translate-x-1/2 -translate-y-1/2 animate-ping" />
                </motion.div>
                <span className="text-xs text-white bg-slate-900/30 px-3 py-1 rounded-full animate-pulse">
                  {lang === 'zh' ? '咕噜咕噜... 浮漂漂浮中' : 'Gurgle gurgle... Bobber floating'}
                </span>
              </motion.div>
            )}

            {gameState === 'nibbling' && (
              <motion.div
                key="nibbling"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [1, 1.1, 1], opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className="flex flex-col items-center gap-2 z-10"
              >
                <div className="relative text-5xl mb-2">
                  🐠💥
                  <div className="absolute top-0 w-16 h-16 border-4 border-red-500 rounded-full animate-ping -left-4" />
                </div>
                <span className="text-xs font-bold text-white bg-red-600 px-3 py-1 rounded-full shadow-lg animate-bounce">
                  {lang === 'zh' ? '❗ 咬钩了！快拉 ❗' : '❗ Bite! Pull Now! ❗'}
                </span>
              </motion.div>
            )}

            {gameState === 'reeled' && currentCatch && (
              <motion.div
                key="reeled"
                initial={{ scale: 0.3, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="flex flex-col items-center gap-2 z-10 bg-white/95 p-4 rounded-2xl shadow-xl border border-sky-100 max-w-[260px] text-center"
              >
                <span className="text-4xl">{currentCatch.icon}</span>
                <h4 className={`text-sm font-bold ${currentCatch.color}`}>{getFishName(currentCatch.name, lang)}</h4>
                <div className="flex flex-wrap justify-center gap-2 mt-1">
                  <span className="bg-sky-50 text-sky-700 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                    ⚖️ {currentCatch.weight} kg
                  </span>
                  <span className="bg-teal-50 text-teal-700 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                    📏 {currentCatch.length} cm
                  </span>
                  <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    currentCatch.rarity === 'legendary' ? 'bg-purple-100 text-purple-700' :
                    currentCatch.rarity === 'epic' ? 'bg-pink-100 text-pink-700' :
                    currentCatch.rarity === 'rare' ? 'bg-teal-100 text-teal-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {currentCatch.rarity === 'legendary' ? (lang === 'zh' ? '传奇' : 'Legendary') :
                     currentCatch.rarity === 'epic' ? (lang === 'zh' ? '史诗' : 'Epic') :
                     currentCatch.rarity === 'rare' ? (lang === 'zh' ? '稀有' : 'Rare') : 
                     (lang === 'zh' ? '普通' : 'Common')}
                  </span>
                </div>
                {(currentCatch.name.includes('中华鲟') || currentCatch.name.includes('Sturgeon')) && (
                  <span className="text-[9px] text-emerald-600 font-semibold block mt-1.5 leading-tight">
                    {lang === 'zh' ? '♻️ 已自动放流大自然 💚' : '♻️ Released back to nature! 💚'}
                  </span>
                )}
              </motion.div>
            )}

            {gameState === 'missed' && (
              <motion.div
                key="missed"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-2 z-10"
              >
                <span className="text-4xl">💧💨</span>
                <span className="text-xs text-white bg-slate-900/40 px-3 py-1 rounded-full">
                  {lang === 'zh' ? '脱钩了/收太早' : 'Got away / Reeled too early'}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Status bar */}
        <div className="w-full text-center text-xs text-slate-600 font-medium bg-slate-50 border border-slate-100 rounded-xl p-2.5 min-h-[50px] flex items-center justify-center leading-relaxed mt-3">
          <span>{statusMessage}</span>
        </div>

        {/* Fishing Control Buttons */}
        <div className="w-full flex gap-3 mt-4">
          <button
            onClick={castLine}
            disabled={gameState === 'casting' || gameState === 'nibbling'}
            className="flex-1 py-3 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-200 disabled:text-slate-400 font-bold rounded-2xl shadow-md text-white transition-all cursor-pointer active:translate-y-0.5 text-sm"
          >
            {lang === 'zh' ? '抛竿垂钓' : 'Cast Line'}
          </button>
          <button
            onClick={reelIn}
            disabled={gameState === 'idle' || gameState === 'reeled' || gameState === 'missed'}
            className={`flex-1 py-3 font-bold rounded-2xl text-white transition-all cursor-pointer text-sm ${
              gameState === 'nibbling'
                ? 'bg-rose-500 hover:bg-rose-600 animate-pulse shadow-lg'
                : 'bg-indigo-600 hover:bg-indigo-700'
            } active:translate-y-0.5`}
          >
            {lang === 'zh' ? '收线起竿' : 'Reel In'}
          </button>
        </div>
      </div>

      {/* Trophy Basket / Statistics */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-base font-bold text-slate-800 flex items-center gap-1.5 font-display">
              <Trophy className="w-4 h-4 text-amber-500" /> 
              {lang === 'zh' ? `壮壮的个人鱼篓 (${totalCaught} 次收获)` : `Zhuangzhuang's Basket (${totalCaught} catches)`}
            </h4>
            {totalCaught > 0 && (
              <button
                onClick={clearTrophies}
                className="text-[10px] text-slate-400 hover:text-rose-600 flex items-center gap-0.5 cursor-pointer"
                title="Clear basket"
              >
                <Trash2 className="w-3 h-3" /> {lang === 'zh' ? '清空鱼篓' : 'Clear'}
              </button>
            )}
          </div>

          {/* Quick Statistics Panels */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-emerald-50/50 border border-emerald-100 p-2.5 rounded-xl text-center">
              <span className="text-[10px] text-slate-500 block">{lang === 'zh' ? '最重纪录' : 'Heaviest Catch'}</span>
              <span className="font-extrabold text-emerald-700 text-base">{heaviest > 0 ? `${heaviest} kg` : '--'}</span>
            </div>
            <div className="bg-indigo-50/50 border border-indigo-100 p-2.5 rounded-xl text-center">
              <span className="text-[10px] text-slate-500 block">{lang === 'zh' ? '最长纪录' : 'Longest Catch'}</span>
              <span className="font-extrabold text-indigo-700 text-base">{longest > 0 ? `${longest} cm` : '--'}</span>
            </div>
          </div>

          {/* List of Catches */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 max-h-[195px] overflow-y-auto">
            {fishTrophy.length === 0 ? (
              <div className="h-28 flex flex-col items-center justify-center text-slate-400 gap-1 text-xs text-center">
                <span>🧺 {lang === 'zh' ? '"空空如也的鱼篓..."' : '"The basket is empty..."'}</span>
                <span>{lang === 'zh' ? '快抛上一竿，看看能收获什么宝贝吧！' : 'Cast a line to see what you can catch!'}</span>
              </div>
            ) : (
              <div className="space-y-2">
                {fishTrophy.map((fish, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-slate-100 text-xs shadow-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl select-none">{fish.icon}</span>
                      <div className="flex flex-col">
                        <span className={`font-semibold ${fish.color}`}>{getFishName(fish.name, lang)}</span>
                        <span className="text-[9px] text-slate-400">
                          {fish.name.includes('中华鲟') || fish.name.includes('Sturgeon') 
                            ? (lang === 'zh' ? '🦈 国家保护动物（已放生）' : '🦈 Protected (Released)') 
                            : (fish.name.includes('雨靴') || fish.name.includes('Rainboot')
                               ? (lang === 'zh' ? '♻️ 保护湖泊环境' : '♻️ Lake Cleanup')
                               : (lang === 'zh' ? '🍽️ 肥美又营养' : '🍽️ Tasty Catch'))
                          }
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex flex-col">
                      <span className="font-bold text-slate-700">{fish.weight} kg</span>
                      <span className="text-[9px] text-slate-400">{fish.length} cm</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Fun Facts */}
        <div className="mt-4 border-t border-slate-100 pt-3 flex items-start gap-2 bg-yellow-50/60 p-3 rounded-xl border border-yellow-100">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-[10px] text-amber-800 leading-normal">
            <p className="font-semibold mb-0.5">{lang === 'zh' ? '壮壮的绿色钓鱼倡议：' : "Zhuangzhuang's Green Fishing Initiative:"}</p>
            {lang === 'zh' 
              ? '在钓到国家二级及以上保护动物（如中华鲟、大鲵等）时，需要拍照留念后在原地立即无伤放生。保护江河水系，支持生态钓鱼哦！🌱'
              : 'When catching state-protected species (e.g. Chinese Sturgeon), snap a photo to celebrate, and release them immediately unharmed. Save the waters and fish responsibly! 🌱'
            }
            {releaseCount > 0 && (
              <p className="mt-1 font-bold text-emerald-700">
                {lang === 'zh' 
                  ? `🏆 你已经在壮壮的鱼塘放生了 ${releaseCount} 条中华鲟！功德无量！` 
                  : `🏆 You have successfully released ${releaseCount} Chinese Sturgeons back to nature! Fantastic job! 💚`
                }
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
