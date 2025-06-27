import React, { useState } from 'react';
import { Bell, CheckCircle2, AlertTriangle, Mail, Shield, Zap } from 'lucide-react';

const SUBSCRIPTION_TIERS = {
  free: {
    name: 'Basic Protection',
    price: 'Free',
    features: [
      'Basic scam alerts',
      'Weekly security tips',
      'Monthly threat digest'
    ]
  },
  pro: {
    name: 'Pro Protection',
    price: '$4.99/month',
    priceId: 'price_1RWivq2NEeVQpgvMdSpN2oET',
    features: [
      'Real-time scam alerts',
      'Daily security tips',
      'Weekly threat digest',
      'Priority threat notifications',
      'Custom alert preferences'
    ]
  },
  enterprise: {
    name: 'Enterprise Shield',
    price: '$9.99/month',
    priceId: 'price_1RWiwD2NEeVQpgvMxRCdG0xx',
    features: [
      'Instant scam alerts',
      'Daily security briefings',
      'Real-time threat monitoring',
      'Custom alert rules',
      'Dedicated security advisor',
      'API access'
    ]
  }
};

const EmailNotifications = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [selectedTier, setSelectedTier] = useState<'free' | 'pro' | 'enterprise'>('free');
  const [preferences, setPreferences] = useState({
    scam_alerts: true,
    security_tips: true,
    weekly_digest: true
  });

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setStatus('error');
      setMessage('Please enter your email address');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      // For free tier, store locally
      if (selectedTier === 'free') {
        const subscription = {
          email,
          preferences,
          tier: selectedTier,
          subscribed_at: new Date().toISOString()
        };

        // Store in localStorage
        const existingSubscriptions = JSON.parse(localStorage.getItem('email_subscriptions') || '[]');
        const updatedSubscriptions = existingSubscriptions.filter((sub: any) => sub.email !== email);
        updatedSubscriptions.push(subscription);
        localStorage.setItem('email_subscriptions', JSON.stringify(updatedSubscriptions));

        setStatus('success');
        setMessage('Successfully subscribed! You will receive security alerts and tips via email.');
        setEmail('');
        return;
      }

      // For paid tiers, show payment info (demo mode)
      setStatus('success');
      setMessage(`Thank you for choosing ${SUBSCRIPTION_TIERS[selectedTier].name}! In a production environment, you would be redirected to payment processing. Your subscription preferences have been saved locally.`);
      
      // Store subscription locally for demo
      const subscription = {
        email,
        preferences,
        tier: selectedTier,
        subscribed_at: new Date().toISOString(),
        payment_status: 'demo_mode'
      };

      const existingSubscriptions = JSON.parse(localStorage.getItem('email_subscriptions') || '[]');
      const updatedSubscriptions = existingSubscriptions.filter((sub: any) => sub.email !== email);
      updatedSubscriptions.push(subscription);
      localStorage.setItem('email_subscriptions', JSON.stringify(updatedSubscriptions));
      
      setEmail('');
    } catch (err) {
      console.error('Subscription error:', err);
      setStatus('error');
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-8">
      <div className="flex items-center gap-4 mb-8">
        <Bell className="w-8 h-8 text-blue-400" />
        <h2 className="text-2xl font-bold">Stay Protected with Email Alerts</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Benefits */}
        <div className="lg:col-span-1">
          <h3 className="text-xl font-semibold mb-4">Why Subscribe?</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
              <span>Real-time alerts about new scams and threats</span>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
              <span>Weekly security tips and best practices</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
              <span>Curated digest of latest cybersecurity news</span>
            </li>
          </ul>
        </div>

        {/* Subscription Tiers */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {Object.entries(SUBSCRIPTION_TIERS).map(([key, tier]) => (
              <button
                key={key}
                onClick={() => setSelectedTier(key as 'free' | 'pro' | 'enterprise')}
                className={`p-6 rounded-xl border transition-all ${
                  selectedTier === key
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {key === 'free' && <Shield className="w-5 h-5 text-blue-400" />}
                  {key === 'pro' && <Zap className="w-5 h-5 text-yellow-400" />}
                  {key === 'enterprise' && <Shield className="w-5 h-5 text-purple-400" />}
                  <h3 className="font-semibold">{tier.name}</h3>
                </div>
                <div className="text-2xl font-bold mb-4">{tier.price}</div>
                <ul className="text-sm text-gray-400 space-y-2">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubscribe} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
                placeholder="your@email.com"
                required
                disabled={status === 'loading'}
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium mb-2">Alert Preferences</label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={preferences.scam_alerts}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    scam_alerts: e.target.checked
                  }))}
                  className="rounded border-gray-700 bg-gray-900 text-blue-500"
                  disabled={status === 'loading'}
                />
                <span>New Scam Alerts</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={preferences.security_tips}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    security_tips: e.target.checked
                  }))}
                  className="rounded border-gray-700 bg-gray-900 text-blue-500"
                  disabled={status === 'loading'}
                />
                <span>Security Tips</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={preferences.weekly_digest}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    weekly_digest: e.target.checked
                  }))}
                  className="rounded border-gray-700 bg-gray-900 text-blue-500"
                  disabled={status === 'loading'}
                />
                <span>Weekly Digest</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className={`w-full px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                status === 'loading'
                  ? 'bg-gray-700 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {status === 'loading' ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  <span>Subscribing...</span>
                </>
              ) : (
                <>
                  <Bell className="w-5 h-5" />
                  <span>Subscribe to Alerts</span>
                </>
              )}
            </button>

            {(status === 'error' || status === 'success') && (
              <div className={`p-4 rounded-lg flex items-center gap-2 ${
                status === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {status === 'success' ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
                <span>{message}</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmailNotifications;