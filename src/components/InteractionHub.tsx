/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MessageSquare, Heart, Award, Check, RefreshCw, Send, Users, Smile, HelpCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GuestbookMessage, RelationshipType, CommentReply } from '../types';
import { Language, TRANSLATIONS } from '../translations';

const PRE_SEEDED_MESSAGES: GuestbookMessage[] = [
  {
    id: 'seed-1',
    name: '大表姐 婷婷',
    relationship: 'cousin',
    avatar: '🦊',
    content: '壮壮，暑假大姑说带你来北京玩，记得一定要带上你那个可以编程的机器人小车啊！我要亲自挑战一下你的迷宫程序，别到时候被我轻松通关了哟！🤪',
    timestamp: '2026-07-02 14:35',
    likes: 8,
    replies: [
      {
        id: 'reply-seed-1',
        author: '壮壮 (作者)',
        content: '哼！表姐你可别小看我，我的避障程序可是升级过的，想通关没那么容易！等你来战！',
        timestamp: '2026-07-02 15:10',
        isZhuangzhuang: true
      }
    ]
  },
  {
    id: 'seed-2',
    name: '同桌 李小明',
    relationship: 'classmate',
    avatar: '🐱',
    content: '壮壮，我们下周二科学课要展示的那个避障小车，超声波传感器代码你调通了吗？我负责画的海报已经画好了，全靠你拯救我们的科技小组了！冲冲冲！⚽',
    timestamp: '2026-07-03 09:12',
    likes: 5,
    replies: [
      {
        id: 'reply-seed-2',
        author: '壮壮 (作者)',
        content: '放一百个心吧小明！已经在我的虚拟实验室测试成功了，下周展示绝对拿满分！',
        timestamp: '2026-07-03 10:05',
        isZhuangzhuang: true
      }
    ]
  },
  {
    id: 'seed-3',
    name: '堂哥 大鹏',
    relationship: 'cousin',
    avatar: '🦁',
    content: '小伙子可以啊，听说你在水库钓上来一条将近5公斤的鲤鱼？是不是大姑帮你提的竿啊，哈哈！放寒假回老家了，哥带你去结冰的河面玩冰钓，那才叫刺激！',
    timestamp: '2026-07-03 18:40',
    likes: 12,
    replies: []
  },
  {
    id: 'seed-4',
    name: '班长 王雨桐',
    relationship: 'classmate',
    avatar: '🦄',
    content: '壮壮，暑假游泳队的集训你别迟到啦！教练说下个月有全市少儿杯邀请赛，你可是我们学校的自由泳主力，加油，争取再拿一块金牌！🥇',
    timestamp: '2026-07-04 01:22',
    likes: 9,
    replies: []
  }
];

const AVATARS = ['🐱', '🦊', '🦁', '🦄', '🐨', '🐼', '🐯', '🐰', '🐸', '🐙', '👾', '🤖'];

const getSeededMessageContent = (id: string, lang: Language): string => {
  if (id === 'seed-1') {
    return lang === 'zh' 
      ? '壮壮，暑假大姑说带你来北京玩，记得一定要带上你那个可以编程的机器人小车啊！我要亲自挑战一下你的迷宫程序，别到时候被我轻松通关了哟！🤪'
      : 'Zhuangzhuang, auntie said she is bringing you to Beijing this summer. Remember to bring your programmable robot car! I want to challenge your maze program myself, don’t let me beat it too easily! 🤪';
  }
  if (id === 'reply-seed-1') {
    return lang === 'zh'
      ? '哼！表姐你可别小看我，我的避障程序可是升级过的，想通关没那么容易！等你来战！'
      : 'Humph! Cousin, don’t underestimate me, my obstacle avoidance program is upgraded, beating it is not that easy! Waiting for your challenge!';
  }
  if (id === 'seed-2') {
    return lang === 'zh'
      ? '壮壮，我们下周二科学课要展示的那个避障小车，超声波传感器代码你调通了吗？我负责画的海报已经画好了，全靠你拯救我们的科技小组了！冲冲冲！⚽'
      : 'Zhuangzhuang, have you tuned the ultrasonic sensor code for our obstacle car demo in next Tuesday’s science class? I have finished drawing the poster, we rely on you to save our tech group! Go go go! ⚽';
  }
  if (id === 'reply-seed-2') {
    return lang === 'zh'
      ? '放一百个心吧小明！已经在我的虚拟实验室测试成功了，下周展示绝对拿满分！'
      : 'Don’t worry Xiaoming! It is successfully tested in my virtual lab, we will definitely score 100 next week!';
  }
  if (id === 'seed-3') {
    return lang === 'zh'
      ? '小伙子可以啊，听说你在水库钓上来一条将近5公斤的鲤鱼？是不是大姑帮你提的竿啊，哈哈！放寒假回老家了，哥带你去结冰的河面玩冰钓，那才叫刺激！'
      : 'Nice job kiddo, heard you caught a near 5kg carp at the reservoir? Did auntie help you pull the rod, haha! When you return for winter break, I’ll take you ice fishing on the frozen river, that is real fun!';
  }
  if (id === 'seed-4') {
    return lang === 'zh'
      ? '壮壮，暑假游泳队的集训你别迟到啦！教练说下个月有全市少儿杯邀请赛，你可是我们学校的自由泳主力，加油，争取再拿一块金牌！🥇'
      : 'Zhuangzhuang, don’t be late for summer swimming team training! The coach said there is a city youth cup next month. You’re our school’s main freestyle swimmer. Go for another gold! 🥇';
  }
  return '';
};

