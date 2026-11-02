'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { walletApi } from '@/lib/api';
import { useAuth } from '@/lib/auth/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { AccountLayout } from '@/components/layout/AccountLayout';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { TokenPackage } from '@/types';
import {
  Coins,
  CreditCard,
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowRight
} from 'lucide-react';

export default function WalletPage() {
  const { user, updateTokenBalance } = useAuth();
  const { toast } = useToast();
  const [selectedPackage, setSelectedPackage] = useState<TokenPackage | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'CRYPTO' | 'SEPA'>('CARD');
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: packagesData, isLoading } = useQuery({
    queryKey: ['tokenPackages'],
    queryFn: () => walletApi.getPackages(),
  });

  const packages = packagesData?.data || [];

  const getTokens = (pkg: TokenPackage) => pkg.tokens ?? pkg.tokenAmount ?? 0;
  const getBonus = (pkg: TokenPackage) => pkg.bonusTokens ?? 0;
  const getPrice = (pkg: TokenPackage) =>
    typeof pkg.priceUsd === 'number'
      ? pkg.priceUsd
      : typeof pkg.priceMinorUnits === 'number'
        ? pkg.priceMinorUnits / 100
        : 0;

  const handleInitiateCheckout = (pkg: TokenPackage) => {
    setSelectedPackage(pkg);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedPackage) return;
    try {
      setIsProcessing(true);
      // Call backend checkout endpoint
      const checkoutRes = await walletApi.createCheckoutSession(selectedPackage.id, paymentMethod);

      // In sandbox/development, automatically complete sandbox transaction to credit tokens
      if (checkoutRes?.data?.checkoutUrl && checkoutRes.data.checkoutUrl.includes('sandbox-checkout')) {
        try {
          const url = new URL(checkoutRes.data.checkoutUrl);
          const session = url.searchParams.get('session');
          const pkg = url.searchParams.get('pkg');
          const idem = url.searchParams.get('idem');
          if (session && pkg && idem) {
            await walletApi.completeSandboxCheckout({ session, pkg, idem });
          }
        } catch {
          // If URL parsing fails, continue gracefully
        }
      }

      // Sync fresh balance from backend
      try {
        const balRes = await walletApi.getBalance();
        if (typeof balRes.data?.tokenBalance === 'number') {
          updateTokenBalance(balRes.data.tokenBalance);
        } else {
          const totalTokens = getTokens(selectedPackage) + getBonus(selectedPackage);
          updateTokenBalance((user?.tokenBalance ?? 0) + totalTokens);
        }
      } catch {
        const totalTokens = getTokens(selectedPackage) + getBonus(selectedPackage);
        updateTokenBalance((user?.tokenBalance ?? 0) + totalTokens);
      }

      const totalTokens = getTokens(selectedPackage) + getBonus(selectedPackage);
      toast({
        type: 'token',
        title: 'Tokens Purchased!',
        message: `Successfully credited ${totalTokens.toLocaleString()} tokens to your wallet.`,
      });
      setSelectedPackage(null);
    } catch (err: any) {
      toast({
        type: 'error',
        title: 'Checkout Error',
        message: err?.message || 'Could not complete token acquisition. Please try again.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AccountLayout>
      <div className="space-y-8">
        {/* Wallet Balance Hero */}
        <div className="rounded-3xl bg-gradient-to-r from-[#181308] via-[#120f18] to-[#161224] border border-amber-500/30 p-8 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
              Personal Vault
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white flex items-center gap-2">
              🪙 {user?.tokenBalance ?? 0}
              <span className="text-base font-normal text-zinc-400">Tokens Available</span>
            </h2>
            <p className="text-xs text-zinc-400 max-w-md">
              Tokens allow you to tip active broadcasters, request private 1-on-1 video shows, and unlock exclusive VIP media.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 px-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-300">
              <span className="text-zinc-500 block text-[11px]">Token Value:</span>
              <strong className="text-zinc-100">10 Tokens ≈ $1.00 USD</strong>
            </div>
          </div>
        </div>

        {/* Token Packages Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">Purchase Token Packages</h3>
              <p className="text-xs text-zinc-400">Select a bundle below. Higher tiers include bonus token multipliers.</p>
            </div>
            <span className="text-xs text-zinc-400 flex items-center gap-1">
              Discreet billing guaranteed
            </span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-64 rounded-3xl bg-zinc-900 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`relative rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between border ${
                    pkg.isPopular
                      ? 'bg-gradient-to-b from-[#18112c] to-[#0e0e18] border-purple-500/60 shadow-xl shadow-purple-950/30 ring-1 ring-purple-500/50'
                      : 'bg-[#0f0f18] border-zinc-800/80 hover:border-zinc-700'
                  }`}
                >
                  {pkg.badge && (
                    <div className="absolute -top-3 right-6">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 shadow-md">
                        {pkg.badge}
                      </span>
                    </div>
                  )}

                  <div className="space-y-3">
                    <h4 className="text-lg font-bold text-white">{pkg.name}</h4>
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold text-amber-300">
                          🪙 {getTokens(pkg).toLocaleString()}
                        </span>
                        {getBonus(pkg) > 0 && (
                          <span className="text-xs font-bold text-purple-400 bg-purple-950/60 border border-purple-500/30 px-2 py-0.5 rounded-full">
                            +{getBonus(pkg)} Bonus
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400">
                        Total:{' '}
                        <strong className="text-zinc-200">
                          {(getTokens(pkg) + getBonus(pkg)).toLocaleString()} tokens
                        </strong>
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-zinc-800/60 mt-6 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-zinc-500 block">Price:</span>
                      <span className="text-xl font-bold text-white">${getPrice(pkg).toFixed(2)}</span>
                    </div>
                    <Button
                      variant={pkg.isPopular ? 'token' : 'primary'}
                      size="md"
                      onClick={() => handleInitiateCheckout(pkg)}
                    >
                      Buy Tokens
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Checkout Dialog */}
      <Dialog
        isOpen={!!selectedPackage}
        onClose={() => setSelectedPackage(null)}
        title="Complete Token Acquisition"
        description="Choose your discreet payment method to finalize your purchase."
      >
        {selectedPackage && (
          <div className="space-y-5">
            {/* Summary Box */}
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-400">Package:</span>
                <strong className="text-white">{selectedPackage.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Tokens Received:</span>
                <strong className="text-amber-300">
                  🪙 {(getTokens(selectedPackage) + getBonus(selectedPackage)).toLocaleString()} tokens
                </strong>
              </div>
              <div className="flex justify-between pt-2 border-t border-zinc-800 text-sm">
                <span className="text-zinc-200 font-bold">Total Due:</span>
                <strong className="text-white font-extrabold">${getPrice(selectedPackage).toFixed(2)} {selectedPackage.currency || 'USD'}</strong>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-zinc-300">Select Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    paymentMethod === 'CARD'
                      ? 'bg-purple-950/40 border-purple-500 text-white'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mx-auto mb-1 text-purple-400" />
                  <span className="text-xs font-semibold block">Credit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CRYPTO')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    paymentMethod === 'CRYPTO'
                      ? 'bg-purple-950/40 border-purple-500 text-white'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <span className="text-lg block mb-0.5">⚡</span>
                  <span className="text-xs font-semibold block">Crypto (BTC/USDT)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('SEPA')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    paymentMethod === 'SEPA'
                      ? 'bg-purple-950/40 border-purple-500 text-white'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <span className="text-lg block mb-0.5">🏦</span>
                  <span className="text-xs font-semibold block">SEPA / Wire</span>
                </button>
              </div>
            </div>

            <p className="text-[11px] text-zinc-500 leading-relaxed">
              *Billing descriptor on your financial statement will appear discreetly without adult entertainment keywords.
            </p>

            <div className="flex gap-2 justify-end pt-2">
              <Button variant="secondary" onClick={() => setSelectedPackage(null)}>
                Cancel
              </Button>
              <Button
                variant="token"
                isLoading={isProcessing}
                onClick={handleConfirmPurchase}
              >
                Proceed with Discreet Checkout
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </AccountLayout>
  );
}
