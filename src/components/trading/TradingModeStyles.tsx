
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
  iconBg: string;
  lightBg: string;
  headerBg: string;
}

// Define reusable trading mode styles
export const tradingModeStyles: Record<TradingModeType, TradingModeStyle> = {
  scalp: {
    id: 'scalp',
    label: 'Scalp',
    color: 'text-info',
    bgColor: 'bg-info/10',
    hoverBg: 'hover:bg-info/30',
    activeBg: 'bg-info',
    borderColor: 'border-info/20',
    inactiveBg: 'bg-blue-900/20',
    inactiveText: 'text-info/80',
    alertBg: 'bg-info/5',
    gradientFrom: 'from-blue-600/90',
    gradientTo: 'to-blue-400/90',
    iconBg: 'bg-info/10',
    lightBg: 'bg-info/10 dark:bg-blue-950/30',
    headerBg: 'bg-info/5',
  },
  day: {
    id: 'day',
    label: 'Day',
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    hoverBg: 'hover:bg-yellow-900/30',
    activeBg: 'bg-yellow-600',
    borderColor: 'border-warning/20',
    inactiveBg: 'bg-warning/20',
    inactiveText: 'text-warning/80',
    alertBg: 'bg-warning/5',
    gradientFrom: 'from-yellow-500/90',
    gradientTo: 'to-yellow-400/90',
    iconBg: 'bg-warning/10',
    lightBg: 'bg-yellow-50 dark:bg-yellow-950/30',
    headerBg: 'bg-warning/5',
  },
  night: {
    id: 'night',
    label: 'Night',
    color: 'text-mode-night',
    bgColor: 'bg-mode-night/10',
    hoverBg: 'hover:bg-indigo-900/30',
    activeBg: 'bg-mode-night',
    borderColor: 'border-mode-night/20',
    inactiveBg: 'bg-indigo-900/20',
    inactiveText: 'text-mode-night/80',
    alertBg: 'bg-mode-night/5',
    gradientFrom: 'from-indigo-600/90',
    gradientTo: 'to-indigo-400/90',
    iconBg: 'bg-mode-night/10',
    lightBg: 'bg-indigo-50 dark:bg-indigo-950/30',
    headerBg: 'bg-mode-night/5',
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

export const getModeIconBgClass = (mode: TradingModeType) => {
  return tradingModeStyles[mode].iconBg;
};

export const getModeLightBgClass = (mode: TradingModeType) => {
  return tradingModeStyles[mode].lightBg;
};

export const getModeHeaderBgClass = (mode: TradingModeType) => {
  return tradingModeStyles[mode].headerBg;
};

export default tradingModeStyles;
