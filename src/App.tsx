/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SubmissionForm } from './components/SubmissionForm';
import { DatasetInspector } from './components/DatasetInspector';
import { RiskMethodology } from './components/RiskMethodology';
import { WorkflowArchitecture } from './components/WorkflowArchitecture';
import { SubmissionHistory } from './components/SubmissionHistory';
import { SubmissionSuccessModal } from './components/SubmissionSuccessModal';
import { N8nStatusInfo, SubmissionRecord } from './types';
import { ExternalLink, ShieldCheck, ArrowRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('assessment');
  const [statusInfo, setStatusInfo] = useState<N8nStatusInfo | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [currentSuccessRecord, setCurrentSuccessRecord] = useState<SubmissionRecord | null>(null);

  // Fetch n8n webhook health status
  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/n8n-status');
      if (res.ok) {
        const data = await res.json();
        setStatusInfo(data);
      } else {
        setStatusInfo({
          status: 'error',
          endpointUrl: 'https://pranathi2007.app.n8n.cloud/form/18bf7cf1-7ab5-4158-91c7-737b7c8313a2',
          formTitle: 'Institutional KPI & Risk Analysis System',
          verified: false,
          lastChecked: new Date().toISOString(),
        });
      }
    } catch {
      setStatusInfo({
        status: 'error',
        endpointUrl: 'https://pranathi2007.app.n8n.cloud/form/18bf7cf1-7ab5-4158-91c7-737b7c8313a2',
        formTitle: 'Institutional KPI & Risk Analysis System',
        verified: false,
        lastChecked: new Date().toISOString(),
      });
    }
  };

  // Load submissions from localStorage on mount
  useEffect(() => {
    fetchStatus();
    try {
      const stored = localStorage.getItem('kpi_audit_submissions');
      if (stored) {
        setSubmissions(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse stored submissions', e);
    }
  }, []);

  const handleSubmissionSuccess = (record: SubmissionRecord) => {
    setSubmissions((prev) => [record, ...prev]);
    setCurrentSuccessRecord(record);
  };

  const handleClearHistory = () => {
    localStorage.removeItem('kpi_audit_submissions');
    setSubmissions([]);
  };

  const handleApplyDatasetToForm = (_file: File, _scenarioName: string) => {
    // Switch to assessment tab so user can submit it
    setActiveTab('assessment');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-slate-900 selection:text-white">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        statusInfo={statusInfo}
        onRefreshStatus={fetchStatus}
        submissionCount={submissions.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'assessment' && (
          <SubmissionForm
            onSubmissionSuccess={handleSubmissionSuccess}
            onNavigateToInspector={() => setActiveTab('inspector')}
          />
        )}

        {activeTab === 'inspector' && (
          <DatasetInspector onApplyDatasetToForm={handleApplyDatasetToForm} />
        )}

        {activeTab === 'methodology' && <RiskMethodology />}

        {activeTab === 'architecture' && (
          <WorkflowArchitecture
            statusInfo={statusInfo}
            onRefreshStatus={fetchStatus}
          />
        )}

        {activeTab === 'history' && (
          <SubmissionHistory
            records={submissions}
            onClearHistory={handleClearHistory}
            onSelectRecord={(r) => setCurrentSuccessRecord(r)}
            onNavigateToForm={() => setActiveTab('assessment')}
          />
        )}
      </main>

      {/* Success Confirmation Modal */}
      <SubmissionSuccessModal
        record={currentSuccessRecord}
        onClose={() => setCurrentSuccessRecord(null)}
        onResetForm={() => setCurrentSuccessRecord(null)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-slate-700">
              Institutional KPI &amp; Risk Analysis System
            </span>
            <span aria-hidden="true">·</span>
            <span>n8n Workflow Integration</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-mono text-slate-400">Endpoint: 18bf7cf1-...</span>
            <a
              href="https://pranathi2007.app.n8n.cloud/form/18bf7cf1-7ab5-4158-91c7-737b7c8313a2"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <span>View n8n Cloud Source Form</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
