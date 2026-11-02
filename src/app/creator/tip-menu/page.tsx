'use client';

import React, { useState } from 'react';
import { CreatorLayout } from '@/components/layout/CreatorLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import { useToast } from '@/components/ui/Toast';
import { TipMenuItem } from '@/types';
import { Coins, Plus, Trash2, Edit2, Sparkles, Target } from 'lucide-react';

const INITIAL_TIP_MENU: TipMenuItem[] = [
  { id: '1', name: 'High Five & Audio Shoutout', tokens: 15, description: 'Personal spoken shoutout on stream' },
  { id: '2', name: 'Choose Background Track', tokens: 35, description: 'Pick the background song' },
  { id: '3', name: 'Outfit Accessory Swap', tokens: 100, description: 'Change accessories on camera' },
  { id: '4', name: 'Signed Polaroid Photo', tokens: 250, description: 'Instant photo signed on stream' },
  { id: '5', name: 'Dance to Favorite Song', tokens: 500, description: 'High energy dance routine' },
  { id: '6', name: 'VIP Private Session (10m)', tokens: 1000, description: '1-on-1 private video lounge' },
];

export default function CreatorTipMenuPage() {
  const { toast } = useToast();
  const [tipItems, setTipItems] = useState<TipMenuItem[]>(INITIAL_TIP_MENU);
  const [goalTitle, setGoalTitle] = useState('New Cyberpunk Cosplay Outfit');
  const [goalTarget, setGoalTarget] = useState('5000');
  const [goalCurrent, setGoalCurrent] = useState('3740');

  // Dialog for adding/editing tip item
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formTokens, setFormTokens] = useState('');
  const [formDesc, setFormDesc] = useState('');

  const openAddDialog = () => {
    setEditingId(null);
    setFormName('');
    setFormTokens('');
    setFormDesc('');
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: TipMenuItem) => {
    setEditingId(item.id);
    setFormName(item.name);
    setFormTokens(item.tokens.toString());
    setFormDesc(item.description || '');
    setIsDialogOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    const tokens = parseInt(formTokens, 10);
    if (!formName.trim() || !tokens || tokens <= 0) {
      toast({ type: 'error', title: 'Invalid Input', message: 'Name and token amount are required.' });
      return;
    }

    if (editingId) {
      setTipItems((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? { ...item, name: formName.trim(), tokens, description: formDesc.trim() || undefined }
            : item
        )
      );
      toast({ type: 'success', title: 'Item Updated', message: 'Tip menu item updated.' });
    } else {
      const newItem: TipMenuItem = {
        id: Math.random().toString(36).substring(2, 9),
        name: formName.trim(),
        tokens,
        description: formDesc.trim() || undefined,
      };
      setTipItems((prev) => [...prev, newItem]);
      toast({ type: 'success', title: 'Item Added', message: 'New tip option added to menu.' });
    }

    setIsDialogOpen(false);
  };

  const handleDeleteItem = (id: string) => {
    setTipItems((prev) => prev.filter((item) => item.id !== id));
    toast({ type: 'info', title: 'Item Removed', message: 'Tip option removed.' });
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      type: 'success',
      title: 'Goal Updated',
      message: 'Active room tip goal has been broadcast to viewers.',
    });
  };

  return (
    <CreatorLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Coins className="w-5 h-5 text-amber-400" />
              Tip Menu & Room Goals
            </h2>
            <p className="text-xs text-zinc-400">
              Set interactive actions viewers can trigger by sending tokens in your room.
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={openAddDialog}>
            <Plus className="w-4 h-4 mr-1" /> Add Tip Option
          </Button>
        </div>

        {/* Tip Goal Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Target className="w-4 h-4 text-purple-400" />
              Active Room Tip Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveGoal} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-5">
                <Input
                  label="Goal Title"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="e.g. New Studio Lighting"
                />
              </div>
              <div className="sm:col-span-3">
                <Input
                  label="Target Tokens"
                  type="number"
                  value={goalTarget}
                  onChange={(e) => setGoalTarget(e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <Input
                  label="Current Tokens"
                  type="number"
                  value={goalCurrent}
                  onChange={(e) => setGoalCurrent(e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" variant="secondary" className="w-full">
                  Update Goal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Tip Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tipItems.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-[#0f0f18] border border-zinc-800/80 hover:border-zinc-700 transition-colors flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="text-sm font-bold text-white">{item.name}</h4>
                  <span className="text-xs font-black text-amber-300 bg-amber-950/40 border border-amber-500/30 px-2.5 py-1 rounded-full shrink-0">
                    🪙 {item.tokens}
                  </span>
                </div>
                {item.description && (
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{item.description}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-800/60 mt-4">
                <button
                  type="button"
                  onClick={() => openEditDialog(item)}
                  className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
                  title="Edit item"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteItem(item.id)}
                  className="p-1.5 text-zinc-400 hover:text-rose-400 rounded-lg hover:bg-zinc-800 transition-colors"
                  title="Delete item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Dialog */}
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={editingId ? 'Edit Tip Item' : 'Add New Tip Item'}
        description="Configure the token price and viewer perk."
      >
        <form onSubmit={handleSaveItem} className="space-y-4">
          <Input
            label="Action / Perk Name"
            placeholder="e.g. Choose Next Song"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            required
          />

          <Input
            label="Token Price"
            type="number"
            min="1"
            placeholder="e.g. 50"
            value={formTokens}
            onChange={(e) => setFormTokens(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Explain how you will perform or deliver this action..."
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              className="w-full bg-[#12121c] border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingId ? 'Save Item' : 'Add Item'}
            </Button>
          </div>
        </form>
      </Dialog>
    </CreatorLayout>
  );
}
