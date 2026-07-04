/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Waves, Fish, Code, Cpu, Award, Compass, Sparkles, Play, Gamepad2, Timer, Zap, Layers } from 'lucide-react';
import RobotSimulator from './RobotSimulator';
import FishingGame from './FishingGame';
import { Language, TRANSLATIONS } from '../translations';

interface Hobby {
  id: string;
  title: string;
  subtitle: string;
  chineseTitle: string;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
  desc: string;
  stats: { label: string; value: string }[];
  achievements: string[];
  hasGame?: boolean;
}

export default function Hobbies({ lang }: { lang: Language }) {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [activeGameId, setActiveGameId] = useState<string | null>(null);

  const t = TRANSLATIONS[lang];

  const HOBBY_LIST: Hobby[] = [
    {
      id: 'swimming',
      title: 'Swimming',
      subtitle: lang === 'zh' ? '水下小潜艇' : 'Underwater Mini-Submarine',
      chineseTitle: t.hobbySwimming,
      icon: <Waves className="w-6 h-6 text-natural-green" />,
      color: 'green',
      bgGradient: 'bg-[#E9EDC9]/30 border-[#CCD5AE] hover:border-natural-green',
      desc: lang === 'zh' ? '我从 5 岁就开始学习游泳啦！最擅长自由泳和蛙泳，在水里像小鱼一样自由自在，不仅能锻炼身体，还能提高我的肺活量与耐力！' : "I started learning to swim at age 5! I excel in freestyle and breaststroke, feeling as free as a fish. It's not only great exercise but also boosts my stamina and lung capacity!",
      stats: [
        { label: lang === 'zh' ? '每周训练' : 'Weekly Training', value: lang === 'zh' ? '3 次' : '3 Times' },
        { label: lang === 'zh' ? '50米自由泳' : '50m Freestyle', value: lang === 'zh' ? '42 秒 (个人纪录)' : '42s (Personal Record)' },
        { label: lang === 'zh' ? '一口气憋气' : 'Breath Holding', value: lang === 'zh' ? '55 秒' : '55 Seconds' },
        { label: lang === 'zh' ? '累计泳程' : 'Total Swum', value: lang === 'zh' ? '180 公里' : '180 km' },
      ],
      achievements: [
        lang === 'zh' ? '小学运动会男子 50 米自由泳银牌 🥈' : "School Sports Meet Men's 50m Freestyle Silver Medal 🥈",
        lang === 'zh' ? '获得国家四级少儿游泳运动员证书 📜' : 'Obtained National Level 4 Junior Swimmer Certificate 📜',
        lang === 'zh' ? '掌握水下后空翻及安全踩水技巧 🐬' : 'Mastered underwater backflip and safety treading skills 🐬',
      ]
    },
    {
      id: 'paddleboarding',
      title: 'Paddleboarding',
      subtitle: lang === 'zh' ? '驭风破浪小桨手' : 'Wind & Wave Rider',
      chineseTitle: t.hobbyPaddleboarding,
      icon: <Compass className="w-6 h-6 text-natural-darkgreen" />,
      color: 'darkgreen',
      bgGradient: 'bg-[#CCD5AE]/25 border-[#E6E2D3] hover:border-natural-green',
      desc: lang === 'zh' ? '浆板是我夏天最爱的运动！在湖泊或平静的海湾，站在浆板上划行，特别考验我的核心平衡力。我也很喜欢在浆板上做瑜伽和翻跟头！' : 'Paddleboarding is my absolute favorite summer activity! Standing and paddling in tranquil lakes or calm bays challenges my core balance. I also love doing SUP yoga and flips on it!',
      stats: [
        { label: lang === 'zh' ? '平衡力系数' : 'Balance Rating', value: '⭐⭐⭐⭐⭐' },
        { label: lang === 'zh' ? '单次最远划行' : 'Longest Trip', value: lang === 'zh' ? '5 公里 (千岛湖)' : '5 km (Qiandao Lake)' },
        { label: lang === 'zh' ? '落水次数' : 'Fall Frequency', value: lang === 'zh' ? '已经不怕了！' : 'No longer afraid!' },
        { label: lang === 'zh' ? '装备' : 'My Gear', value: lang === 'zh' ? '壮壮号10.6尺气垫浆板' : 'Zhuangzhuang 10.6ft SUP Board' },
      ],
      achievements: [
        lang === 'zh' ? '千岛湖暑假环湖浆板夏令营结业 🏕️' : 'Graduated from Qiandao Lake Summer SUP Camp 🏕️',
        lang === 'zh' ? '成功学会 360° 板头快速旋转转向技巧 🔄' : 'Learned 360-degree fast pivot turn technique 🔄',
        lang === 'zh' ? '多次担任浆板小教练，指导同龄小朋友 🤙' : 'Acted as a little assistant coach to guide peers 🤙',
      ]
    },
    {
      id: 'fishing',
      title: 'Fishing',
      subtitle: lang === 'zh' ? '耐心十足的捕鱼达人' : 'Patient Fishing Master',
      chineseTitle: t.hobbyFishing,
      icon: <Fish className="w-6 h-6 text-natural-sand" />,
      color: 'sand',
      bgGradient: 'bg-[#FEFAE0]/60 border-[#E6E2D3] hover:border-natural-sand',
      desc: lang === 'zh' ? '大家都说小孩子静不下心，但我钓鱼的时候可以坐着一动不动好几个小时！我经常和爸爸、爷爷一起去水库 and 池塘，研究鱼饵的配方，感受浮漂抖动的那一瞬间！' : "People say kids can't stay still, but I can sit without moving for hours when fishing! I go to reservoirs with my dad and grandpa, mixing bait recipes and feeling the thrill of the float dip!",
      stats: [
        { label: lang === 'zh' ? '单次最长等待' : 'Longest Wait', value: lang === 'zh' ? '4.5 小时' : '4.5 Hours' },
        { label: lang === 'zh' ? '最重捕获纪录' : 'Heaviest Catch', value: lang === 'zh' ? '4.8公斤 的镜鲤鱼 🐟' : '4.8 kg Mirror Carp 🐟' },
        { label: lang === 'zh' ? '最爱鱼饵' : 'Favorite Bait', value: lang === 'zh' ? '壮壮秘制红虫面饵' : "Zhuangzhuang's Secret Redworm Bait" },
        { label: lang === 'zh' ? '解锁水域' : 'Unlocked Waters', value: lang === 'zh' ? '溪流、黑坑、大型水库' : 'Streams, commercial ponds, large reservoirs' },
      ],
      achievements: [
        lang === 'zh' ? '在野外成功钓到 4.8kg 巨型鲤鱼并合影 📸' : 'Successfully caught a 4.8kg wild carp and took photos 📸',
        lang === 'zh' ? '学会使用台钓、路亚、飞蝇等 3 种钓法 🎣' : 'Learned 3 methods: Taiwan style, lure, and fly fishing 🎣',
        lang === 'zh' ? '环保倡议者：坚持拍照后放归受保护小鱼 🌱' : 'Eco-advocate: Always release protected fish after taking photos 🌱',
      ],
      hasGame: true,
    },
    {
      id: 'programming',
      title: 'Programming',
      subtitle: lang === 'zh' ? '用逻辑创造世界的小创客' : 'Creating Worlds with Logic',
      chineseTitle: t.hobbyProgramming,
      icon: <Code className="w-6 h-6 text-natural-dark" />,
      color: 'dark',
      bgGradient: 'bg-[#DDE5F4]/55 border-[#E6E2D3] hover:border-natural-green',
      desc: lang === 'zh' ? '我喜欢通过写代码来把我的想法变成现实！我会用 Scratch 编写搞笑的酷跑游戏，现在我也在学习 Python 绘图和一些基础逻辑，编程让我的数学思维变得越来越棒了！' : "I love bringing ideas to life through code! I build fun running games in Scratch and I'm learning Python drawings and basic logic. Coding boosts my math thinking!",
      stats: [
        { label: lang === 'zh' ? '主要语言' : 'Languages', value: 'Scratch / Python / HTML' },
        { label: lang === 'zh' ? '编写游戏数' : 'Games Written', value: lang === 'zh' ? '8 个小作品' : '8 Mini Projects' },
        { label: lang === 'zh' ? '盲打速度' : 'Typing Speed', value: lang === 'zh' ? '每分钟 120 键' : '120 Keys/Min' },
        { label: lang === 'zh' ? '最爱逻辑块' : 'Fav Logic block', value: lang === 'zh' ? 'If-Else 循环判定' : 'If-Else Conditional Loop' },
      ],
      achievements: [
        lang === 'zh' ? '学校科技节“创意少儿游戏”一等奖 🏆' : "First prize for 'Creative Kid Game' at School Tech Festival 🏆",
        lang === 'zh' ? '完成少儿创意编程 3 阶段进阶课程 💻' : 'Completed 3 stages of Creative Coding advanced courses 💻',
        lang === 'zh' ? '自己编写了用来随机决定今天谁洗碗的小工具 🧼' : 'Coded a tool to randomly decide who does the dishes tonight 🧼',
      ]
    },
    {
      id: 'robots',
      title: 'Robotics',
      subtitle: lang === 'zh' ? '机械生命制造家' : 'Mechanical Life Builder',
      chineseTitle: t.hobbyRobotics,
      icon: <Cpu className="w-6 h-6 text-natural-darkgreen" />,
      color: 'darkgreen',
      bgGradient: 'bg-[#FEFAE0]/40 border-[#E6E2D3] hover:border-natural-sand',
      desc: lang === 'zh' ? '机器人是我和编程配合的绝配！我用 Lego Mindstorms 和 Arduino 套件搭建小车和机械臂。最自豪的就是给机器人安装超声波传感器，让它能自主避开障碍物！' : 'Robots are the perfect combo with coding! I build cars and arms using Lego Mindstorms and Arduino. I\'m most proud of adding ultrasonic sensors for auto obstacle avoidance!',
      stats: [
        { label: lang === 'zh' ? '传感器掌握' : 'Sensors Mastered', value: lang === 'zh' ? '超声波/红外线/陀螺仪' : 'Ultrasonic/Infrared/Gyro' },
        { label: lang === 'zh' ? '主控板型号' : 'Controller Boards', value: 'ESP32 / Arduino Uno' },
        { label: lang === 'zh' ? '最高耗时搭建' : 'Longest Build', value: lang === 'zh' ? '历时两周的避障履带坦克' : 'Obstacle-avoidance crawler tank (2 weeks)' },
        { label: lang === 'zh' ? '拥有马达' : 'Motors Owned', value: lang === 'zh' ? '舵机及步进电机' : 'Servos & Stepper Motors' },
      ],
      achievements: [
        lang === 'zh' ? '区青少年机器人创客大赛创意奖 🤖' : 'District Teen Robot Maker Contest Creativity Award 🤖',
        lang === 'zh' ? '拼装调试出完全自主巡线的红外赛车 🏎️' : 'Built and fine-tuned a fully autonomous line-following infrared racer 🏎️',
        lang === 'zh' ? '成功自制蓝牙遥控智能机械手爪 🦾' : 'Successfully created a custom Bluetooth remote-controlled smart gripper 🦾',
      ],
      hasGame: true,
    },
    {
      id: '3dprinting',
      title: '3D Printing',
      subtitle: lang === 'zh' ? '立体创造工坊' : '3D Creator Workshop',
      chineseTitle: t.hobby3DPrinting,
      icon: <Layers className="w-6 h-6 text-sky-600" />,
      color: 'sky',
      bgGradient: 'bg-[#DDE5F4]/40 border-[#E6E2D3] hover:border-sky-500',
      desc: lang === 'zh' ? '自从爸爸送给我一台桌面级 3D 打印机后，我就迷上了 3D 打印！我自己学习了 Tinkercad 简易 3D 建模，动手打印了许多小玩具、小齿轮以及用来拼装机器人的定制塑料支架，甚至还打印了精细的浆板模型和迷你小鱼饵！' : "Since my dad gifted me a desktop 3D printer, I've been hooked on 3D printing! I taught myself basic 3D modeling using Tinkercad, printing toys, custom gears, bracket parts for my robotics project, and even tiny miniature SUP boards and fishing lures!",
      stats: [
        { label: lang === 'zh' ? '最长打印时间' : 'Longest Print', value: lang === 'zh' ? '14 小时' : '14 Hours' },
        { label: lang === 'zh' ? '消耗耗材' : 'Filament Consumed', value: lang === 'zh' ? 'PLA 塑料丝 5.2kg' : '5.2 kg PLA' },
        { label: lang === 'zh' ? '常用喷嘴温度' : 'Nozzle Temp', value: '210 °C' },
        { label: lang === 'zh' ? '常用建模软件' : 'Modeling Software', value: 'Tinkercad' },
      ],
      achievements: [
        lang === 'zh' ? '成功设计并打印出可咬合旋转的二级减速齿轮箱 ⚙️' : 'Successfully printed a working 2-stage reduction gearbox ⚙️',
        lang === 'zh' ? '为避障机器人自主设计并打印定制电池保护外壳 🔋' : 'Designed & printed a custom battery protection chassis for robots 🔋',
        lang === 'zh' ? '自制发光 3D 浮雕照片小夜灯，作为生日礼物送给妈妈 💡' : 'Printed a glowing Lithophane photo nightlight as a birthday gift for Mom 💡',
      ],
    }
  ];

  const filteredHobbies = activeTab === 'all' 
    ? HOBBY_LIST 
    : HOBBY_LIST.filter(h => h.id === activeTab);

  return (
    <div id="hobbies-explorer" className="space-y-6">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-natural-border">
        <button
          onClick={() => { setActiveTab('all'); setActiveGameId(null); }}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-natural-dark text-white shadow-xs'
              : 'bg-white text-natural-muted hover:bg-[#F1F3EF] border border-natural-border'
          }`}
        >
          🔍 {t.hobbyAll} ({HOBBY_LIST.length})
        </button>
        {HOBBY_LIST.map((hobby) => (
          <button
            key={hobby.id}
            onClick={() => { setActiveTab(hobby.id); setActiveGameId(null); }}
            className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === hobby.id
                ? 'bg-natural-green text-white shadow-xs'
                : 'bg-white text-natural-muted hover:bg-[#F1F3EF] border border-natural-border'
            }`}
          >
            {hobby.icon}
            <span>{hobby.chineseTitle}</span>
          </button>
        ))}
      </div>

      {/* Grid of Hobbies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredHobbies.map((hobby) => (
          <div
            key={hobby.id}
            id={`hobby-card-${hobby.id}`}
            className={`bg-white rounded-[32px] p-6 border transition-all duration-300 flex flex-col justify-between ${
              activeTab === 'all' ? 'hover:-translate-y-1 hover:shadow-xs' : 'md:col-span-2'
            } ${hobby.bgGradient}`}
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white rounded-2xl shadow-xs border border-natural-border-light">
                    {hobby.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-natural-heading font-display flex items-center gap-1.5">
                      {hobby.chineseTitle}
                    </h3>
                    <p className="text-xs text-natural-muted font-bold tracking-wide uppercase">
                      {hobby.title} · {hobby.subtitle}
                    </p>
                  </div>
                </div>

                {/* Game Button for supported Hobbies */}
                {hobby.hasGame && (
                  <button
                    onClick={() => setActiveGameId(activeGameId === hobby.id ? null : hobby.id)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all shadow-xs cursor-pointer ${
                      activeGameId === hobby.id
                        ? 'bg-natural-sand hover:bg-[#c39263] text-white'
                        : 'bg-white hover:bg-[#F1F3EF] border border-[#CCD5AE] text-natural-green'
                    }`}
                  >
                    <Gamepad2 className="w-3.5 h-3.5" />
                    <span>{activeGameId === hobby.id ? t.closeGameBtn : t.playGameBtn}</span>
                  </button>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-natural-text leading-relaxed mb-5 font-medium">
                {hobby.desc}
              </p>

              {/* Stats & Accomplishments Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                {/* Statistics Box */}
                <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-4 border border-[#F0EDE4] shadow-xs">
                  <h4 className="text-xs font-bold text-natural-muted mb-2 uppercase tracking-wider">
                    📈 {t.statsLabel}
                  </h4>
                  <ul className="space-y-1.5">
                    {hobby.stats.map((stat, idx) => (
                      <li key={idx} className="flex justify-between items-center text-xs">
                        <span className="text-[#6B6B5E]">{stat.label}</span>
                        <span className="font-bold text-natural-heading">{stat.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Achievements Box */}
                <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-4 border border-[#F0EDE4] shadow-xs">
                  <h4 className="text-xs font-bold text-natural-muted mb-2 uppercase tracking-wider">
                    🏆 {t.achieveLabel}
                  </h4>
                  <ul className="space-y-1.5">
                    {hobby.achievements.map((ach, idx) => (
                      <li key={idx} className="text-xs text-natural-text flex items-start gap-1.5 font-medium leading-normal">
                        <span className="text-natural-sand text-xs shrink-0">•</span>
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Quick footer callout inside ALL view */}
            {hobby.hasGame && activeGameId !== hobby.id && activeTab === 'all' && (
              <div className="mt-4 pt-3 border-t border-natural-border-light/40 flex items-center justify-between text-xs text-natural-green font-semibold bg-natural-green/5 px-3 py-1.5 rounded-xl">
                <span>{lang === 'zh' ? '🎮 这个爱好有壮壮特制的小游戏哦！' : '🎮 This hobby has a special game made by Zhuangzhuang!'}</span>
                <button
                  onClick={() => { setActiveTab(hobby.id); setActiveGameId(hobby.id); }}
                  className="flex items-center gap-1 hover:underline cursor-pointer"
                >
                  {lang === 'zh' ? '点击去体验' : 'Try it out'} <Play className="w-2.5 h-2.5 fill-current" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Expanded Game Sandbox Section */}
      {activeGameId && (
        <div className="border-t-2 border-dashed border-natural-border pt-6 mt-4">
          <div className="flex items-center justify-between mb-4 bg-[#FEFAE0] p-4 rounded-2xl border border-natural-border">
            <div>
              <h4 className="text-base font-extrabold text-natural-heading font-display flex items-center gap-1.5">
                <Sparkles className="w-5 h-5 text-natural-green animate-pulse" />
                <span>{lang === 'zh' ? '在线游戏实验室：壮壮的得意之作' : 'Online Game Lab: Zhuangzhuang’s Pride'}</span>
              </h4>
              <p className="text-xs text-[#6B6B5E] font-medium">
                {activeGameId === 'robots' 
                  ? (lang === 'zh' ? '这是壮壮为同学和哥哥姐姐设计的机器人编程迷宫。拖放积木写出你的逻辑代码吧！' : 'This is a robot programming maze designed by Zhuangzhuang. Drag and drop command blocks to build your logic!')
                  : (lang === 'zh' ? '这是壮壮把钓鱼秘诀融入进来的反应力模拟鱼塘，多钓几条，看看能不能刷新最高重量！' : 'This is a reaction-based fishing pond simulation incorporating fishing secrets. Try to catch some heavy fish!')
                }
              </p>
            </div>
            <button
              onClick={() => setActiveGameId(null)}
              className="px-3 py-1.5 bg-[#E9EDC9] hover:bg-[#CCD5AE] text-[#5A6A58] rounded-xl text-xs font-bold cursor-pointer transition-colors"
            >
              {lang === 'zh' ? '收起实验室' : 'Close Lab'}
            </button>
          </div>

          <div className="bg-[#F1F3EF]/40 p-2 rounded-3xl border border-natural-border">
            {activeGameId === 'robots' ? <RobotSimulator lang={lang} /> : <FishingGame lang={lang} />}
          </div>
        </div>
      )}
    </div>
  );
}
