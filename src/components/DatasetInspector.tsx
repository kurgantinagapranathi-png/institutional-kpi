import React, { useState } from 'react';
import {
  Download,
  Send,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Plus,
  HelpCircle,
} from 'lucide-react';
import { STANDARD_KPI_DATA, STRESS_TEST_KPI_DATA, convertRowsToCSV } from '../data/sampleDatasets';
import { KPIRow } from '../types';

interface DatasetInspectorProps {
  onApplyDatasetToForm: (csvFile: File, scenarioName: string) => void;
}

export const DatasetInspector: React.FC<DatasetInspectorProps> = ({
  onApplyDatasetToForm,
}) => {
  const [activeScenario, setActiveScenario] = useState<'standard' | 'stressTest'>('standard');
  const [rows, setRows] = useState<KPIRow[]>([...STANDARD_KPI_DATA]);
  const [notification, setNotification] = useState<string | null>(null);

  const handleScenarioChange = (scenario: 'standard' | 'stressTest') => {
    setActiveScenario(scenario);
    setRows(scenario === 'standard' ? [...STANDARD_KPI_DATA] : [...STRESS_TEST_KPI_DATA]);
    showToast(`Loaded ${scenario === 'standard' ? 'Standard Healthy' : 'Fiscal Stress Test'} scenario.`);
  };

  const handleCellEdit = (index: number, key: keyof KPIRow, value: string) => {
    const updated = [...rows];
    const target = { ...updated[index] };

    if (key === 'Academic_Year' || key === 'Accreditation_Risk_Index') {
      target[key] = value as any;
    } else {
      const num = parseFloat(value);
      target[key] = isNaN(num) ? (0 as any) : (num as any);
    }

    updated[index] = target;
    setRows(updated);
  };

  const handleReset = () => {
    setRows(activeScenario === 'standard' ? [...STANDARD_KPI_DATA] : [...STRESS_TEST_KPI_DATA]);
    showToast('Reset dataset to initial values.');
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDownloadCSV = () => {
    const csv = convertRowsToCSV(rows);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `institutional_kpi_${activeScenario}_dataset.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV downloaded successfully.');
  };

  const handleTransferToForm = () => {
    const csv = convertRowsToCSV(rows);
    const fileName = `institutional_kpi_${activeScenario}_customized.csv`;
    const file = new File([csv], fileName, { type: 'text/csv' });
    const scenarioLabel = activeScenario === 'standard' ? 'Standard Institution' : 'Stress-Test Institution';
    onApplyDatasetToForm(file, scenarioLabel);
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'Low':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Moderate':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Elevated':
        return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'High':
      case 'Critical':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            <span>KPI Schema Explorer &amp; Generator</span>
            <span aria-hidden="true">·</span>
            <span>Accreditation Standards</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Institutional KPI Dataset Inspector
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Preview, modify, and export the standardized multi-year dataset expected by the automated early-warning risk evaluation engine in n8n.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleDownloadCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleTransferToForm}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-emerald-400" />
            <span>Use This Dataset in Assessment</span>
          </button>
        </div>
      </div>

      {/* Scenario Filter Tabs */}
      <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-2 hidden sm:inline">
            Preset Scenario:
          </span>
          <button
            onClick={() => handleScenarioChange('standard')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeScenario === 'standard'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Healthy Institutional Baseline</span>
          </button>

          <button
            onClick={() => handleScenarioChange('stressTest')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeScenario === 'stressTest'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Fiscal &amp; Retention Stress-Test</span>
          </button>
        </div>

        <div className="text-xs text-slate-500 hidden md:block">
          {rows.length} Years of Trend Records
        </div>
      </div>

      {/* Interactive Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Interactive KPI Records (Click any numerical cell to edit)
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Changes reflect immediately in CSV export &amp; submission payload</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                <th className="py-3 px-3.5 font-semibold whitespace-nowrap">Academic Year</th>
                <th className="py-3 px-3 font-semibold whitespace-nowrap">Undergrad</th>
                <th className="py-3 px-3 font-semibold whitespace-nowrap">Grad</th>
                <th className="py-3 px-3 font-semibold whitespace-nowrap">Retention %</th>
                <th className="py-3 px-3 font-semibold whitespace-nowrap">6-Yr Grad %</th>
                <th className="py-3 px-3 font-semibold whitespace-nowrap">Faculty:Student</th>
                <th className="py-3 px-3 font-semibold whitespace-nowrap">Operating Budget ($)</th>
                <th className="py-3 px-3 font-semibold whitespace-nowrap">Deficit/Surplus %</th>
                <th className="py-3 px-3 font-semibold whitespace-nowrap">Expenditure/Student</th>
                <th className="py-3 px-3 font-semibold whitespace-nowrap">Placement %</th>
                <th className="py-3 px-3 font-semibold whitespace-nowrap">Cohort Default %</th>
                <th className="py-3 px-3 font-semibold whitespace-nowrap">Risk Index</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-slate-800">
              {rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-3.5 font-sans font-semibold text-slate-900 whitespace-nowrap">
                    <input
                      type="text"
                      value={row.Academic_Year}
                      onChange={(e) => handleCellEdit(idx, 'Academic_Year', e.target.value)}
                      className="w-24 bg-transparent border-b border-transparent focus:border-slate-400 focus:outline-none"
                    />
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    <input
                      type="number"
                      value={row.Undergraduate_Enrollment}
                      onChange={(e) => handleCellEdit(idx, 'Undergraduate_Enrollment', e.target.value)}
                      className="w-20 px-1 py-0.5 border border-transparent hover:border-slate-300 focus:border-slate-600 focus:bg-white rounded"
                    />
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    <input
                      type="number"
                      value={row.Graduate_Enrollment}
                      onChange={(e) => handleCellEdit(idx, 'Graduate_Enrollment', e.target.value)}
                      className="w-20 px-1 py-0.5 border border-transparent hover:border-slate-300 focus:border-slate-600 focus:bg-white rounded"
                    />
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    <input
                      type="number"
                      step="0.1"
                      value={row.Retention_Rate_Pct}
                      onChange={(e) => handleCellEdit(idx, 'Retention_Rate_Pct', e.target.value)}
                      className={`w-16 px-1 py-0.5 font-bold rounded border border-transparent hover:border-slate-300 focus:border-slate-600 ${
                        row.Retention_Rate_Pct < 75 ? 'text-rose-600' : 'text-slate-800'
                      }`}
                    />
                    %
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    <input
                      type="number"
                      step="0.1"
                      value={row.Six_Year_Graduation_Rate_Pct}
                      onChange={(e) => handleCellEdit(idx, 'Six_Year_Graduation_Rate_Pct', e.target.value)}
                      className="w-16 px-1 py-0.5 border border-transparent hover:border-slate-300 focus:border-slate-600 rounded"
                    />
                    %
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    1:
                    <input
                      type="number"
                      step="0.1"
                      value={row.Faculty_To_Student_Ratio}
                      onChange={(e) => handleCellEdit(idx, 'Faculty_To_Student_Ratio', e.target.value)}
                      className="w-14 px-1 py-0.5 border border-transparent hover:border-slate-300 focus:border-slate-600 rounded"
                    />
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    $
                    <input
                      type="number"
                      value={row.Total_Operating_Budget_USD}
                      onChange={(e) => handleCellEdit(idx, 'Total_Operating_Budget_USD', e.target.value)}
                      className="w-28 px-1 py-0.5 border border-transparent hover:border-slate-300 focus:border-slate-600 rounded"
                    />
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    <input
                      type="number"
                      step="0.1"
                      value={row.Net_Operating_Deficit_Surplus_Pct}
                      onChange={(e) => handleCellEdit(idx, 'Net_Operating_Deficit_Surplus_Pct', e.target.value)}
                      className={`w-16 px-1 py-0.5 font-bold rounded border border-transparent hover:border-slate-300 focus:border-slate-600 ${
                        row.Net_Operating_Deficit_Surplus_Pct < 0 ? 'text-rose-600' : 'text-emerald-600'
                      }`}
                    />
                    %
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    $
                    <input
                      type="number"
                      value={row.Instructional_Expenditure_Per_Student}
                      onChange={(e) => handleCellEdit(idx, 'Instructional_Expenditure_Per_Student', e.target.value)}
                      className="w-20 px-1 py-0.5 border border-transparent hover:border-slate-300 focus:border-slate-600 rounded"
                    />
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    <input
                      type="number"
                      step="0.1"
                      value={row.Job_Placement_Rate_Pct}
                      onChange={(e) => handleCellEdit(idx, 'Job_Placement_Rate_Pct', e.target.value)}
                      className="w-16 px-1 py-0.5 border border-transparent hover:border-slate-300 focus:border-slate-600 rounded"
                    />
                    %
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    <input
                      type="number"
                      step="0.1"
                      value={row.Default_Rate_Cohort_Pct}
                      onChange={(e) => handleCellEdit(idx, 'Default_Rate_Cohort_Pct', e.target.value)}
                      className="w-16 px-1 py-0.5 border border-transparent hover:border-slate-300 focus:border-slate-600 rounded"
                    />
                    %
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    <select
                      value={row.Accreditation_Risk_Index}
                      onChange={(e) => handleCellEdit(idx, 'Accreditation_Risk_Index', e.target.value)}
                      className={`text-xs font-semibold px-2 py-1 rounded border ${getRiskBadgeColor(row.Accreditation_Risk_Index)}`}
                    >
                      <option value="Low">Low</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Elevated">Elevated</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
