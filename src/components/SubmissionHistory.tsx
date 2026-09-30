import React, { useState } from 'react';
import {
  FileText,
  Search,
  Trash2,
  Download,
  Mail,
  Building,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { SubmissionRecord } from '../types';

interface SubmissionHistoryProps {
  records: SubmissionRecord[];
  onClearHistory: () => void;
  onSelectRecord: (record: SubmissionRecord) => void;
  onNavigateToForm: () => void;
}

export const SubmissionHistory: React.FC<SubmissionHistoryProps> = ({
  records,
  onClearHistory,
  onSelectRecord,
  onNavigateToForm,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = records.filter(
    (r) =>
      r.institutionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.institutionEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.referenceId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            <span>Audit Trail &amp; Verification</span>
            <span aria-hidden="true">·</span>
            <span>Local Activity Log</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Assessment Submission History
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Review past assessments dispatched to the n8n AI early-warning workflow.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {records.length > 0 && (
            <button
              onClick={onClearHistory}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}

          <button
            onClick={onNavigateToForm}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer"
          >
            <span>New Assessment</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {records.length > 0 && (
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search by Institution, Email, or Reference ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent placeholder:text-slate-400"
          />
        </div>
      )}

      {/* Records Table or Empty State */}
      {records.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">No Assessment Submissions Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
            Submissions made through the portal will be recorded here with audit reference IDs and timestamps.
          </p>
          <button
            onClick={onNavigateToForm}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer"
          >
            <span>Go to Assessment Form</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-xs text-slate-500">
          No submissions matching "{searchTerm}".
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                  <th className="py-3 px-4 font-semibold">Reference ID</th>
                  <th className="py-3 px-4 font-semibold">Institution</th>
                  <th className="py-3 px-4 font-semibold">Recipient Email</th>
                  <th className="py-3 px-4 font-semibold">Dataset File</th>
                  <th className="py-3 px-4 font-semibold">Timestamp</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {r.referenceId}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900 whitespace-nowrap">
                      {r.institutionName}
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap font-mono">
                      {r.institutionEmail}
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {r.fileName}
                      <span className="text-slate-400 block text-[11px]">
                        {(r.fileSize / 1024).toFixed(1)} KB
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(r.submittedAt).toLocaleDateString()} {new Date(r.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Dispatched
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => onSelectRecord(r)}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
                      >
                        View Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
