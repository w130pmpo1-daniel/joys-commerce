import { useEffect, useState } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

export default function Settings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await api.get('/settings');
      setSettings(res.data);
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveSetting = async (key: string, value: string) => {
    setSaving(true);
    setMessage('');
    try {
      await api.put(`/settings/${key}`, value);
      setSettings({ ...settings, [key]: value });
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-prodex-text">Settings</h1>
        <p className="text-prodex-muted">Configure your store settings</p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.includes('Failed') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-xl border border-prodex-border shadow-sm p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-prodex-text mb-4">General Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-prodex-text mb-1">Site Name</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={settings.site_name || ''}
                  onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                  className="flex-1 px-4 py-2 border border-prodex-border rounded-lg focus:outline-none focus:ring-2 focus:ring-prodex-primary"
                  placeholder="Enter site name"
                />
                <button
                  onClick={() => saveSetting('site_name', settings.site_name || '')}
                  disabled={saving}
                  className="px-4 py-2 bg-prodex-primary text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-prodex-text mb-1">Site Description</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={settings.site_description || ''}
                  onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                  className="flex-1 px-4 py-2 border border-prodex-border rounded-lg focus:outline-none focus:ring-2 focus:ring-prodex-primary"
                  placeholder="Enter site description"
                />
                <button
                  onClick={() => saveSetting('site_description', settings.site_description || '')}
                  disabled={saving}
                  className="px-4 py-2 bg-prodex-primary text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
