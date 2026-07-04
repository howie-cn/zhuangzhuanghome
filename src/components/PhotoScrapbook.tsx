/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Camera, Calendar, MapPin, Heart, ZoomIn, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, TRANSLATIONS } from '../translations';

interface PolaroidPhoto {
  id: string;
  url: string;
  title: string;
  date: string;
  location: string;
  description: string;
  rotation: string; // Tailwinds rotate class e.g. 'rotate-1'
  category: 'sports' | 'tech';
}

export default function PhotoScrapbook({ lang }: { lang: Language }) {
  const [selectedPhoto, setSelectedPhoto] = useState<PolaroidPhoto | null>(null);
  
  const t = TRANSLATIONS[lang];
  const scrapTitleSub = t.photoScrapbookSub;
  const scrapTitle = t.photoScrapbookTitle;
  const scrapDesc = t.photoScrapbookDesc;
  const catSports = t.photoCatSports;
  const catTech = t.photoCatTech;
  const catSportsBadge = t.photoCatSports;
  const catTechBadge = t.photoCatTech;
  const photoDate = t.photoModalDate;
  const photoLoc = t.photoModalLoc;
  const photoCamera = t.photoModalCam;
  const photoFav = t.photoModalHeart;

  const PHOTOS: PolaroidPhoto[] = [
    {
      id: 'photo-1',
      url: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a27?auto=format&fit=crop&w=600&q=80',
      title: lang === 'zh' ? '少儿杯50米自由泳决赛！🏊‍♂️' : 'Junior Cup 50m Freestyle Final! 🏊‍♂️',
      date: '2026-05-18',
      location: lang === 'zh' ? '市青少年体育馆游泳池' : 'City Youth Gymnasium Pool',
      description: lang === 'zh' 
        ? '虽然最后游了第二名，但是刷新了我自己的个人最好成绩（42秒）！爸爸奖励了我两个大香草冰淇淋球，超级开心！下次我要游得更快！蛙泳我也在练习啦。' 
        : 'Although I finished second, I smashed my personal best (42s)! Dad rewarded me with two massive scoops of vanilla ice cream, I am so happy! Next time I will swim even faster! I am practicing breaststroke too.',
      rotation: '-rotate-2 hover:rotate-0',
      category: 'sports'
    },
    {
      id: 'photo-2',
      url: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=600&q=80',
      title: lang === 'zh' ? '千岛湖上第一次成功起板划行 🏄‍♂️' : 'First Successful SUP Standup in Qiandao Lake! 🏄‍♂️',
      date: '2026-06-25',
      location: lang === 'zh' ? '浙江千岛湖浆板夏令营' : 'Zhejiang Qiandao Lake SUP Camp',
      description: lang === 'zh' 
        ? '第一天摔进湖里了五六次，湖水甜甜的（哈哈开玩笑）！第二天我终于找到了平衡点，可以稳稳地站着划五公里啦！我还学会了在板头上原地转圈圈，教练都夸我有天赋！' 
        : 'On the first day, I fell into the lake 5 or 6 times. The water is sweet (just kidding)! By the second day, I finally found my balance, and could stand and paddle for 5km steadily! I even learned 360 pivot turns, the coach said I have natural talent!',
      rotation: 'rotate-3 hover:rotate-0',
      category: 'sports'
    },
    {
      id: 'photo-3',
      url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80',
      title: lang === 'zh' ? '深夜调试避障雷达代码中 💻' : 'Debugging Radar Obstacle Code Late at Night 💻',
      date: '2026-04-10',
      location: lang === 'zh' ? '壮壮的编程卧室小天地' : "Zhuangzhuang's Cozy Programming Room",
      description: lang === 'zh' 
        ? '我的乐高Mindstorms履带坦克总是撞到床脚。我把超声波探测距离从10cm改成了18cm，又加了一个if else判断。当当当！坦克终于学会自动倒车绕行了！成就感爆棚！' 
        : 'My Lego Mindstorms tank kept bumping into the bed legs. I adjusted the ultrasonic range from 10cm to 18cm, and added another if-else check. TADA! The tank finally learned to reverse and bypass automatically! Incredible feeling of achievement!',
      rotation: '-rotate-1 hover:rotate-0',
      category: 'tech'
    },
    {
      id: 'photo-4',
      url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=600&q=80',
      title: lang === 'zh' ? '和爷爷钓上来的4.8kg巨无霸镜鲤！🎣' : '4.8kg Giant Carp with Grandpa! 🎣',
      date: '2026-06-12',
      location: lang === 'zh' ? '老家后山水库旁' : 'Beside the Reservoir behind Grandpa’s Hill',
      description: lang === 'zh' 
        ? '那天下午我坐了整整三个小时，浮漂一动不动，但我没放弃。就在我要收工时，鱼漂猛地沉底了！我和爷爷合力溜了十分钟的鱼才把它抄上岸。拍照完我们就把它放回水库啦。' 
        : 'That afternoon I sat for 3 full hours, and the bobber stayed absolutely still, but I didn’t give up. Right as we were packing, it yanked straight down! Grandpa and I wrestled with it for 10 minutes before scooping it up. After a photo, we happily released it back into the reservoir.',
      rotation: 'rotate-1 hover:rotate-0',
      category: 'sports'
    },
    {
      id: 'photo-5',
      url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
      title: lang === 'zh' ? '我的智能物联网小车一号测试 🤖' : 'My Smart IoT Car v1.0 Test Run 🤖',
      date: '2026-03-05',
      location: lang === 'zh' ? '学校科学兴趣社团课' : 'School Science Club Session',
      description: lang === 'zh' 
        ? '这是我和同桌李小明一起拼装的！我们给它安装了两个红外循线传感器。一启动，它就会沿着地上的黑胶带一直跑，像有生命一样。大家下周科技展示一定要来看我们演示！' 
        : 'My deskmate Li Xiaoming and I assembled this together! We installed two infrared line-tracking sensors. Once activated, it speeds along the black electrical tape on the floor as if it is alive. Don’t miss our tech show demo next week!',
      rotation: '-rotate-3 hover:rotate-0',
      category: 'tech'
    }
  ];

  return (
    <div id="scrapbook-container" className="space-y-6">
      <div className="text-center max-w-sm mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FEFAE0] text-[#A67C52] border border-[#E6E2D3] rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
          <Camera className="w-3.5 h-3.5" /> {scrapTitleSub}
        </span>
        <h3 className="text-xl font-bold text-natural-heading font-display">{scrapTitle}</h3>
        <p className="text-xs text-natural-muted mt-1 font-medium">
          {scrapDesc}
        </p>
      </div>

      {/* Grid of Polaroid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {PHOTOS.map((photo) => (
          <motion.div
            key={photo.id}
            whileHover={{ scale: 1.03, y: -4, zIndex: 10 }}
            className={`bg-white p-4 pb-6 rounded-sm shadow-xs border border-natural-border transform transition-transform duration-300 cursor-pointer ${photo.rotation} select-none`}
            onClick={() => setSelectedPhoto(photo)}
          >
            {/* Polaroid Image Slot */}
            <div className="relative aspect-square bg-[#F1F3EF] overflow-hidden rounded-xs border border-natural-border-light group">
              <img
                src={photo.url}
                alt={photo.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${
                photo.category === 'sports' ? 'bg-natural-green' : 'bg-natural-dark'
              }`}>
                {photo.category === 'sports' ? catSports : catTech}
              </span>
            </div>

            {/* Handwritten style caption */}
            <div className="mt-4 space-y-1.5 text-center">
              <h4 className="font-extrabold text-xs text-natural-heading font-display truncate">
                {photo.title}
              </h4>
              <div className="flex items-center justify-center gap-2 text-[10px] text-natural-muted font-bold font-sans">
                <span className="flex items-center gap-0.5"><Calendar className="w-3" /> {photo.date}</span>
                <span className="flex items-center gap-0.5 max-w-[120px] truncate"><MapPin className="w-3" /> {photo.location.split(' ')[0]}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Full-view Modal for Photos */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[32px] p-6 max-w-lg w-full shadow-md border border-natural-border flex flex-col gap-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 p-2 bg-[#F1F3EF] hover:bg-natural-border rounded-full transition-colors cursor-pointer text-natural-text"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Photo Title */}
              <div>
                <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full text-white mb-1 ${
                  selectedPhoto.category === 'sports' ? 'bg-natural-green' : 'bg-natural-dark'
                }`}>
                  {selectedPhoto.category === 'sports' ? catSportsBadge : catTechBadge}
                </span>
                <h3 className="text-lg font-extrabold text-natural-heading font-display">
                  {selectedPhoto.title}
                </h3>
              </div>

              {/* Enlarged Image */}
              <div className="aspect-video bg-[#F1F3EF] rounded-2xl overflow-hidden border border-natural-border">
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Captions / Details */}
              <div className="space-y-2 text-xs leading-relaxed text-natural-text font-medium">
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-bold text-natural-muted">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-[#A3A38E]" /> {photoDate}: {selectedPhoto.date}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#A3A38E]" /> {photoLoc}: {selectedPhoto.location}</span>
                </div>
                <p className="bg-[#FEFAE0]/80 p-4 rounded-2xl border border-natural-border text-natural-heading font-display italic">
                  “ {selectedPhoto.description} ”
                </p>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between border-t border-natural-border pt-3 text-[10px] text-natural-muted font-bold">
                <span>📷 {photoCamera}</span>
                <span className="flex items-center gap-0.5 text-natural-sand"><Heart className="w-3.5 h-3.5 fill-current" /> {photoFav}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
