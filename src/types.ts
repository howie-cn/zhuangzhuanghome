/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RelationshipType = 'classmate' | 'cousin' | 'teacher' | 'friend';

export interface CommentReply {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  isZhuangzhuang: boolean;
}

export interface GuestbookMessage {
  id: string;
  name: string;
  relationship: RelationshipType;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: CommentReply[];
}

export interface FishCatch {
  name: string;
  weight: number; // in kg
  length: number; // in cm
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  color: string;
}

export interface HobbyDetail {
  id: string;
  title: string;
  chineseTitle: string;
  iconName: string;
  color: string;
  banner: string;
  description: string;
  stats: { label: string; value: string }[];
  achievements: string[];
}
