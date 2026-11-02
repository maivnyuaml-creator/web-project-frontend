'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { reportsApi } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ShieldAlert, CheckCircle2, FileWarning } from 'lucide-react';

const reportSchema = z.object({
  targetType: z.enum(['ROOM', 'USER', 'MESSAGE', 'MEDIA']),
  targetId: z.string().min(1, 'Please provide the username, room link, or identifier'),
  reason: z.string().min(1, 'Please select a violation category'),
  description: z.string().min(15, 'Please provide a detailed explanation (minimum 15 characters)'),
  evidenceUrls: z.string().optional(),
});

type ReportFormData = z.infer<typeof reportSchema>;

export default function ReportPage() {
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      targetType: 'ROOM',
      reason: 'UNDERAGE_CONCERN',
      targetId: '',
      description: '',
      evidenceUrls: '',
    },
  });

  const onSubmit = async (data: ReportFormData) => {
    try {
      await reportsApi.submitReport({
        targetType: data.targetType,
        targetId: data.targetId,
        reason: data.reason,
        description: data.description,
        evidenceUrls: data.evidenceUrls ? [data.evidenceUrls] : undefined,
      });

      setIsSuccess(true);
      reset();
      toast({
        type: 'success',
        title: 'Report Received',
        message: 'Your report has been logged and assigned to 24/7 emergency compliance.',
      });
    } catch {
      toast({
        type: 'error',
        title: 'Submission Failed',
        message: 'Could not transmit report. Please retry or email safety@veloralive.com directly.',
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-bold uppercase">
          <ShieldAlert className="w-4 h-4" /> 24/7 Moderation Portal
        </div>
        <h1 className="text-3xl font-black text-white">Submit a Safety or Policy Report</h1>
        <p className="text-xs text-zinc-400">
          All submissions are confidential. Reports involving suspected minors or non-consensual content receive immediate priority escalation.
        </p>
      </div>

      {isSuccess ? (
        <div className="rounded-3xl bg-[#0f0f18] border border-emerald-500/30 p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Report Successfully Logged</h2>
          <p className="text-xs text-zinc-300 max-w-md mx-auto leading-relaxed">
            Thank you for helping keep the Velora Live community safe. Our trust & safety team is actively investigating the reported content.
          </p>
          <Button variant="secondary" size="md" onClick={() => setIsSuccess(false)}>
            Submit Another Report
          </Button>
        </div>
      ) : (
        <div className="rounded-3xl bg-[#0f0f18] border border-zinc-800 p-8 shadow-2xl space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Content / Target Type
                </label>
                <select
                  {...register('targetType')}
                  className="w-full bg-[#12121c] border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-rose-500"
                >
                  <option value="ROOM">Live Stream Room</option>
                  <option value="USER">User Account / Broadcaster</option>
                  <option value="MESSAGE">Chat Message / Harassment</option>
                  <option value="MEDIA">Vault Media / Photoset</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Violation Category
                </label>
                <select
                  {...register('reason')}
                  className="w-full bg-[#12121c] border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-rose-500"
                >
                  <option value="UNDERAGE_CONCERN">Suspected Minor / Underage (Critical)</option>
                  <option value="NON_CONSENSUAL">Non-consensual sexual content / Revenge</option>
                  <option value="HARASSMENT">Harassment, Stalking or Hate Speech</option>
                  <option value="VIOLENCE">Violence or Self-Harm</option>
                  <option value="COPYRIGHT">Copyright / DMCA Infringement</option>
                  <option value="FRAUD">Scam, Financial Fraud or Impersonation</option>
                  <option value="OTHER">Other Terms Violation</option>
                </select>
              </div>
            </div>

            <Input
              label="Identifier, Username, or Room URL"
              placeholder="e.g. room-101 or @broadcaster_handle or URL"
              error={errors.targetId?.message}
              {...register('targetId')}
            />

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Detailed Description of Violation
              </label>
              <textarea
                rows={4}
                placeholder="Explain what occurred, timestamps if applicable, and any other relevant context..."
                className="w-full bg-[#12121c] border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                {...register('description')}
              />
              {errors.description && (
                <p className="text-xs text-rose-400 mt-1">{errors.description.message}</p>
              )}
            </div>

            <Input
              label="Evidence URL / Screenshot Link (Optional)"
              placeholder="https://..."
              error={errors.evidenceUrls?.message}
              {...register('evidenceUrls')}
            />

            <Button
              type="submit"
              variant="danger"
              size="lg"
              className="w-full mt-2"
              isLoading={isSubmitting}
            >
              <FileWarning className="w-4 h-4 mr-1.5" /> Submit Confidential Report
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
