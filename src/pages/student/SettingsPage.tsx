import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import { useToast } from '@/hooks/useToast';

export default function SettingsPage() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'account' | 'notifications' | 'appearance' | 'security'>('account');

  // Local settings state
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [academicRiskAlerts, setAcademicRiskAlerts] = useState(true);
  const [compactLayout, setCompactLayout] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  const handleSaveSettings = () => {
    addToast('✓ Settings updated successfully!', 'success');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-8 font-body max-w-4xl"
    >
      <PageHeader
        title="Student Workspace Settings"
        description="Configure preferences, notification channels, security, and interface layout."
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* SIDEBAR TABS */}
        <Card className="p-3 bg-white border border-ink-150 shadow-card space-y-1 h-fit">
          {[
            { id: 'account', label: 'Account', icon: 'user' },
            { id: 'notifications', label: 'Notifications', icon: 'bell' },
            { id: 'appearance', label: 'Appearance', icon: 'sparkles' },
            { id: 'security', label: 'Security', icon: 'settings' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
                activeTab === tab.id
                  ? 'bg-ink-950 text-white shadow-xs'
                  : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'
              }`}
            >
              <Icon name={tab.icon as any} size={15} />
              <span>{tab.label}</span>
            </button>
          ))}
        </Card>

        {/* MAIN SETTINGS PANEL */}
        <Card className="p-6 md:p-8 bg-white border border-ink-150 shadow-card md:col-span-3 space-y-6">
          {activeTab === 'account' && (
            <div className="space-y-6 text-xs">
              <div className="border-b border-ink-150 pb-3">
                <h3 className="font-display font-bold text-base text-ink-950">Account Preferences</h3>
                <p className="text-ink-500">Manage your language, timezone, and primary contact preferences.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="font-medium text-ink-700 block mb-1">Language</label>
                  <select className="w-full border border-ink-200 rounded-xl px-3 py-2 text-xs font-medium bg-white">
                    <option>English (United States)</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium text-ink-700 block mb-1">Timezone</label>
                  <select className="w-full border border-ink-200 rounded-xl px-3 py-2 text-xs font-medium bg-white">
                    <option>(UTC+05:30) India Standard Time</option>
                    <option>(UTC-05:00) Eastern Time (US & Canada)</option>
                    <option>(UTC+00:00) Greenwich Mean Time</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6 text-xs">
              <div className="border-b border-ink-150 pb-3">
                <h3 className="font-display font-bold text-base text-ink-950">Notification Channels</h3>
                <p className="text-ink-500">Choose when and how EduIQ alerts you about grades and attendance.</p>
              </div>

              <div className="space-y-4">
                <label className="flex items-center justify-between p-3 rounded-xl bg-ink-50 border border-ink-150 cursor-pointer">
                  <div>
                    <span className="font-semibold text-ink-900 block">Email Digest & Alerts</span>
                    <span className="text-[11px] text-ink-500">Receive weekly academic progress summary emails</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="accent-cobalt-600 w-4 h-4"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-ink-50 border border-ink-150 cursor-pointer">
                  <div>
                    <span className="font-semibold text-ink-900 block">✦ AI Risk & Threshold Warnings</span>
                    <span className="text-[11px] text-ink-500 font-medium text-amber-700">Immediate alert if attendance drops below 75%</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={academicRiskAlerts}
                    onChange={(e) => setAcademicRiskAlerts(e.target.checked)}
                    className="accent-cobalt-600 w-4 h-4"
                  />
                </label>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6 text-xs">
              <div className="border-b border-ink-150 pb-3">
                <h3 className="font-display font-bold text-base text-ink-950">Interface & Layout</h3>
                <p className="text-ink-500">Customize visual density and chart rendering preferences.</p>
              </div>

              <div className="space-y-4">
                <label className="flex items-center justify-between p-3 rounded-xl bg-ink-50 border border-ink-150 cursor-pointer">
                  <div>
                    <span className="font-semibold text-ink-900 block">Compact Layout Density</span>
                    <span className="text-[11px] text-ink-500">Reduce card padding for high data density</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={compactLayout}
                    onChange={(e) => setCompactLayout(e.target.checked)}
                    className="accent-cobalt-600 w-4 h-4"
                  />
                </label>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6 text-xs">
              <div className="border-b border-ink-150 pb-3">
                <h3 className="font-display font-bold text-base text-ink-950">Security & Authentication</h3>
                <p className="text-ink-500">Manage account credentials and two-factor verification.</p>
              </div>

              <div className="space-y-4">
                <label className="flex items-center justify-between p-3 rounded-xl bg-ink-50 border border-ink-150 cursor-pointer">
                  <div>
                    <span className="font-semibold text-ink-900 block">Two-Factor Authentication (2FA)</span>
                    <span className="text-[11px] text-ink-500">Require authenticator app code on login</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={twoFactor}
                    onChange={(e) => setTwoFactor(e.target.checked)}
                    className="accent-cobalt-600 w-4 h-4"
                  />
                </label>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end pt-4 border-t border-ink-150">
            <Button variant="accent" onClick={handleSaveSettings}>
              Save Settings &rarr;
            </Button>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
