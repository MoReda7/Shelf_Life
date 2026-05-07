import React, { useState } from 'react';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '../lib/utils';
import { FoodItem } from '../types';

interface AddFoodDialogProps {
  onAdd: (item: FoodItem) => void;
}

export function AddFoodDialog({ onAdd }: AddFoodDialogProps) {
  const [name, setName] = useState('');
  const [date, setDate] = useState<Date>();
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !date) return;

    const newItem: FoodItem = {
      id: uuidv4(),
      name,
      expiryDate: date.toISOString(),
      createdAt: Date.now(),
    };

    onAdd(newItem);
    setName('');
    setDate(undefined);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="fixed bottom-6 right-6 h-16 w-16 rounded-3xl shadow-2xl bg-emerald-600 hover:bg-emerald-500 transition-all duration-300 group active:scale-95" size="icon">
            <Plus className="h-8 w-8 text-white transition-transform group-hover:rotate-90" />
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px] rounded-3xl border-slate-200 bg-white p-0 overflow-hidden">
        <div className="bg-slate-900 p-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase tracking-tighter italic">Quick Action</DialogTitle>
          </DialogHeader>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5 text-left">
            <Label htmlFor="name" className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Item Name</Label>
            <Input
              id="name"
              placeholder="e.g. Avocado"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-slate-50 border-slate-200 rounded-xl h-12 focus:ring-2 focus:ring-emerald-500 transition-all font-medium placeholder:text-slate-300"
              required
            />
          </div>
          <div className="space-y-1.5 text-left">
            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Expiry Date</Label>
            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-medium h-12 rounded-xl bg-slate-50 border-slate-200 focus:ring-2 focus:ring-emerald-500 transition-all",
                      !date && "text-slate-300"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                    {date ? format(date, "PPP") : <span>Set expiration...</span>}
                  </Button>
                }
              />
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  required
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="pt-2">
            <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-black h-12 rounded-xl flex items-center justify-center gap-2 uppercase tracking-tight transition-all active:scale-[0.98]">
              <span>Add to Shelf</span>
              <Plus className="w-4 h-4" strokeWidth={3} />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
