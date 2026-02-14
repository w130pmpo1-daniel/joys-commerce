export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-prodex-text">Settings</h1>
        <p className="text-prodex-muted">Configure your store settings</p>
      </div>

      <div className="bg-white rounded-xl border border-prodex-border shadow-sm p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-prodex-text mb-4">General Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-prodex-text mb-1">Store Name</label>
              <input type="text" defaultValue="Prodex Store" className="w-full px-4 py-2 border border-prodex-border rounded-lg focus:outline-none focus:ring-2 focus:ring-prodex-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-prodex-text mb-1">Store Email</label>
              <input type="email" defaultValue="admin@prodex.com" className="w-full px-4 py-2 border border-prodex-border rounded-lg focus:outline-none focus:ring-2 focus:ring-prodex-primary" />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-prodex-border">
          <button className="px-4 py-2 bg-prodex-primary text-white rounded-lg hover:bg-blue-600 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
