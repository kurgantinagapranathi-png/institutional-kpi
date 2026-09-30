import React from 'react';
import { ExternalLink, RefreshCw, Layers } from 'lucide-react';
import { N8nStatusInfo } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  statusInfo: N8nStatusInfo | null;
  onRefreshStatus: () => void;
  submissionCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  statusInfo,
  onRefreshStatus,
  submissionCount,
}) => {
  const isOnline = statusInfo?.status === 'connected';

  const navItems = [
    { id: 'assessment', label: 'Submit Assessment' },
    { id: 'inspector', label: 'KPI Dataset Inspector' },
    { id: 'methodology', label: 'Risk Methodology' },
    { id: 'architecture', label: 'Pipeline Architecture' },
    { id: 'history', label: `Submission Audit (${submissionCount})` },
  ];

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-40">
      {/* Top Banner / Institution System Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 border-b border-slate-100">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold tracking-tight shadow-sm">
              <Layers className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 tracking-tight text-base sm:text-lg">
                  Institutional KPI &amp; Risk Analysis System
                </span>
                <span className="hidden md:inline-block text-xs font-medium text-slate-400">·</span>
                <span className="hidden md:inline-block text-xs font-mono text-slate-500 uppercase tracking-wider">
                  n8n AI Workflow
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Automated early-warning prediction &amp; institutional accreditation risk intelligence
              </p>
            </div>
          </div>

          {/* Right Actions: Workflow Live State & External n8n Link */}
          <div className="flex items-center gap-3">
            {/* Live Webhook Status Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              <span className="font-medium text-slate-700 hidden sm:inline">
                {isOnline ? 'n8n Workflow Online' : 'Connecting to n8n...'}
              </span>
              {statusInfo?.latencyMs && (
                <span className="text-slate-400 font-mono hidden md:inline">
                  {statusInfo.latencyMs}ms
                </span>
              )}
              <button
                onClick={onRefreshStatus}
                title="Ping n8n webhook"
                className="p-1 hover:text-slate-900 text-slate-400 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>

            {/* Direct Link to raw n8n Form */}
            <a
              href="https://pranathi2007.app.n8n.cloud/form/18bf7cf1-7ab5-4158-91c7-737b7c8313a2"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 border border-slate-300 hover:bg-slate-50 transition-colors"
              title="Open raw n8n cloud form in a new tab"
            >
              <span>Raw n8n URL</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
