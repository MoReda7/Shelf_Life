/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { LayoutDashboard, Settings, Info, ShoppingBasket } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import { FoodList } from './components/FoodList';
import { AddFoodDialog } from './components/AddFoodDialog';
import { useLocalStorage } from './hooks/useLocalStorage';
import { FoodItem } from './types';
import { checkExpiringItems, requestNotificationPermission } from './lib/notifications';

export default function App() {
  const [items, setItems] = useLocalStorage<FoodItem[]>('shelf-life-items', []);
  const [hasRequestedPermission, setHasRequestedPermission] = useLocalStorage('notification-requested', false);

  useEffect(() => {
    // Check for expiring items on launch
    if (items.length > 0) {
      checkExpiringItems(items);
    }

    // Request notification permission once
    if (!hasRequestedPermission) {
      requestNotificationPermission().then(() => {
        setHasRequestedPermission(true);
      });
    }
  }, []);

  const handleAddItem = (newItem: FoodItem) => {
    setItems((prev) => [...prev, newItem]);
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter(item => item.id !== id));
  };

  const expiringSoonCount = items.filter(item => {
    const date = new Date(item.expiryDate);
    const today = new Date();
    const diff = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff <= 3 && diff > 0;
  }).length;

  return (
    <div className="flex flex-col min-h-screen bg-[#F1F5F9] font-sans text-slate-900 overflow-x-hidden">
      <nav className="flex items-center justify-between px-6 py-6 bg-white border-b border-slate-200 shadow-sm sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-100">
            <ShoppingBasket className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-slate-800 leading-none">SHELF LIFE</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Zero-Waste Management</p>
          </div>
        </div>
        
        <div className="hidden sm:flex items-center gap-4">
          <div className="flex flex-col items-end leading-none">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Efficiency</span>
            <span className="text-xl font-black text-emerald-600">92%</span>
          </div>
          <div className="h-10 w-[1px] bg-slate-200"></div>
          <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100 text-emerald-700 font-bold text-xs uppercase tracking-tighter">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            All Systems Local
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
        <section className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center bg-slate-50/50 gap-4">
            <h2 className="font-black text-lg text-slate-700 uppercase tracking-tighter flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5" />
              Inventory Pulse
            </h2>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-black rounded-full uppercase tracking-tighter shadow-sm">
                {items.filter(i => new Date(i.expiryDate) < new Date()).length} Critical
              </span>
              <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-black rounded-full uppercase tracking-tighter shadow-sm">
                {expiringSoonCount} Warning
              </span>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-black rounded-full uppercase tracking-tighter shadow-sm">
                {items.length - expiringSoonCount - items.filter(i => new Date(i.expiryDate) < new Date()).length} Safe
              </span>
            </div>
          </div>
          
          <div className="flex-1 min-h-[400px]">
            <FoodList items={items} onDelete={handleDeleteItem} />
          </div>
        </section>

        <aside className="hidden lg:flex flex-col gap-6">
          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-2xl flex flex-col justify-between">
            <div>
              <h3 className="font-black text-lg uppercase tracking-tighter italic mb-4">Eco Insight</h3>
              <p className="text-xs text-slate-400 font-medium leading-relaxed italic border-l-2 border-emerald-500 pl-3">
                "Did you know? Americans throw away $161 billion worth of food each year. Your tracking saves $42/mo on average."
              </p>
            </div>
            <div className="mt-8">
              <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shelf Efficiency</span>
                <span className="text-xl font-black text-emerald-400">92%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[92%] shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col gap-4 shadow-lg">
            <h3 className="font-black text-slate-400 text-[10px] uppercase tracking-widest">Financial Pulse</h3>
            <div className="grid grid-cols-2 gap-3">
               <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Saved</p>
                  <p className="text-xl font-black text-slate-700">$124</p>
               </div>
               <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Avoided</p>
                  <p className="text-xl font-black text-red-400">4 wasted</p>
               </div>
            </div>
          </div>
        </aside>
      </main>

      <footer className="hidden sm:flex bg-white border-t border-slate-200 px-8 py-3 items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] sticky bottom-0">
        <div>SHELF LIFE V1.0.4 — OFFLINE SECURE</div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
          ENCRYPTED LOCAL STORAGE
        </div>
      </footer>

      <AddFoodDialog onAdd={handleAddItem} />
      
      <Toaster position="top-center" richColors />
    </div>
  );
}
