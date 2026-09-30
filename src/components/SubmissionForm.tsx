import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Building2,
  Mail,
  FileText,
  Table,
  ArrowRight,
  ShieldAlert,
  Loader2,
  Sparkles,
  Info,
} from 'lucide-react';
import { INSTITUTION_PRESETS, STANDARD_KPI_DATA, STRESS_TEST_KPI_DATA, convertRowsToCSV, parseCSVText } from '../data/sampleDatasets';
import { SubmissionRecord } from '../types';

interface SubmissionFormProps {
  onSubmissionSuccess: (record: SubmissionRecord) => void;
  onNavigateToInspector: () => void;
}

export const SubmissionForm: React.FC<SubmissionFormProps> = ({
  onSubmissionSuccess,
  onNavigateToInspector,
}) => {
  const [institutionName, setInstitutionName] = useState('');
  const [institutionEmail, setInstitutionEmail] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<{ headers: string[]; rows: string[][] } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionPhase, setSubmissionPhase] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse CSV text for quick inline preview table
  const handleFileChange = (file: File | null) => {
    if (!file) {
      setSelectedFile(null);
      setCsvPreview(null);
      return;
    }

    setSelectedFile(file);
    setFormError(null);

    // If it's a CSV or text file, parse for preview
    if (file.name.endsWith('.csv') || file.type.includes('csv') || file.type.includes('text')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (text) {
          const parsed = parseCSVText(text);
          setCsvPreview(parsed);
        }
      };
      reader.readAsText(file);
    } else {
      setCsvPreview(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileChange(file);
    }
  };

  const loadSampleDataset = (type: 'standard' | 'stressTest' = 'standard') => {
    const data = type === 'standard' ? STANDARD_KPI_DATA : STRESS_TEST_KPI_DATA;
    const csvContent = convertRowsToCSV(data);
    const fileName = type === 'standard' ? 'institutional_kpi_sample_standard.csv' : 'institutional_kpi_sample_stress.csv';
    const sampleFile = new File([csvContent], fileName, { type: 'text/csv' });

    handleFileChange(sampleFile);
    if (!institutionName) {
      setInstitutionName(type === 'standard' ? 'Apex Institute of Technology' : 'Heritage Valley University');
    }
    if (!institutionEmail) {
      setInstitutionEmail(type === 'standard' ? 'provost@apexinstitute.edu' : 'risk-assessment@heritagevalley.edu');
    }
  };

  const handlePresetSelect = (preset: typeof INSTITUTION_PRESETS[0]) => {
    setInstitutionName(preset.name);
    setInstitutionEmail(preset.email);
    if (!selectedFile) {
      loadSampleDataset('standard');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!institutionName.trim()) {
      setFormError('Please enter the Institution Name.');
      return;
    }

    if (!institutionEmail.trim() || !institutionEmail.includes('@') || !institutionEmail.includes('.')) {
      setFormError('Please provide a valid official institution email address.');
      return;
    }

    if (!selectedFile) {
      setFormError('Please upload a KPI Data File (Excel or CSV) or click "Load Standard Dataset".');
      return;
    }

    setIsSubmitting(true);
    setSubmissionPhase('Validating payload & preparing multipart transmission...');

    try {
      const formData = new FormData();
      formData.append('institutionName', institutionName.trim());
      formData.append('institutionEmail', institutionEmail.trim());
      formData.append('kpiFile', selectedFile);

      setSubmissionPhase('Transmitting dataset to n8n Cloud Webhook...');

      const response = await fetch('/api/submit-assessment', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || result.message || 'Submission failed. Please check the network connection.');
      }

      setSubmissionPhase('AI Risk Model pipeline triggered successfully!');

      const newRecord: SubmissionRecord = {
        id: crypto.randomUUID ? crypto.randomUUID() : `sub-${Date.now()}`,
        referenceId: result.referenceId || `KPI-${Date.now()}`,
        institutionName: institutionName.trim(),
        institutionEmail: institutionEmail.trim(),
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        rowCount: csvPreview?.rows ? csvPreview.rows.length : undefined,
        submittedAt: new Date().toISOString(),
        status: 'delivered',
        n8nStatus: response.status,
      };

      // Store in localStorage history
      try {
        const stored = localStorage.getItem('kpi_audit_submissions');
        const list = stored ? JSON.parse(stored) : [];
        list.unshift(newRecord);
        localStorage.setItem('kpi_audit_submissions', JSON.stringify(list.slice(0, 50)));
      } catch (err) {
        console.error('LocalStorage error', err);
      }

      onSubmissionSuccess(newRecord);

      // Reset form
      setSelectedFile(null);
      setCsvPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      setFormError(err.message || 'An unexpected error occurred while transmitting to n8n.');
    } finally {
      setIsSubmitting(false);
      setSubmissionPhase('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Editorial Headline */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
          <span>Official Institutional Portal</span>
          <span aria-hidden="true">·</span>
          <span>n8n Cloud Webhook Sync</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-3">
          Institutional KPI &amp; Risk Analysis System
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
          Submit your institution details along with the historical KPI dataset (Excel or CSV) to trigger an automated AI-driven early-warning risk prediction report delivered directly to your official email.
        </p>
      </div>

      {/* Main Form Container */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Quick Preset Autocomplete Options */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Quick-Fill Sample Profiles (Optional)</span>
              </div>
              <span className="text-xs text-slate-500">1-Click Autocomplete</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {INSTITUTION_PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset.name}
                  onClick={() => handlePresetSelect(preset)}
                  className="px-2.5 py-1 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded hover:border-slate-400 hover:text-slate-900 transition-colors text-left"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Section 1: Institution Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Institution Name (field-0) */}
            <div>
              <label htmlFor="institution-name" className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
                Institution Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <input
                  id="institution-name"
                  type="text"
                  required
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  placeholder="e.g. Apex Institute of Technology"
                  className="block w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-slate-900 placeholder:text-slate-400"
                />
              </div>
              <p className="mt-1.5 text-xs text-slate-500">
                Maps to n8n webhook identifier <code className="font-mono text-slate-600">field-0</code>
              </p>
            </div>

            {/* Institution Email (field-1) */}
            <div>
              <label htmlFor="institution-email" className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
                Official Institution Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="institution-email"
                  type="email"
                  required
                  value={institutionEmail}
                  onChange={(e) => setInstitutionEmail(e.target.value)}
                  placeholder="e.g. provost@institution.edu"
                  className="block w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-slate-900 placeholder:text-slate-400"
                />
              </div>
              <p className="mt-1.5 text-xs text-slate-500">
                Automated AI risk assessment report will be dispatched to this address (<code className="font-mono text-slate-600">field-1</code>)
              </p>
            </div>
          </div>

          {/* Section 2: File Upload (field-2) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider">
                Historical KPI Dataset File <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => loadSampleDataset('standard')}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-800 cursor-pointer underline flex items-center gap-1"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  Load Standard Sample (6 Years)
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={() => loadSampleDataset('stressTest')}
                  className="text-xs font-medium text-amber-600 hover:text-amber-800 cursor-pointer underline flex items-center gap-1"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Load Stress-Test Sample
                </button>
              </div>
            </div>

            {/* Drag & Drop Box */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-50/50'
                  : selectedFile
                  ? 'border-emerald-300 bg-emerald-50/20 hover:border-emerald-400'
                  : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-400'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
                className="hidden"
              />

              {selectedFile ? (
                <div className="flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="font-semibold text-slate-900 text-sm mb-1">{selectedFile.name}</div>
                  <div className="text-xs text-slate-500 mb-3">
                    {(selectedFile.size / 1024).toFixed(1)} KB · {selectedFile.type || 'Dataset File'} · Ready for n8n transmission
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-indigo-600 hover:underline">
                      Click or drag to replace file
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileChange(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="text-xs font-medium text-rose-600 hover:text-rose-800 underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mb-3">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-800 mb-1">
                    Drag and drop your KPI dataset here, or <span className="text-indigo-600 underline">browse files</span>
                  </p>
                  <p className="text-xs text-slate-500 mb-2">
                    Accepts Excel (.xlsx, .xls) and CSV (.csv) spreadsheets up to 25 MB
                  </p>
                  <div className="text-xs text-slate-400">
                    Recommended columns: Academic Year, Retention Rate, 6-Year Graduation Rate, Faculty Ratio, Operating Budget, Deficit %
                  </div>
                </div>
              )}
            </div>
            <p className="mt-1.5 text-xs text-slate-500">
              Submitted as binary multipart file payload (<code className="font-mono text-slate-600">field-2</code>) to the n8n endpoint.
            </p>
          </div>

          {/* Dataset Preview Table (if CSV is loaded) */}
          {csvPreview && csvPreview.rows.length > 0 && (
            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/60">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Table className="w-4 h-4 text-slate-700" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Dataset Preview ({csvPreview.rows.length} Historical Records Detected)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onNavigateToInspector}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  Full Inspector &amp; Schema Editor
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Scrollable Table */}
              <div className="overflow-x-auto border border-slate-200 rounded bg-white max-h-56 scrollbar-thin">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                      {csvPreview.headers.slice(0, 7).map((h, idx) => (
                        <th key={idx} className="py-2 px-3 font-semibold whitespace-nowrap">
                          {h.replace(/_/g, ' ')}
                        </th>
                      ))}
                      {csvPreview.headers.length > 7 && (
                        <th className="py-2 px-3 font-semibold text-slate-400">
                          +{csvPreview.headers.length - 7} more
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-slate-600">
                    {csvPreview.rows.slice(0, 4).map((row, rowIdx) => (
                      <tr key={rowIdx} className="hover:bg-slate-50/80">
                        {row.slice(0, 7).map((cell, cellIdx) => (
                          <td key={cellIdx} className="py-2 px-3 whitespace-nowrap">
                            {cell}
                          </td>
                        ))}
                        {row.length > 7 && (
                          <td className="py-2 px-3 text-slate-400 whitespace-nowrap">...</td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Form Error Message */}
          {formError && (
            <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-rose-800">Submission Error</p>
                <p className="text-xs text-rose-700 mt-0.5">{formError}</p>
              </div>
            </div>
          )}
        </div>

        {/* Form Footer / Submit Bar */}
        <div className="px-6 sm:px-8 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Info className="w-4 h-4 text-slate-400 shrink-0" />
            <span>n8n Endpoint: <code className="font-mono text-slate-700">18bf7cf1-7ab5-4158-91c7-737b7c8313a2</code></span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              isSubmitting
                ? 'bg-slate-400 text-white cursor-not-allowed'
                : 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm active:scale-98'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>{submissionPhase || 'Processing Submission...'}</span>
              </>
            ) : (
              <>
                <span>Submit Institutional Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Feature Explainer Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border border-slate-200 bg-white">
          <div className="font-semibold text-slate-900 text-sm mb-1">1. KPI Extraction</div>
          <p className="text-xs text-slate-600 leading-relaxed">
            n8n ingests student retention, graduation benchmarks, operating margins, and faculty loads from the spreadsheet.
          </p>
        </div>
        <div className="p-4 rounded-lg border border-slate-200 bg-white">
          <div className="font-semibold text-slate-900 text-sm mb-1">2. AI Risk Classification</div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Automated intelligence analyzes multi-year trajectories to spot early attrition surges and fiscal vulnerability.
          </p>
        </div>
        <div className="p-4 rounded-lg border border-slate-200 bg-white">
          <div className="font-semibold text-slate-900 text-sm mb-1">3. Automated Email Report</div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Detailed risk scorecard, accreditation advisory, and corrective action items are emailed directly to leadership.
          </p>
        </div>
      </div>
    </div>
  );
};
