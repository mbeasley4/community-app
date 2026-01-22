// config/reactions.ts

import {
  ThumbsUp,
  PartyPopper,
  Handshake,
  Heart,
  Lightbulb,
  Laugh
} from 'lucide-react'

export const REACTIONS = [
  { type: 'like', Icon: ThumbsUp, bg: 'bg-blue-600' },
  { type: 'celebrate', Icon: PartyPopper, bg: 'bg-orange-500' },
  { type: 'support', Icon: Handshake, bg: 'bg-teal-500' },
  { type: 'love', Icon: Heart, bg: 'bg-red-500' },
  { type: 'insightful', Icon: Lightbulb, bg: 'bg-yellow-500' },
  { type: 'funny', Icon: Laugh, bg: 'bg-pink-500' },
] as const
