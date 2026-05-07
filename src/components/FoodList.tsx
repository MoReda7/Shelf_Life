import { motion, AnimatePresence } from 'motion/react';
import { Trash2, AlertTriangle, CheckCircle, Clock, ShoppingBasket } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { getFoodStorageAdvice } from '../lib/gemini';
import * as React from 'react';
import { FoodItem, Status } from '../types';
import { getStatus, getDaysRemaining } from '../lib/date-utils';

interface FoodListProps {
  items: FoodItem[];
  onDelete: (id: string) => void;
}

const statusConfig: Record<Status, { bg: string; border: string; text: string; label: string; accent: string }> = {
  expired: { 
    bg: 'bg-red-50', 
    border: 'border-red-100', 
    text: 'text-red-600', 
    label: 'Expired',
    accent: 'text-red-400'
  },
  warning: { 
    bg: 'bg-amber-50', 
    border: 'border-amber-100', 
    text: 'text-amber-600', 
    label: 'Expiring Soon',
    accent: 'text-amber-400'
  },
  safe: { 
    bg: 'bg-white', 
    border: 'border-slate-100', 
    text: 'text-emerald-600', 
    label: 'Safe',
    accent: 'text-slate-300'
  },
};

const getEmoji = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('milk') || n.includes('dairy')) return '🥛';
  if (n.includes('meat') || n.includes('steak') || n.includes('beef')) return '🥩';
  if (n.includes('egg')) return '🥚';
  if (n.includes('cheese')) return '🧀';
  if (n.includes('bread')) return '🍞';
  if (n.includes('fruit') || n.includes('apple') || n.includes('banana')) return '🍎';
  if (n.includes('veg') || n.includes('spinach') || n.includes('salad')) return '🥗';
  if (n.includes('chicken')) return '🍗';
  if (n.includes('fish') || n.includes('salmon')) return '🐟';
  return '📦';
};

const FoodItemCard = ({ item, onDelete }: { item: FoodItem; onDelete: (id: string) => void }) => {
  const [advice, setAdvice] = React.useState<string | null>(null);
  const status = getStatus(item.expiryDate);
  const daysLeft = getDaysRemaining(item.expiryDate);
  const config = statusConfig[status];

  React.useEffect(() => {
    if (status === 'safe') {
      getFoodStorageAdvice(item.name).then(setAdvice);
    }
  }, [item.name, status]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, x: -100 }}
      drag="x"
      dragConstraints={{ left: -100, right: 0 }}
      onDragEnd={(_, info) => {
        if (info.offset.x < -80) {
          onDelete(item.id);
        }
      }}
      transition={{ duration: 0.2 }}
      className="group relative touch-none"
    >
      <div className="absolute inset-0 flex items-center justify-end rounded-2xl bg-red-600 px-6 text-white">
        <div className="flex flex-col items-center">
          <Trash2 className="h-6 w-6" />
          <span className="text-[8px] font-black uppercase tracking-tighter mt-1">Delete</span>
        </div>
      </div>

      <Card
        className={cn(
          "relative overflow-hidden transition-all duration-200 border-2",
          config.bg,
          config.border,
          "rounded-2xl shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing"
        )}
      >
        <CardContent className="flex flex-col p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm border",
                  status === 'safe' ? 'bg-slate-50 border-slate-100' : 'bg-white border-transparent'
                )}
              >
                {getEmoji(item.name)}
              </div>
              <div>
                <h3 className="font-black text-slate-800 text-base leading-snug tracking-tight">{item.name}</h3>
                <p className={cn("text-[10px] font-black uppercase tracking-wider", config.text)}>
                  {daysLeft < 0
                    ? `Expired ${Math.abs(daysLeft)}d ago`
                    : daysLeft === 0
                    ? 'Expires Today'
                    : status === 'warning'
                    ? `Expiring in ${daysLeft} days`
                    : `Safe for ${daysLeft} days`}
                </p>
              </div>
            </div>

            <div className="text-right flex flex-col items-end leading-none">
              <p
                className={cn(
                  "text-2xl font-black italic tracking-tighter",
                  status === 'expired' || status === 'warning' ? config.text : 'text-slate-400'
                )}
              >
                {daysLeft}D
              </p>
              <p className={cn("text-[8px] font-black uppercase tracking-widest", config.accent)}>Remaining</p>
            </div>
          </div>

          {advice && status === 'safe' && (
            <div className="mt-3 bg-indigo-50/50 rounded-xl p-2.5 flex items-start gap-2 border border-indigo-100/30">
              <span className="text-xs">💡</span>
              <p className="text-[10px] text-indigo-700 font-bold italic leading-tight uppercase tracking-tight">
                {advice}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export function FoodList({ items, onDelete }: FoodListProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400">
        <div className="mb-4 rounded-3xl bg-slate-50 border border-dashed border-slate-200 p-8 shadow-inner">
          <ShoppingBasket className="h-12 w-12 opacity-20" />
        </div>
        <h3 className="text-sm font-black uppercase tracking-widest">Inventory Empty</h3>
        <p className="text-xs font-medium italic mt-1 max-w-[200px]">Secure local shelf data is ready for input.</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-2">
      <AnimatePresence mode="popLayout">
        {[...items]
          .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())
          .map((item) => (
            <FoodItemCard key={item.id} item={item} onDelete={onDelete} />
          ))}
      </AnimatePresence>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
