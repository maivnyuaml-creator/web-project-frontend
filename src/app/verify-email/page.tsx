'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { authApi } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { MailCheck, RefreshCw, ArrowRight } from 'lucide-react';

export default function VerifyEmailPage() {
  const { toast } = useToast();
  const [isResending, setIsResending] = useState(false);
  const [hasResent, setHasResent] = useState(false);

  const handleResend = async () => {
    try {
      setIsResending(true);
      await authApi.resendVerification();
      setHasResent(true);
      toast({
        type: 'success',
        title: 'Verification Link Sent',
        message: 'A fresh verification email has been dispatched to your inbox.',
      });
    } catch {
      toast({
        type: 'error',
        title: 'Resend Failed',
        message: 'Could not send verification email. Please try again in a few minutes.',
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-[#0f0f18] border border-zinc-800 p-8 shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-purple-950/60 border border-purple-500/40 flex items-center justify-center mx-auto text-purple-400">
          <MailCheck className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white">Check your email</h1>
          <p className="text-xs text-zinc-300 leading-relaxed max-w-sm mx-auto">
            We sent a verification link to your email address. Please click the link to activate full account privileges, token purchasing, and chat access.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400">
          Didn&apos;t receive the email? Check your spam folder or request a new one below.
        </div>

        <div className="space-y-3">
          <Button
            variant="secondary"
            className="w-full"
            isLoading={isResending}
            onClick={handleResend}
            disabled={hasResent}
          >
            <RefreshCw className="w-4 h-4 mr-1.5" />
            {hasResent ? 'Verification Link Sent!' : 'Resend Verification Email'}
          </Button>

          <Link href="/" className="block">
            <Button variant="ghost" size="sm" className="w-full text-zinc-400 hover:text-white">
              Continue to Homepage <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
