import { useState } from 'react';
import { Trash2, RefreshCw } from 'lucide-react';
import Layout from '../components/Layout';
import {
  getUsersCookie,
  getCompanyCookie,
  getExpensesCookie,
  getRulesCookie,
  getSessionCookie,
  getPrefsCookie,
  clearAllCookies,
  COOKIE_NAMES,
} from '../utils/cookieStore';
import { seedDemoData, clearDemoData } from '../utils/seedData';
import Cookies from 'js-cookie';

export default function CookieInspector() {
  const [, setRefresh] = useState(0);

  const refresh = () => setRefresh((p) => p + 1);

  const cookieData = {
    Users: getUsersCookie(),
    Company: getCompanyCookie(),
    Expenses: getExpensesCookie(),
    Rules: getRulesCookie(),
    Session: getSessionCookie(),
    Preferences: getPrefsCookie(),
  };

  const allCookies = Cookies.get();
  const rateCookies = Object.keys(allCookies).filter((key) =>
    key.startsWith(COOKIE_NAMES.RATES_PREFIX)
  );

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all cookie data?')) {
      clearAllCookies();
      refresh();
    }
  };

  const handleSeedDemo = () => {
    seedDemoData();
    refresh();
    alert('Demo data seeded! Check console for login credentials.');
  };

  const handleClearDemo = () => {
    clearDemoData();
    refresh();
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cookie Inspector</h1>
            <p className="text-gray-600 mt-1">
              Debug and manage application cookies
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={refresh}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={handleSeedDemo}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Seed Demo Data
            </button>
            <button
              onClick={handleClearDemo}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
            >
              Clear Demo Data
            </button>
            <button
              onClick={handleClearAll}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear All Cookies
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(cookieData).map(([name, data]) => (
            <div key={name} className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{name}</h3>
              <div className="bg-gray-50 rounded-lg p-4 overflow-auto max-h-96">
                <pre className="text-xs text-gray-800">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
              <div className="mt-3 text-sm text-gray-600">
                {Array.isArray(data)
                  ? `${data.length} items`
                  : data
                  ? '1 item'
                  : 'Empty'}
              </div>
            </div>
          ))}
        </div>

        {rateCookies.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Exchange Rate Caches
            </h3>
            <div className="space-y-2">
              {rateCookies.map((key) => {
                const currency = key.replace(COOKIE_NAMES.RATES_PREFIX, '');
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm font-medium text-gray-900">{currency}</span>
                    <span className="text-xs text-gray-600">Cached</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Developer Notes
          </h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>All data is stored in browser cookies with 30-day expiry</li>
            <li>
              Cookie names are prefixed with <code>expapp_</code> and versioned
            </li>
            <li>Exchange rates are cached for 12 hours per currency</li>
            <li>Passwords are stored in plain text (prototype only)</li>
            <li>
              <strong>Production:</strong> Replace with server-side storage and HttpOnly
              cookies
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