const getAuthorName = (name: string, lang: Language): string => {
  if (lang === 'zh') return name;
  const raw = name.replace(' (作者)', '').trim();
  if (raw === '大表姐 婷婷' || raw === '婷婷') return 'Cousin Tingting';
  if (raw === '同桌 李小明' || raw === '李小明') return 'Deskmate Xiaoming';
  if (raw === '堂哥 大鹏' || raw === '大鹏') return 'Cousin Dapeng';
  if (raw === '班长 王雨桐' || raw === '王雨桐') return 'Class Monitor Yutong';
  if (raw === '壮壮' || name.includes('壮壮')) return 'Zhuangzhuang (Author)';
  if (raw === '壮壮的访客') return 'Visitor';
  return raw;
};

const getQuizQuestions = (lang: Language) => {
  if (lang === 'zh') {
    return [
      {
        question: '壮壮最讨厌吃哪一种蔬菜？',
        options: ['香甜的炸薯条 🍟', '绿油油的西兰花 🥦', '软糯糯的烤土豆 🥔', '香喷喷的炒西红柿 🍅'],
        correct: 1,
        explanation: '西兰花是壮壮一生的强敌，每次妈妈煮西兰花他都要皱眉头！但是为了游泳有力量，还是会闭着眼吃两朵。'
      },
      {
        question: '壮壮最长曾经坐着钓鱼多久，一动不动连爸爸都惊叹？',
        options: ['10分钟就想去抓蝴蝶 🦋', '半小时，腿麻了 🦵', '四个半小时！简直是静心大侠 🧘‍♂️', '一天一夜 🌙'],
        correct: 2,
        explanation: '壮壮钓鱼的时候像个小老头，最长创下了 4.5 小时专注盯漂的纪录，钓鱼让他变得非常有耐心！'
      },
      {
        question: '在炎热的夏天，壮壮喜欢在水面划行、翻跟头和平衡探索的板子是什么？',
        options: ['双桥滑板 🛹', '炫酷冲浪板 🏄', '平衡力满满的浆板 (SUP) 🏄‍♂️', '滑雪单板 🏂'],
        correct: 2,
        explanation: '浆板是壮壮夏天的水上大玩具，不仅能在上面划水，还能在上面练倒立和落水捞小鱼！'
      },
      {
        question: '壮壮最常用来给避障智能机甲进行障碍探测的传感器是什么？',
        options: ['超声波传感器 📡', '温度计传感器 🌡️', '空气湿度检测仪 ☁️', '光敏电阻传感器 💡'],
        correct: 0,
        explanation: '超声波传感器就像蝙蝠的耳朵，发射声波测距，是机器人自主避开石头的主力功臣！'
      },
      {
        question: '壮壮50米自由泳的个人最好成绩是多少秒？',
        options: ['3 分钟 (还在狗刨中)', '42 秒！学校里的“浪花小飞鱼” 🏊‍♂️', '15 秒 (打破世界纪录了)', '60 秒 (稳扎稳打型)'],
        correct: 1,
        explanation: '壮壮在少儿游泳集训队苦练了3年，50米自由泳最好成绩已经达到了42秒，在学校里算得上一流速度！'
      },
      {
        question: '壮壮最近刚入手的新爱好，经常在房间里设计并制作塑料小玩具的是什么？',
        options: ['陶泥烧制 🏺', '3D打印 🖨️', '折纸艺术 ✈️', '木雕工艺 🪵'],
        correct: 1,
        explanation: '壮壮最近爱上了 3D 打印！他自学了 Tinkercad 建模，设计并打印了机器人支架、定制齿轮、甚至迷你的桨板与鱼饵模型，简直是动手小天才！'
      }
    ];
  } else {
    return [
      {
        question: 'Which vegetable does Zhuangzhuang dislike the most?',
        options: ['Sweet French Fries 🍟', 'Green Broccoli 🥦', 'Soft Roasted Potato 🥔', 'Yummy Fried Tomato 🍅'],
        correct: 1,
        explanation: 'Broccoli is Zhuangzhuang’s lifelong arch-nemesis, he frowns every time his mom boils it! But to stay strong for swimming, he’ll close his eyes and eat two florets anyway.'
      },
      {
        question: 'How long did Zhuangzhuang once sit fishing without moving, surprising even his dad?',
        options: ['10 minutes, then left to catch butterflies 🦋', 'Half an hour, legs went numb 🦵', '4.5 hours! A true Zen Fishing Master 🧘‍♂️', 'A full day and night 🌙'],
        correct: 2,
        explanation: 'Zhuangzhuang sits like a calm elder when fishing, once setting a record of 4.5 hours staring at the float. Fishing has trained his extreme patience!'
      },
      {
        question: 'What is the summer water board Zhuangzhuang loves for paddling, flips, and balance?',
        options: ['Double-kick Skateboard 🛹', 'Cool Surfboard 🏄', 'Balance-testing Paddleboard (SUP) 🏄‍♂️', 'Snowboard 🏂'],
        correct: 2,
        explanation: 'Paddleboard is his giant summer water toy; he can paddle, practice headstands, and scoop small fish on it!'
      },
      {
        question: 'Which sensor does Zhuangzhuang use most to detect obstacles for his smart robots?',
        options: ['Ultrasonic Sensor 📡', 'Thermometer Sensor 🌡️', 'Air Humidity Monitor ☁️', 'Photoresistor Light Sensor 💡'],
        correct: 0,
        explanation: 'Ultrasonic sensors are like bat ears, emitting sound waves to measure distance. They are the main hero for the robot bypassing obstacle cubes!'
      },
      {
        question: 'What is Zhuangzhuang’s personal best for the 50m freestyle swim?',
        options: ['3 minutes (still doing doggy paddle)', '42 seconds! A local school "Wave Flyer" 🏊‍♂️', '15 seconds (smashed world record)', '60 seconds (steady and pacing)'],
        correct: 1,
        explanation: 'Zhuangzhuang has trained hard for 3 years in the junior swim club, lowering his 50m freestyle time to 42 seconds - top speed at school!'
      },
      {
        question: "What is Zhuangzhuang's newly added hobby, where he designs and prints custom toys in his bedroom?",
        options: ['Clay Pottery 🏺', '3D Printing 🖨️', 'Origami Art ✈️', 'Wood Carving 🪵'],
        correct: 1,
        explanation: "Zhuangzhuang has recently fallen in love with 3D Printing! He self-taught Tinkercad modeling to design and print robot chassis, custom gears, and even miniature paddleboards and lures!"
      }
    ];
  }
};

