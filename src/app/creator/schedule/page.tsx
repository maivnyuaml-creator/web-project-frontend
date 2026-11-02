'use client';

import React, { useState } from 'react';
import { CreatorLayout } from '@/components/layout/CreatorLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import { useToast } from '@/components/ui/Toast';
import { CreatorScheduleItem } from '@/types';
import { Calendar, Plus, Trash2, Clock } from 'lucide-react';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const INITIAL_SCHEDULE: CreatorScheduleItem[] = [
  { id: '1', dayOfWeek: 1, startTime: '19:00', endTime: '23:00', title: 'Cyber Monday Cosplay Stream', isRecurring: true },
  { id: '2', dayOfWeek: 3, startTime: '19:00', endTime: '23:00', title: 'Midweek Chill & Q&A', isRecurring: true },
  { id: '3', dayOfWeek: 5, startTime: '20:00', endTime: '01:00', title: 'Friday Night Dance Party', isRecurring: true },
  { id: '4', dayOfWeek: 6, startTime: '20:00', endTime: '02:00', title: 'Weekend Supporter Special', isRecurring: true },
];

export default function CreatorSchedulePage() {
  const { toast } = useToast();
  const [schedule, setSchedule] = useState<CreatorScheduleItem[]>(INITIAL_SCHEDULE);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('19:00');
  const [endTime, setEndTime] = useState('23:00');

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast({ type: 'error', title: 'Title Required', message: 'Please enter a stream session title.' });
      return;
    }
    const newSlot: CreatorScheduleItem = {
      id: Math.random().toString(36).substring(2, 9),
      dayOfWeek: Number(dayOfWeek),
      title: title.trim(),
      startTime,
      endTime,
      isRecurring: true,
    };
    setSchedule([...schedule, newSlot]);
    setIsDialogOpen(false);
    setTitle('');
    toast({ type: 'success', title: 'Slot Added', message: 'New scheduled stream added to your public profile.' });
  };

  const handleDeleteSlot = (id: string) => {
    setSchedule(schedule.filter((s) => s.id !== id));
    toast({ type: 'info', title: 'Slot Removed', message: 'Stream slot deleted.' });
  };

  return (
    <CreatorLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              Broadcasting Schedule Manager
            </h2>
            <p className="text-xs text-zinc-400">
              Manage your weekly recurring streaming hours shown on your creator page.
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-1" /> Add Broadcast Slot
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {schedule.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-[#0f0f18] border border-zinc-800/80 hover:border-zinc-700 transition-colors flex flex-col justify-between shadow-lg"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase bg-purple-950/60 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded font-bold inline-block">
                  {DAYS[item.dayOfWeek]}
                </span>
                <h4 className="text-sm font-bold text-white">{item.title}</h4>
                <p className="text-xs text-zinc-400 flex items-center gap-1.5 font-mono">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" /> {item.startTime} - {item.endTime} (EST)
                </p>
              </div>

              <div className="flex justify-end pt-4 border-t border-zinc-800/60 mt-4">
                <button
                  onClick={() => handleDeleteSlot(item.id)}
                  className="p-1.5 text-zinc-400 hover:text-rose-400 rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Add Broadcast Slot"
        description="Set your scheduled stream day, title, and hours."
      >
        <form onSubmit={handleAddSlot} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Day of Week</label>
            <select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(Number(e.target.value))}
              className="w-full bg-[#12121c] border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
            >
              {DAYS.map((day, idx) => (
                <option key={day} value={idx}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Stream Event Title"
            placeholder="e.g. Cosplay & DJ Set"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Time (EST)"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <Input
              label="End Time (EST)"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Slot
            </Button>
          </div>
        </form>
      </Dialog>
    </CreatorLayout>
  );
}
