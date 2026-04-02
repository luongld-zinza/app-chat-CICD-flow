'use client';

import { useState, useEffect } from 'react';

interface HealthData {
  status: string;
  message: string;
  data: {
    time: string;
    author: string;
  };
}

export default function HealthPage() {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/health');
      if (!response.ok) {
        throw new Error('Không thể kết nối tới server API');
      }
      const data = await response.json();
      setHealthData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <main className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 via-slate-950 to-black">
      <div className="w-full max-w-lg">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden group">
          {/* Decorative gradient overlay */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 blur-[100px] rounded-full group-hover:bg-blue-500/30 transition-all duration-700"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/20 blur-[100px] rounded-full group-hover:bg-purple-500/30 transition-all duration-700"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Server Health
              </h1>
              <div className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${
                healthData?.status === 'ok' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {loading ? 'đang kiểm tra...' : (healthData?.status || 'lỗi')}
              </div>
            </div>

            <div className="space-y-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                  <p className="text-slate-400 animate-pulse">Đang lấy dữ liệu từ server...</p>
                </div>
              ) : error ? (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                  <p className="text-red-400 mb-2">Oops! Có lỗi rồi</p>
                  <p className="text-sm text-slate-400">{error}</p>
                </div>
              ) : healthData && (
                <div className="space-y-4">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
                    <label className="text-xs text-slate-400 uppercase tracking-widest block mb-1">Message</label>
                    <p className="text-lg font-medium text-slate-200">{healthData.message}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
                      <label className="text-xs text-slate-400 uppercase tracking-widest block mb-1">Author</label>
                      <p className="font-semibold text-blue-400">{healthData.data.author}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
                      <label className="text-xs text-slate-400 uppercase tracking-widest block mb-1">Status</label>
                      <p className="font-semibold text-emerald-400">{healthData.status.toUpperCase()}</p>
                    </div>
                  </div>

                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
                    <label className="text-xs text-slate-400 uppercase tracking-widest block mb-1">Server Time</label>
                    <p className="font-mono text-sm text-slate-300">
                      {new Date(healthData.data.time).toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={fetchHealth}
              disabled={loading}
              className="w-full mt-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 active:translate-y-0"
            >
              {loading ? 'Đang cập nhật...' : 'Refresh Status'}
            </button>
          </div>
        </div>

        <p className="text-center mt-8 text-slate-500 text-sm">
          Powered by Next.js & NestJS
        </p>
      </div>
    </main>
  );
}