export default function InteractionHub({ lang }: { lang: Language }) {
  const [activeTab, setActiveTab] = useState<'guestbook' | 'quiz'>('guestbook');
  
  const t = TRANSLATIONS[lang];
  const hubTabGuestbook = t.tabBookName;
  const hubTabQuiz = t.tabQuizName;
  const hubPostTitle = t.writeMessageTitle;
  const hubPostDesc = t.writeMessageDesc;
  const hubInputName = t.formName;
  const hubInputRelation = t.formRelation;
  const hubInputAvatar = t.formAvatar;
  const hubInputContent = t.formContent;
  const hubSubmitBtn = t.formSubmit;
  const quizWelcome = t.quizHeading;
  const quizSubWelcome = t.quizOnboardDesc;
  const quizStartBtn = t.quizStartBtn;

  const QUIZ_QUESTIONS = getQuizQuestions(lang);

  // Guestbook states
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [nameInput, setNameInput] = useState('');
  const [relationInput, setRelationInput] = useState<RelationshipType>('classmate');
  const [selectedAvatar, setSelectedAvatar] = useState('🐱');
  const [contentInput, setContentInput] = useState('');
  const [replyInputs, setReplyInputs] = useState<{ [msgId: string]: string }>({});
  const [filterRelation, setFilterRelation] = useState<'all' | RelationshipType>('all');

  // Quiz states
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAns, setSelectedAns] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [nickname, setNickname] = useState('');
  const [quizRelation, setQuizRelation] = useState<RelationshipType>('classmate');

  // Load and sync messages
  useEffect(() => {
    const saved = localStorage.getItem('zhuang_messages');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        setMessages(PRE_SEEDED_MESSAGES);
      }
    } else {
      setMessages(PRE_SEEDED_MESSAGES);
      localStorage.setItem('zhuang_messages', JSON.stringify(PRE_SEEDED_MESSAGES));
    }
  }, []);

  const saveMessages = (newList: GuestbookMessage[]) => {
    setMessages(newList);
    localStorage.setItem('zhuang_messages', JSON.stringify(newList));
  };

  const handlePostMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      alert(lang === 'zh' ? '请输入你的名字或称呼！' : 'Please input your name!');
      return;
    }
    if (!contentInput.trim()) {
      alert(lang === 'zh' ? '请输入留言内容！' : 'Please input message content!');
      return;
    }

    const formattedTime = new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(/\//g, '-');

    const newMessage: GuestbookMessage = {
      id: 'msg-' + Math.random().toString(36).substring(2, 9),
      name: nameInput.trim(),
      relationship: relationInput,
      avatar: selectedAvatar,
      content: contentInput.trim(),
      timestamp: formattedTime,
      likes: 0,
      replies: []
    };

    const updated = [newMessage, ...messages];
    saveMessages(updated);
    setContentInput('');
    setNameInput('');
    
    // Auto simulated response from Zhuangzhuang after 2 seconds
    setTimeout(() => {
      simulateZhuangzhuangReply(newMessage.id, newMessage.name, newMessage.relationship, newMessage.content);
    }, 2000);
  };

  const simulateZhuangzhuangReply = (msgId: string, authorName: string, relation: RelationshipType, userContent: string) => {
    let replyText = lang === 'zh' 
      ? '哈哈，谢谢留言！很高兴在网站上和你互动！👋' 
      : 'Haha, thanks for leaving a message! So glad to chat with you! 👋';

    if (relation === 'classmate') {
      if (userContent.includes('玩') || userContent.includes('球') || userContent.includes('跑') || userContent.includes('play') || userContent.includes('game')) {
        replyText = lang === 'zh'
          ? `好呀${authorName}！这周末下午做完功课，我们学校操场不见不散，带上我的避障小车一起展示！🤖`
          : `Sure ${authorName}! Let's meet at the school playground this weekend afternoon after finishing homework, I'll bring my smart car to show! 🤖`;
      } else {
        replyText = lang === 'zh'
          ? `收到！下周学校上课我去找你，咱们课间一起聊聊 Scratch 编程的新关卡！🎮`
          : `Got it! I'll catch up with you at school next week, let's talk about new Scratch programming levels during recess! 🎮`;
      }
    } else if (relation === 'cousin') {
      replyText = lang === 'zh'
        ? `老哥老姐！太想你们了，今年过年/暑假回家，我一定把我的桨板和机器人全带上，等我教你们怎么划！不许放我鸽子啊！🌻`
        : `Dearest cousins! Miss you so much! When I come back for the holidays, I will definitely bring my paddleboard and robots to show you! Sunflower hugs! 🌻`;
    } else if (relation === 'teacher') {
      replyText = lang === 'zh'
        ? `老师好！谢谢老师来看我的个人网站！我会继续努力学习编程和游泳，保证不落后文化课！📚`
        : `Hello Teacher! Thank you so much for visiting my personal website! I will keep practicing swimming and programming, and won’t fall behind on schoolwork! 📚`;
    }

    const savedList = localStorage.getItem('zhuang_messages');
    if (savedList) {
      try {
        const currentList: GuestbookMessage[] = JSON.parse(savedList);
        const target = currentList.find(m => m.id === msgId);
        if (target) {
          const formattedTime = new Date().toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }).replace(/\//g, '-');

          const newReply: CommentReply = {
            id: 'reply-' + Math.random().toString(36).substring(2, 9),
            author: lang === 'zh' ? '壮壮 (作者)' : 'Zhuangzhuang',
            content: replyText,
            timestamp: formattedTime,
            isZhuangzhuang: true
          };

          target.replies.push(newReply);
          saveMessages([...currentList]);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleLikeMessage = (id: string) => {
    const updated = messages.map(msg => {
      if (msg.id === id) {
        return { ...msg, likes: msg.likes + 1 };
      }
      return msg;
    });
    saveMessages(updated);
  };

  const handlePostReply = (msgId: string) => {
    const text = replyInputs[msgId];
    if (!text || !text.trim()) return;

    const updated = messages.map(msg => {
      if (msg.id === msgId) {
        const formattedTime = new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }).replace(/\//g, '-');

        const newReply: CommentReply = {
          id: 'reply-' + Math.random().toString(36).substring(2, 9),
          author: lang === 'zh' ? '壮壮的访客' : 'Zhuangzhuang’s Guest',
          content: text.trim(),
          timestamp: formattedTime,
          isZhuangzhuang: false
        };
        return {
          ...msg,
          replies: [...msg.replies, newReply]
        };
      }
      return msg;
    });

    saveMessages(updated);
    setReplyInputs({ ...replyInputs, [msgId]: '' });
  };

  const handleDeleteMessage = (id: string) => {
    const msg = lang === 'zh' ? '确定要删除这条留言吗？' : 'Are you sure you want to delete this message?';
    if (window.confirm(msg)) {
      const updated = messages.filter(m => m.id !== id);
      saveMessages(updated);
    }
  };

  // Quiz actions
  const startQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) {
      alert(lang === 'zh' ? '请先输入你的昵称/尊姓大名！' : 'Please input your nickname first!');
      return;
    }
    setQuizStarted(true);
    setCurrentQ(0);
    setSelectedAns(null);
    setScore(0);
    setQuizCompleted(false);
  };

  const handleAnswerSelect = (optionIdx: number) => {
    if (selectedAns !== null) return;
    setSelectedAns(optionIdx);
    if (optionIdx === QUIZ_QUESTIONS[currentQ].correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQ < QUIZ_QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedAns(null);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setSelectedAns(null);
    setCurrentQ(0);
  };

  const filteredMessages = filterRelation === 'all'
    ? messages
    : messages.filter(m => m.relationship === filterRelation);

  const getRelationBadge = (rel: RelationshipType) => {
    switch (rel) {
      case 'classmate':
        return <span className="px-2 py-0.5 bg-[#F1F3EF] text-[#5A6A58] rounded-md font-bold text-[10px] border border-natural-border">{lang === 'zh' ? '🎒 班级同学' : '🎒 Classmate'}</span>;
      case 'cousin':
        return <span className="px-2 py-0.5 bg-[#FEFAE0] text-[#A67C52] rounded-md font-bold text-[10px] border border-[#E6E2D3]">{lang === 'zh' ? '🏡 亲戚群组' : '🏡 Cousin/Family'}</span>;
      case 'teacher':
        return <span className="px-2 py-0.5 bg-[#E9EDC9]/40 text-natural-darkgreen rounded-md font-bold text-[10px] border border-[#CCD5AE]">{lang === 'zh' ? '👩‍🏫 敬爱老师' : '👩‍🏫 Teacher'}</span>;
      case 'friend':
        return <span className="px-2 py-0.5 bg-white text-natural-muted rounded-md font-bold text-[10px] border border-natural-border">{lang === 'zh' ? '✨ 课外好友' : '✨ Friend'}</span>;
    }
  };

  return (
    <div id="interaction-zone" className="bg-white rounded-[32px] p-6 shadow-xs border border-natural-border">
      {/* Tab Selectors */}
      <div className="flex justify-center gap-3 mb-6 bg-[#F1F3EF] p-1 rounded-2xl max-w-sm mx-auto">
        <button
          onClick={() => setActiveTab('guestbook')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'guestbook'
              ? 'bg-white text-natural-heading shadow-xs'
              : 'text-natural-muted hover:text-natural-heading font-medium'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{hubTabGuestbook}</span>
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'quiz'
              ? 'bg-white text-natural-heading shadow-xs'
              : 'text-natural-muted hover:text-natural-heading font-medium'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>{hubTabQuiz}</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* Tab 1: Guestbook Message Board */}
        {activeTab === 'guestbook' && (
          <motion.div
            key="guestbook"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Left Column: Form to Write Message */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FEFAE0]/40 rounded-2xl p-5 border border-[#E6E2D3]">
                <h4 className="text-sm font-extrabold text-natural-heading font-display flex items-center gap-1.5 mb-2">
                  <Smile className="w-4.5 h-4.5 text-natural-green" /> {hubPostTitle}
                </h4>
                <p className="text-[11px] text-[#6B6B5E] font-medium mb-4">
                  {hubPostDesc}
                </p>

                <form onSubmit={handlePostMessage} className="space-y-3.5">
                  {/* Name Input */}
                  <div>
                    <label className="block text-xs font-bold text-natural-muted mb-1">✍️ {hubInputName}</label>
                    <input
                      type="text"
                      placeholder={lang === 'zh' ? '例如: 大表姐婷婷 / 同桌小明' : 'e.g. Cousin Tingting / Xiaoming'}
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      required
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-natural-border focus:outline-none focus:ring-2 focus:ring-natural-green bg-white text-natural-heading font-medium"
                    />
                  </div>

                  {/* Relationship selector */}
                  <div>
                    <label className="block text-xs font-bold text-natural-muted mb-1">🏷️ {hubInputRelation}</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { val: 'classmate', label: lang === 'zh' ? '🎒 班级同学' : '🎒 Classmate' },
                        { val: 'cousin', label: lang === 'zh' ? '🏡 亲戚群组' : '🏡 Cousin/Family' },
                        { val: 'teacher', label: lang === 'zh' ? '👩‍🏫 敬爱老师' : '👩‍🏫 Teacher' },
                        { val: 'friend', label: lang === 'zh' ? '✨ 课外好友' : '✨ Friend' }
                      ].map((item) => (
                        <button
                          key={item.val}
                          type="button"
                          onClick={() => setRelationInput(item.val as RelationshipType)}
                          className={`py-2 rounded-xl text-xs font-bold text-center border cursor-pointer transition-all ${
                            relationInput === item.val
                              ? 'bg-natural-green text-white border-natural-green shadow-xs scale-[1.02]'
                              : 'bg-white text-natural-muted border-natural-border hover:bg-[#F1F3EF]'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Avatar Picker */}
                  <div>
                    <label className="block text-xs font-bold text-natural-muted mb-1.5">🎭 {hubInputAvatar}</label>
                    <div className="grid grid-cols-6 gap-2 bg-white p-2.5 rounded-xl border border-natural-border">
                      {AVATARS.map((av) => (
                        <button
                          key={av}
                          type="button"
                          onClick={() => setSelectedAvatar(av)}
                          className={`text-2xl rounded-lg p-1.5 hover:bg-[#F1F3EF] transition-colors cursor-pointer text-center ${
                            selectedAvatar === av ? 'bg-[#E9EDC9] ring-2 ring-natural-green' : ''
                          }`}
                        >
                          {av}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Content Input */}
                  <div>
                    <label className="block text-xs font-bold text-natural-muted mb-1">💬 {hubInputContent}</label>
                    <textarea
                      placeholder={lang === 'zh' ? '写句暖心鼓励、学校趣事、或者向壮壮发起避障/钓鱼PK大挑战吧！' : 'Write warm encouragement, school fun, or challenge Zhuangzhuang!'}
                      rows={3}
                      value={contentInput}
                      onChange={(e) => setContentInput(e.target.value)}
                      required
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-natural-border focus:outline-none focus:ring-2 focus:ring-natural-green bg-white resize-none text-natural-text font-medium"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3 bg-natural-green hover:bg-[#3E5C38] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs hover:shadow-md transition-all cursor-pointer active:translate-y-0.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{hubSubmitBtn}</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Displaying List of Messages */}
            <div className="lg:col-span-7 space-y-4">
              {/* List Filters */}
              <div className="flex items-center justify-between bg-[#F1F3EF]/60 border border-natural-border p-3 rounded-2xl">
                <span className="text-xs font-bold text-natural-muted flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-natural-text" />
                  <span>{lang === 'zh' ? '筛选留言:' : 'Filter:'}</span>
                </span>
                <div className="flex gap-1">
                  {[
                    { val: 'all', label: lang === 'zh' ? '全部' : 'All' },
                    { val: 'classmate', label: lang === 'zh' ? '🎒 同学' : '🎒 Classmate' },
                    { val: 'cousin', label: lang === 'zh' ? '🏡 亲戚' : '🏡 Cousin' },
                  ].map((filter) => (
                    <button
                      key={filter.val}
                      onClick={() => setFilterRelation(filter.val as any)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                        filterRelation === filter.val
                          ? 'bg-natural-dark text-white'
                          : 'bg-white text-natural-muted hover:bg-[#F1F3EF] border border-natural-border'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Messages Stack */}
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {filteredMessages.length === 0 ? (
                  <div className="text-center py-12 bg-[#F1F3EF]/30 rounded-2xl border border-dashed border-natural-border text-natural-muted text-xs">
                    <span>💬 {lang === 'zh' ? '还没有这一类的留言，快来占领沙发吧！' : 'No messages here yet. Be the first to leave one!'}</span>
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {filteredMessages.map((msg) => {
                      const isSeed = msg.id.startsWith('seed-');
                      const displayContent = isSeed ? getSeededMessageContent(msg.id, lang) : msg.content;
                      const displayName = getAuthorName(msg.name, lang);

                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, x: 30 }}
                          className="bg-white border border-natural-border rounded-2xl p-4.5 shadow-xs hover:border-natural-green transition-all relative"
                        >
                          {/* Message Sender Header */}
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2.5">
                              <span className="text-3xl bg-[#F1F3EF] w-11 h-11 rounded-full flex items-center justify-center border border-natural-border-light select-none">
                                {msg.avatar}
                              </span>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-extrabold text-natural-heading text-xs font-display">{displayName}</span>
                                  {getRelationBadge(msg.relationship)}
                                </div>
                                <span className="text-[9px] text-natural-muted font-bold block mt-0.5">{msg.timestamp}</span>
                              </div>
                            </div>

                            {/* Delete capability */}
                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="text-[10px] text-natural-border hover:text-[#A67C52] transition-colors p-1 font-bold"
                              title="Delete comment"
                            >
                              ×
                            </button>
                          </div>

                          {/* Content */}
                          <p className="text-xs text-natural-text leading-relaxed font-medium pl-13 mb-3">
                            {displayContent}
                          </p>

                          {/* Likes & Replies stats */}
                          <div className="flex items-center justify-between border-t border-natural-border-light pt-3 pl-13">
                            <button
                              onClick={() => handleLikeMessage(msg.id)}
                              className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                                msg.likes > 0 ? 'bg-[#FEFAE0] text-[#A67C52] hover:bg-[#FEFAE0]/80' : 'bg-[#F1F3EF] text-natural-muted hover:bg-[#E2E6E0]'
                              }`}
                            >
                              <Heart className="w-3 h-3 fill-current" />
                              <span>{lang === 'zh' ? `点赞 (${msg.likes})` : `Like (${msg.likes})`}</span>
                            </button>
                            <span className="text-[9px] text-natural-muted font-bold font-display">
                              💬 {msg.replies.length} {lang === 'zh' ? '条回复' : 'replies'}
                            </span>
                          </div>

                          {/* Nested Replies */}
                          {msg.replies.length > 0 && (
                            <div className="mt-3.5 pl-13 space-y-2">
                              {msg.replies.map((rep) => {
                                const isReplySeed = rep.id.startsWith('reply-seed-');
                                const displayReplyContent = isReplySeed ? getSeededMessageContent(rep.id, lang) : rep.content;
                                const displayReplyAuthor = getAuthorName(rep.author, lang);

                                return (
                                  <div
                                    key={rep.id}
                                    className={`p-3 rounded-xl border text-xs leading-relaxed ${
                                      rep.isZhuangzhuang
                                        ? 'bg-[#E9EDC9]/35 border-[#CCD5AE]/60 text-natural-darkgreen'
                                        : 'bg-[#F1F3EF]/40 border-natural-border-light text-natural-text'
                                    }`}
                                  >
                                    <div className="flex justify-between items-center mb-1">
                                      <span className={`font-extrabold font-display ${rep.isZhuangzhuang ? 'text-natural-green' : 'text-natural-heading'}`}>
                                        {rep.isZhuangzhuang ? '👦 ' + displayReplyAuthor : displayReplyAuthor}
                                      </span>
                                      <span className="text-[8px] text-natural-muted font-bold">{rep.timestamp}</span>
                                    </div>
                                    <p className="font-medium">{displayReplyContent}</p>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Add Nested Reply Box */}
                          <div className="mt-3 pl-13 flex gap-2">
                            <input
                              type="text"
                              placeholder={lang === 'zh' ? '回复该留言...' : 'Reply to comment...'}
                              value={replyInputs[msg.id] || ''}
                              onChange={(e) => setReplyInputs({ ...replyInputs, [msg.id]: e.target.value })}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handlePostReply(msg.id);
                              }}
                              className="flex-1 text-[11px] px-3 py-1.5 rounded-xl border border-natural-border bg-[#F1F3EF]/50 focus:outline-none focus:ring-1 focus:ring-natural-green focus:bg-white text-natural-heading font-medium"
                            />
                            <button
                              onClick={() => handlePostReply(msg.id)}
                              className="px-3 py-1.5 bg-[#E9EDC9] hover:bg-[#CCD5AE] text-[#5A6A58] font-bold rounded-xl text-[10px] cursor-pointer shrink-0"
                            >
                              {lang === 'zh' ? '发送' : 'Send'}
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 2: Trivia Quiz Challenge */}
        {activeTab === 'quiz' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-xl mx-auto"
          >
            {!quizStarted ? (
              // Quiz Onboarding Page
              <div className="text-center space-y-5 p-6 bg-[#F1F3EF]/40 rounded-3xl border border-natural-border">
                <span className="text-5xl block animate-bounce">🎯</span>
                <div>
                  <h3 className="text-xl font-extrabold text-natural-heading font-display">{quizWelcome}</h3>
                  <p className="text-xs text-natural-text mt-1 max-w-sm mx-auto leading-relaxed font-medium">
                    {quizSubWelcome}
                  </p>
                </div>

                <form onSubmit={startQuiz} className="max-w-xs mx-auto space-y-3">
                  <input
                    type="text"
                    placeholder={lang === 'zh' ? '输入你的尊姓大名/昵称' : 'Enter your nickname'}
                    required
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-natural-border focus:outline-none focus:ring-2 focus:ring-natural-green bg-white text-center font-bold text-natural-heading"
                  />

                  <div className="flex justify-center gap-4">
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-[#6B6B5E] cursor-pointer">
                      <input
                        type="radio"
                        name="quiz-rel"
                        checked={quizRelation === 'classmate'}
                        onChange={() => setQuizRelation('classmate')}
                        className="accent-natural-green"
                      />
                      <span>🎒 {lang === 'zh' ? '我是同学' : 'I’m a classmate'}</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-[#6B6B5E] cursor-pointer">
                      <input
                        type="radio"
                        name="quiz-rel"
                        checked={quizRelation === 'cousin'}
                        onChange={() => setQuizRelation('cousin')}
                        className="accent-natural-green"
                      />
                      <span>🏡 {lang === 'zh' ? '我是亲戚/家人' : 'I’m family/cousin'}</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-natural-green hover:bg-[#3E5C38] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs active:translate-y-0.5"
                  >
                    🚀 {t.quizStartBtn}
                  </button>
                </form>
              </div>
            ) : quizCompleted ? (
              // Quiz Completed Outcome page
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6 p-6 border border-[#CCD5AE] rounded-3xl bg-[#E9EDC9]/10"
              >
                <div>
                  <span className="text-5xl block mb-2">🏅</span>
                  <h3 className="text-xl font-black text-natural-heading font-display">
                    {lang === 'zh' ? '挑战结果出炉啦！' : 'Quiz Results Are Out!'}
                  </h3>
                  <p className="text-xs text-natural-muted font-bold mt-0.5">
                    {lang === 'zh' ? `${nickname} 的终极默契报告` : `Ultimate Chemistry Report of ${nickname}`}
                  </p>
                </div>

                <div className="max-w-xs mx-auto bg-white border border-natural-border rounded-2xl p-5 shadow-xs">
                  <span className="text-[10px] font-bold text-natural-muted uppercase tracking-wider block">
                    {lang === 'zh' ? '最终得分' : 'Final Score'}
                  </span>
                  <span className={`text-5xl font-black block my-2 font-display ${score === QUIZ_QUESTIONS.length ? 'text-natural-green' : 'text-natural-sand'}`}>
                    {(score / QUIZ_QUESTIONS.length) * 100} {lang === 'zh' ? '分' : 'Pts'}
                  </span>
                  <span className="text-xs text-natural-text font-medium">
                    {lang === 'zh' ? `答对 ${score} / ${QUIZ_QUESTIONS.length} 题` : `Correct ${score} / ${QUIZ_QUESTIONS.length} Questions`}
                  </span>
                </div>

                {/* Score Comments and Certificates */}
                <div className="max-w-sm mx-auto p-4 rounded-xl text-xs text-natural-text leading-relaxed font-medium">
                  {score === QUIZ_QUESTIONS.length ? (
                    <div className="bg-[#E9EDC9]/30 border border-[#CCD5AE] p-4 rounded-xl text-natural-darkgreen space-y-3">
                      <p className="font-extrabold text-sm text-natural-heading flex items-center justify-center gap-1">
                        🏆 {lang === 'zh' ? '满分通过！超级默契王！' : 'Perfect Score! Chemistry Legend!'}
                      </p>
                      <p>
                        {lang === 'zh' 
                          ? '恭喜你！你简直太懂壮壮了，完全是一家人或者死党级别的了解程度！' 
                          : 'Congratulations! You know Zhuangzhuang inside out, a true bestie or family level understanding!'}
                      </p>
                      <div className="border-t border-dashed border-[#CCD5AE] pt-3 text-center">
                        <span className="text-[10px] font-extrabold uppercase tracking-wide block text-natural-green mb-1">
                          【{lang === 'zh' ? '荣誉结业电子证书' : 'Honorary E-Certificate'}】
                        </span>
                        <div className="bg-white p-3 rounded-lg border border-[#CCD5AE] text-left font-serif relative overflow-hidden">
                          {/* Cute stamp */}
                          <div className="absolute -right-2 -bottom-2 w-14 h-14 border-2 border-red-400 rounded-full flex items-center justify-center text-red-500 font-extrabold text-[9px] rotate-12 select-none opacity-40">
                            {lang === 'zh' ? '壮壮之印' : 'Zhuang Stamp'}
                          </div>
                          <p className="font-bold text-[11px] text-natural-heading font-sans mb-1">
                            {lang === 'zh' ? `特颁此证给 ${nickname}：` : `Certificate awarded to ${nickname}:`}
                          </p>
                          <p className="indent-4 leading-normal text-natural-text font-sans">
                            {lang === 'zh' 
                              ? `鉴于你在“壮壮默契大考验”中以百分之百的准确率，证明了你与壮壮之间无可匹敌的知音情谊。特此授予 ${
                                  quizRelation === 'classmate' ? '【无敌铁杆班级大死党】' : '【超级相亲相爱一家人】'
                                } 荣誉金杯奖！`
                              : `In recognition of your 100% correct rate on Zhuangzhuang’s trivia challenge, proving your incredible chemistry. We hereby award you the trophy of ${
                                  quizRelation === 'classmate' ? '【Ultimate Best Friend Forever】' : '【Loving Family Member of the Year】'
                                }!`}
                          </p>
                          <p className="text-right text-[8px] text-natural-muted mt-2 font-sans">
                            {lang === 'zh' ? '签署人：壮壮 ✍️' : 'Signed by: Zhuangzhuang ✍️'} <br/> 
                            {lang === 'zh' ? '日期：2026-07-04' : 'Date: 2026-07-04'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : score >= 3 ? (
                    <div className="bg-[#FEFAE0] border border-[#E6E2D3] p-4 rounded-xl text-[#A67C52]">
                      <p className="font-bold mb-1">{lang === 'zh' ? '👍 表现很不错！' : '👍 Excellent Job!'}</p>
                      {lang === 'zh'
                        ? '成绩合格，你和壮壮非常有共同话题，看来平时没少一起聊天、玩耍！下次挑战一下100分吧！'
                        : 'Passed with high score! You and Zhuangzhuang share lots of common interests. Try to get 100% next time!'}
                    </div>
                  ) : (
                    <div className="bg-[#F1F3EF] border border-natural-border p-4 rounded-xl text-natural-text">
                      <p className="font-bold mb-1">{lang === 'zh' ? '😅 还需要多交流哦' : '😅 Let’s talk more'}</p>
                      {lang === 'zh'
                        ? '看来你和壮壮平时见面的机会还不够多，没关系，看看壮壮的“全部爱好”介绍，马上去留言板留下你的联系方式，约他放学一起钓鱼吧！'
                        : 'Looks like you should hang out more with Zhuangzhuang! Explore all his hobbies, leave a message on his guestbook, and ask him out for SUP or coding!'}
                    </div>
                  )}
                </div>

                <button
                  onClick={resetQuiz}
                  className="px-6 py-2.5 bg-natural-dark hover:bg-black text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  🔄 {lang === 'zh' ? '重新开始挑战' : 'Restart Challenge'}
                </button>
              </motion.div>
            ) : (
              // Quiz Active Testing Page
              <div className="bg-[#F1F3EF]/40 border border-natural-border rounded-3xl p-6 space-y-5">
                {/* Progress bar */}
                <div className="flex items-center justify-between text-xs text-natural-muted font-bold font-display">
                  <span>{lang === 'zh' ? `挑战中 ${currentQ + 1} / ${QUIZ_QUESTIONS.length}` : `Q ${currentQ + 1} / ${QUIZ_QUESTIONS.length}`}</span>
                  <span>{lang === 'zh' ? `当前得分：${score} / ${QUIZ_QUESTIONS.length}` : `Current Score: ${score} / ${QUIZ_QUESTIONS.length}`}</span>
                </div>
                <div className="w-full bg-[#E2E6E0] h-1.5 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${((currentQ + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                    className="bg-natural-green h-full transition-all duration-300"
                  />
                </div>

                {/* Question Text */}
                <div>
                  <span className="inline-block bg-[#E9EDC9] text-natural-darkgreen text-[10px] font-bold px-2 py-0.5 rounded-md mb-2">
                    {lang === 'zh' ? `第 ${currentQ + 1} 题` : `Question ${currentQ + 1}`}
                  </span>
                  <h4 className="text-base font-extrabold text-natural-heading font-display">
                    {QUIZ_QUESTIONS[currentQ].question}
                  </h4>
                </div>

                {/* Options List */}
                <div className="space-y-2.5">
                  {QUIZ_QUESTIONS[currentQ].options.map((opt, idx) => {
                    const isSelected = selectedAns === idx;
                    const isCorrect = idx === QUIZ_QUESTIONS[currentQ].correct;
                    const showAnswer = selectedAns !== null;

                    let btnClass = 'bg-white border-natural-border text-natural-text hover:bg-[#F1F3EF]';
                    if (showAnswer) {
                      if (isCorrect) {
                        btnClass = 'bg-[#E9EDC9]/40 border-[#CCD5AE] text-natural-darkgreen';
                      } else if (isSelected) {
                        btnClass = 'bg-natural-sand/10 border-natural-sand text-[#A67C52]';
                      } else {
                        btnClass = 'bg-white/40 border-natural-border-light text-natural-muted opacity-50';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswerSelect(idx)}
                        disabled={showAnswer}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${btnClass}`}
                      >
                        <span>{opt}</span>
                        {showAnswer && isCorrect && <Check className="w-4 h-4 text-natural-green" />}
                        {showAnswer && isSelected && !isCorrect && <span className="text-natural-sand text-sm font-bold">×</span>}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation text after answering */}
                {selectedAns !== null && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className={`p-4 rounded-xl text-xs leading-relaxed font-medium ${
                      selectedAns === QUIZ_QUESTIONS[currentQ].correct
                        ? 'bg-[#E9EDC9]/20 border border-[#CCD5AE] text-natural-darkgreen'
                        : 'bg-natural-sand/10 border border-[#E6E2D3] text-[#A67C52]'
                    }`}
                  >
                    <div className="flex items-start gap-1.5">
                      <AlertCircle className="w-4 h-4 text-natural-muted shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold mb-0.5">
                          {selectedAns === QUIZ_QUESTIONS[currentQ].correct 
                            ? (lang === 'zh' ? '🎉 答对啦！' : '🎉 Correct!') 
                            : (lang === 'zh' ? '🥺 答错啦！' : '🥺 Incorrect!')}
                        </p>
                        <p>{QUIZ_QUESTIONS[currentQ].explanation}</p>
                      </div>
                    </div>

                    <button
                      onClick={nextQuestion}
                      className="mt-4 w-full py-2 bg-natural-green hover:bg-[#3E5C38] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      {currentQ === QUIZ_QUESTIONS.length - 1 
                        ? (lang === 'zh' ? '查看我的默契报告 📊' : 'View Report 📊') 
                        : (lang === 'zh' ? '下一题 ➡️' : 'Next Question ➡️')}
                    </button>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
