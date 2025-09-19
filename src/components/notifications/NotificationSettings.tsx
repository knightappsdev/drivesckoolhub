'use client';

import { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import { BellIcon, EnvelopeIcon, DevicePhoneMobileIcon, ClockIcon } from '@heroicons/react/24/outline';

interface NotificationSettings {
  email_enabled: boolean;
  sms_enabled: boolean;
  push_enabled: boolean;
  reminder_24h: boolean;
  reminder_4h: boolean;
  reminder_1h: boolean;
  reminder_15m: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
  timezone: string;
  custom_preferences: Record<string, any>;
}

export default function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettings>({
    email_enabled: true,
    sms_enabled: false,
    push_enabled: true,
    reminder_24h: true,
    reminder_4h: false,
    reminder_1h: true,
    reminder_15m: false,
    quiet_hours_start: '22:00',
    quiet_hours_end: '08:00',
    timezone: 'UTC',
    custom_preferences: {}
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch current settings
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/notifications/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings({
          ...data,
          quiet_hours_start: data.quiet_hours_start?.slice(0, 5) || '22:00',
          quiet_hours_end: data.quiet_hours_end?.slice(0, 5) || '08:00'
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      setMessage({ type: 'error', text: 'Failed to load notification settings' });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/notifications/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...settings,
          quiet_hours_start: settings.quiet_hours_start + ':00',
          quiet_hours_end: settings.quiet_hours_end + ':00'
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: keyof NotificationSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateCustomPreference = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      custom_preferences: {
        ...prev.custom_preferences,
        [key]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Notification Channels */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BellIcon className="h-5 w-5 mr-2" />
          Notification Channels
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <label className="text-sm font-medium text-gray-900">Email Notifications</label>
                <p className="text-sm text-gray-500">Receive notifications via email</p>
              </div>
            </div>
            <Switch
              checked={settings.email_enabled}
              onChange={(checked) => updateSetting('email_enabled', checked)}
              className={`${
                settings.email_enabled ? 'bg-blue-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              <span
                className={`${
                  settings.email_enabled ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DevicePhoneMobileIcon className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <label className="text-sm font-medium text-gray-900">SMS Notifications</label>
                <p className="text-sm text-gray-500">Receive notifications via text message</p>
              </div>
            </div>
            <Switch
              checked={settings.sms_enabled}
              onChange={(checked) => updateSetting('sms_enabled', checked)}
              className={`${
                settings.sms_enabled ? 'bg-blue-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              <span
                className={`${
                  settings.sms_enabled ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BellIcon className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <label className="text-sm font-medium text-gray-900">Push Notifications</label>
                <p className="text-sm text-gray-500">Receive browser push notifications</p>
              </div>
            </div>
            <Switch
              checked={settings.push_enabled}
              onChange={(checked) => updateSetting('push_enabled', checked)}
              className={`${
                settings.push_enabled ? 'bg-blue-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              <span
                className={`${
                  settings.push_enabled ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>
        </div>
      </div>

      {/* Reminder Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ClockIcon className="h-5 w-5 mr-2" />
          Lesson Reminders
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">24 Hours Before</label>
              <p className="text-sm text-gray-500">Get reminded 1 day before your lesson</p>
            </div>
            <Switch
              checked={settings.reminder_24h}
              onChange={(checked) => updateSetting('reminder_24h', checked)}
              className={`${
                settings.reminder_24h ? 'bg-blue-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              <span
                className={`${
                  settings.reminder_24h ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">4 Hours Before</label>
              <p className="text-sm text-gray-500">Get reminded 4 hours before your lesson</p>
            </div>
            <Switch
              checked={settings.reminder_4h}
              onChange={(checked) => updateSetting('reminder_4h', checked)}
              className={`${
                settings.reminder_4h ? 'bg-blue-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              <span
                className={`${
                  settings.reminder_4h ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">1 Hour Before</label>
              <p className="text-sm text-gray-500">Get reminded 1 hour before your lesson</p>
            </div>
            <Switch
              checked={settings.reminder_1h}
              onChange={(checked) => updateSetting('reminder_1h', checked)}
              className={`${
                settings.reminder_1h ? 'bg-blue-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              <span
                className={`${
                  settings.reminder_1h ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">15 Minutes Before</label>
              <p className="text-sm text-gray-500">Get reminded 15 minutes before your lesson</p>
            </div>
            <Switch
              checked={settings.reminder_15m}
              onChange={(checked) => updateSetting('reminder_15m', checked)}
              className={`${
                settings.reminder_15m ? 'bg-blue-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              <span
                className={`${
                  settings.reminder_15m ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>
        </div>
      </div>

      {/* Quiet Hours */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiet Hours</h3>
        <p className="text-sm text-gray-600 mb-4">
          Set quiet hours when you don't want to receive notifications
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Time
            </label>
            <input
              type="time"
              value={settings.quiet_hours_start}
              onChange={(e) => updateSetting('quiet_hours_start', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Time
            </label>
            <input
              type="time"
              value={settings.quiet_hours_end}
              onChange={(e) => updateSetting('quiet_hours_end', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Additional Preferences */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Preferences</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">Marketing Emails</label>
              <p className="text-sm text-gray-500">Receive promotional emails and updates</p>
            </div>
            <Switch
              checked={settings.custom_preferences.marketing_emails || false}
              onChange={(checked) => updateCustomPreference('marketing_emails', checked)}
              className={`${
                settings.custom_preferences.marketing_emails ? 'bg-blue-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              <span
                className={`${
                  settings.custom_preferences.marketing_emails ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">Lesson Tips</label>
              <p className="text-sm text-gray-500">Receive driving tips and educational content</p>
            </div>
            <Switch
              checked={settings.custom_preferences.lesson_tips || false}
              onChange={(checked) => updateCustomPreference('lesson_tips', checked)}
              className={`${
                settings.custom_preferences.lesson_tips ? 'bg-blue-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              <span
                className={`${
                  settings.custom_preferences.lesson_tips ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={saveSettings}
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}