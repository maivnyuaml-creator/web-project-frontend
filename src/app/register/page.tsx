'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/lib/auth/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Lock, Mail, User, AlertCircle, ArrowRight } from 'lucide-react';

const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username cannot exceed 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  ageConsent: z.boolean().refine((val) => val === true, {
    message: 'You must certify that you are at least 18 years old',
  }),
  termsConsent: z.boolean().refine((val) => val === true, {
    message: 'You must accept the Terms of Service & Privacy Policy',
  }),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerAuth } = useAuth();
  const { toast } = useToast();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      ageConsent: false,
      termsConsent: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);
    const result = await registerAuth({
      username: data.username,
      email: data.email,
      password: data.password,
      ageConsent: data.ageConsent,
    });

    if (result.success) {
      toast({
        type: 'success',
        title: 'Account Created!',
        message: 'Welcome to Velora Live! Please verify your email to unlock all features.',
      });
      router.push('/verify-email');
    } else {
      setServerError(result.error || 'Registration failed. Please try a different email or username.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Card Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-purple-900/40">
              <span className="text-white font-black text-xl">V</span>
            </div>
          </Link>
          <h1 className="text-2xl font-black text-white tracking-tight">Create your account</h1>
          <p className="text-xs text-zinc-400">
            Join the premier adult live streaming platform. 100% free to join.
          </p>
        </div>

        {/* Card Form */}
        <div className="rounded-3xl bg-[#0f0f18] border border-zinc-800 p-8 shadow-2xl space-y-6">
          {serverError && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 flex items-start gap-2.5 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Username"
              type="text"
              placeholder="unique_handle"
              leftIcon={<User className="w-4 h-4" />}
              error={errors.username?.message}
              {...register('username')}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Minimum 8 characters"
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.password?.message}
              {...register('password')}
            />

            {/* Age & Legal Checkboxes */}
            <div className="space-y-2.5 pt-2">
              <label className="flex items-start gap-2 cursor-pointer text-xs text-zinc-300">
                <input
                  type="checkbox"
                  className="rounded bg-zinc-900 border-zinc-700 text-purple-600 focus:ring-purple-500 w-4 h-4 mt-0.5"
                  {...register('ageConsent')}
                />
                <span>
                  I certify that I am at least <strong className="text-white">18 years of age</strong> (or age of majority in my jurisdiction).
                </span>
              </label>
              {errors.ageConsent && (
                <p className="text-xs text-rose-400 pl-6">{errors.ageConsent.message}</p>
              )}

              <label className="flex items-start gap-2 cursor-pointer text-xs text-zinc-300">
                <input
                  type="checkbox"
                  className="rounded bg-zinc-900 border-zinc-700 text-purple-600 focus:ring-purple-500 w-4 h-4 mt-0.5"
                  {...register('termsConsent')}
                />
                <span>
                  I agree to the{' '}
                  <Link href="/terms" className="text-purple-400 hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-purple-400 hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
              {errors.termsConsent && (
                <p className="text-xs text-rose-400 pl-6">{errors.termsConsent.message}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isSubmitting}
            >
              Create Account <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          <div className="pt-4 border-t border-zinc-800/80 text-center text-xs text-zinc-400">
            Already have an account?{' '}
            <Link href="/login" className="text-purple-400 hover:underline font-semibold">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
