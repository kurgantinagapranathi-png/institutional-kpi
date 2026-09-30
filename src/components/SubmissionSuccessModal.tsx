import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Check,
  Download,
  Mail,
  Building,
  FileSpreadsheet,
  X,
  ExternalLink,
} from 'lucide-react';
import { SubmissionRecord } from '../types';

interface SubmissionSuccessModalProps {
  record: SubmissionRecord | null;
  onClose: () => void;
  onResetForm: () => void;
}

export const SubmissionSuccessModal: React.FC<SubmissionSuccessModalProps> = ({
  record,
  onClose,
  onResetForm,
}) => {
  const [copied, setCopied] = useState(false);

  if (!record) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(record.referenceId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadReceipt = () => {
    const textReceipt = `=====================================================
INSTITUTIONAL KPI & RISK ANALYSIS SYSTEM
ASSESSMENT DISPATCH RECEIPT
=====================================================
Reference ID       : ${record.referenceId}
Submission Status  : Transmitted to n8n AI Risk Engine (Status ${record.n8nStatus})
Timestamp          : ${new Date(record.submittedAt).toLocaleString()}
Institution Name   : ${record.institutionName}
Official Email     : ${record.institutionEmail}
KPI Dataset File   : ${record.fileName} (${(record.fileSize / 1024).toFixed(1)} KB)
Workflow Target    : https://pranathi2007.app.n8n.cloud/form/18bf7cf1-7ab5-4158-91c7-737b7c8313a2

NEXT STEPS:
1. The n8n automated workflow has received and validated your institutional data payload.
2. The AI Risk Prediction model is processing multi-year early warning indicators.
3. The comprehensive executive risk scorecard is dispatched to: ${record.institutionEmail}.
=====================================================`;

    const blob = new Blob([textReceipt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt_${record.referenceId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Assessment Dispatched</h2>
              <p className="text-xs text-slate-300">n8n Workflow Execution Confirmed</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Reference ID Callout */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
            <div>
              <span className="text-xs font-semibold uppercase text-slate-500">Audit Reference Code</span>
              <div className="text-sm font-mono font-bold text-slate-900">{record.referenceId}</div>
            </div>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Details Grid */}
          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/50">
              <Building className="w-4 h-4 text-slate-500 mt-0.5" />
              <div>
                <span className="text-slate-500 block">Institution</span>
                <span className="font-semibold text-slate-900 text-sm">{record.institutionName}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/50">
              <Mail className="w-4 h-4 text-indigo-500 mt-0.5" />
              <div>
                <span className="text-slate-500 block">Report Delivery Address</span>
                <span className="font-semibold text-slate-900">{record.institutionEmail}</span>
                <span className="text-slate-400 block mt-0.5">
                  AI risk early-warning intelligence will be dispatched to this inbox.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/50">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600 mt-0.5" />
              <div>
                <span className="text-slate-500 block">Uploaded KPI Dataset</span>
                <span className="font-semibold text-slate-900">{record.fileName}</span>
                <span className="text-slate-400 block mt-0.5">
                  {(record.fileSize / 1024).toFixed(1)} KB · Processed by n8n multipart form handler
                </span>
              </div>
            </div>
          </div>

          {/* Notice */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 leading-relaxed">
            <strong>What happens now:</strong> The n8n AI engine is evaluating your institutional dataset against accreditation tolerances, multi-year retention benchmarks, and fiscal sustainability ratios.
          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={downloadReceipt}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Download Receipt</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onResetForm();
              }}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 cursor-pointer"
            >
              Submit Another
            </button>
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
