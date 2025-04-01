
import React from 'react';
import { cn } from '@/lib/utils';

// Define types for trading mode styling
export type TradingModeType = 'scalp' | 'day' | 'night';

export interface TradingModeStyle {
  id: TradingModeType;
  label: string;
  color: string;
  bgColor: string;
  hoverBg: string;
  activeBg: string;
  borderColor: string;
  inactiveBg: string;
  inactiveText: string;
  alertBg: string;
  gradientFrom: string;
  gradientTo: string;
}

// Define reusable trading mode styles
export const tradingModeStyles: Record<TradingModeType, TradingModeStyle> = {
  scalp: {
    id: 'scalp',
    label: 'Scalp',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    hoverBg: 'hover:bg-blue-900/30',
    activeBg: 'bg-blue-600',
    borderColor: 'border-blue-500/20',
    inactiveBg: 'bg-blue-900/20',
    inactiveText: 'text-blue-500/80',
    alertBg: 'bg-blue-500/5',
    gradientFrom: 'from-blue-600/90',
    gradientTo: 'to-blue-400/90',
  },
  day: {
    id: 'day',
    label: 'Day',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    hoverBg: 'hover:bg-amber-900/30',
    activeBg: 'bg-amber-600',
    borderColor: 'border-amber-500/20',
    inactiveBg: 'bg-amber-900/20',
    inactiveText: 'text-amber-500/80',
    alertBg: 'bg-amber-500/5',
    gradientFrom: 'from-amber-500/90',
    gradientTo: 'to-amber-400/90',
  },
  night: {
    id: 'night',
    label: 'Night',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10',
    hoverBg: 'hover:bg-indigo-900/30',
    activeBg: 'bg-indigo-600',
    borderColor: 'border-indigo-500/20',
    inactiveBg: 'bg-indigo-900/20',
    inactiveText: 'text-indigo-500/80',
    alertBg: 'bg-indigo-500/5',
    gradientFrom: 'from-indigo-600/90',
    gradientTo: 'to-indigo-400/90',
  }
};

// Helper to get style classes for a trading mode
export const getModeBgClass = (mode: TradingModeType, isActive: boolean = false) => {
  const style = tradingModeStyles[mode];
  return isActive 
    ? style.activeBg 
    : cn(style.inactiveText, style.inactiveBg, style.hoverBg);
};

export const getModeTextClass = (mode: TradingModeType) => {
  return tradingModeStyles[mode].color;
};

export const getModeAlertClass = (mode: TradingModeType) => {
  return tradingModeStyles[mode].alertBg;
};

export const getModeBorderClass = (mode: TradingModeType) => {
  return tradingModeStyles[mode].borderColor;
};

export const getModeGradientClass = (mode: TradingModeType) => {
  return cn('bg-gradient-to-br', tradingModeStyles[mode].gradientFrom, tradingModeStyles[mode].gradientTo);
};

export default tradingModeStyles;
