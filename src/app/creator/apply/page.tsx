'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { applicationsApi } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Sparkles, ShieldCheck, CheckCircle2, FileText, ArrowRight } from 'lucide-react';

const applySchema = z.object({
  stageName: z.string().min(2, 'Performer / Stage name must be at least 2 characters'),
  legalFirstName: z.string().min(2, 'Legal first name is required'),
  legalLastName: z.string().min(2, 'Legal last name is required'),
  dateOfBirth: z.string().refine((dob) => {
    if (!dob) return false;
    const age = Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    return age >= 18;
  }, { message: 'You must be at least 18 years of age to apply' }),
  country: z.string().min(2, 'Country is required'),
  idDocumentType: z.enum(['PASSPORT', 'DRIVERS_LICENSE', 'NATIONAL_ID']),
  idDocumentNumber: z.string().min(3, 'Government ID / Document number is required'),
  bio: z.string().optional(),
  socialLinks: z.string().optional(),
  consent2257: z.boolean().refine((v) => v === true, {
    message: 'You must consent to 18 U.S.C. 2257 identity verification recordkeeping',
  }),
});

type ApplyFormData = z.infer<typeof applySchema>;

export default function CreatorApplyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ApplyFormData>({
    resolver: zodResolver(applySchema),
    defaultValues: {
      stageName: '',
      legalFirstName: '',
      legalLastName: '',
      dateOfBirth: '',
      country: '',
      idDocumentType: 'PASSPORT',
      idDocumentNumber: '',
      bio: '',
      socialLinks: '',
      consent2257: false,
    },
  });

  const onSubmit = async (data: ApplyFormData) => {
    try {
      const bioText = data.bio
        ? (data.socialLinks ? `${data.bio} (Socials: ${data.socialLinks})` : data.bio)
        : (data.socialLinks ? `Socials: ${data.socialLinks}` : undefined);

      await applicationsApi.submit({
        stageName: data.stageName,
        legalFirstName: data.legalFirstName,
        legalLastName: data.legalLastName,
        dateOfBirth: data.dateOfBirth,
        country: data.country,
        idDocumentType: data.idDocumentType,
        idDocumentNumber: data.idDocumentNumber,
        ...(bioText ? { bio: bioText } : {}),
      });
      setIsSuccess(true);
      toast({
        type: 'success',
        title: 'Application Submitted',
        message: 'Your creator application is under review by our compliance team.',
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Could not transmit application. Please check your data and retry.';
      toast({
        type: 'error',
        title: 'Submission Failed',
        message,
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400 bg-purple-950/60 border border-purple-500/30 px-3 py-1 rounded-full">
          Broadcaster Onboarding
        </span>
        <h1 className="text-3xl font-black text-white">Apply to Broadcast on Velora</h1>
        <p className="text-xs text-zinc-400 max-w-lg mx-auto leading-relaxed">
          Join thousands of verified performers earning top revenue with live streaming, private video sessions, and VIP media sales.
        </p>
      </div>

      {isSuccess ? (
        <div className="rounded-3xl bg-[#0f0f18] border border-purple-500/30 p-8 text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-purple-950/60 border border-purple-500/40 flex items-center justify-center mx-auto text-purple-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Application Received</h2>
          <p className="text-xs text-zinc-300 max-w-md mx-auto leading-relaxed">
            Our compliance team will review your application within 24 to 48 hours. Once pre-approved, you will receive an invitation to complete your automated Sumsub identity liveness verification.
          </p>
          <div className="pt-2">
            <Link href="/creator/verification">
              <Button variant="primary">
                View Verification Status <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Performer Application & 2257 Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-xs">
              <Input
                label="Performer / Stage Name (Public Channel Name)"
                placeholder="e.g. LadyVelora, Aria Star"
                error={errors.stageName?.message}
                {...register('stageName')}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Legal First Name"
                  placeholder="As shown on government ID"
                  error={errors.legalFirstName?.message}
                  {...register('legalFirstName')}
                />
                <Input
                  label="Legal Last Name"
                  placeholder="As shown on government ID"
                  error={errors.legalLastName?.message}
                  {...register('legalLastName')}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Date of Birth"
                  type="date"
                  error={errors.dateOfBirth?.message}
                  {...register('dateOfBirth')}
                />

                <Input
                  label="Country of Residence"
                  placeholder="e.g. US, Canada, UK, Germany"
                  error={errors.country?.message}
                  {...register('country')}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Government ID Document Type
                  </label>
                  <select
                    {...register('idDocumentType')}
                    className="w-full bg-[#12121c] border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
                  >
                    <option value="PASSPORT">Passport</option>
                    <option value="DRIVERS_LICENSE">Driver&apos;s License</option>
                    <option value="NATIONAL_ID">National Identity Card</option>
                  </select>
                </div>

                <Input
                  label="Government ID / Document Number"
                  placeholder="e.g. Passport or License number"
                  error={errors.idDocumentNumber?.message}
                  {...register('idDocumentNumber')}
                />
              </div>

              <Input
                label="Bio & Performance Style (Optional)"
                placeholder="e.g. Cosplay, gaming, and interactive music streams"
                error={errors.bio?.message}
                {...register('bio')}
              />

              <Input
                label="Existing Socials / OnlyFans / Fansly / Twitter Links (Optional)"
                placeholder="https://twitter.com/your_handle"
                error={errors.socialLinks?.message}
                {...register('socialLinks')}
              />

              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-zinc-300 leading-relaxed">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-purple-600 focus:ring-purple-500 mt-0.5"
                    {...register('consent2257')}
                  />
                  <span>
                    I certify under penalty of perjury that I am at least 18 years old, and I consent to having my identity records verified and stored in compliance with 18 U.S.C. § 2257.
                  </span>
                </label>
                {errors.consent2257 && (
                  <p className="text-xs text-rose-400 pl-6">{errors.consent2257.message}</p>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting}>
                  Submit Application
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
