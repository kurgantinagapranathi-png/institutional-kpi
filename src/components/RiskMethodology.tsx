import React, { useState } from 'react';
import {
  ShieldAlert,
  GraduationCap,
  TrendingDown,
  Users,
  Award,
  Calculator,
  ArrowRight,
} from 'lucide-react';

export const RiskMethodology: React.FC = () => {
  // Interactive mini simulator
  const [retention, setRetention] = useState<number>(85);
  const [deficit, setDeficit] = useState<number>(0.5);
  const [facultyRatio, setFacultyRatio] = useState<number>(15);
  const [defaultRate, setDefaultRate] = useState<number>(3.0);

  // Calculate composite risk score
  const calculateRisk = () => {
    let score = 0; // 0 (best) to 100 (worst)

    // Retention penalty: benchmark is 85%
    if (retention < 70) score += 35;
    else if (retention < 80) score += 20;
    else if (retention < 85) score += 10;

    // Deficit penalty: negative is deficit
    if (deficit < -5) score += 35;
    else if (deficit < -2) score += 20;
    else if (deficit < 0) score += 10;

    // Faculty ratio penalty: benchmark is 15:1
    if (facultyRatio > 24) score += 15;
    else if (facultyRatio > 18) score += 8;

    // Default rate penalty: benchmark is < 5%
    if (defaultRate > 10) score += 25;
    else if (defaultRate > 6) score += 12;

    if (score < 20) return { tier: 'Low Risk', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', desc: 'Institutional fundamentals robust. Accreditation posture secure.' };
    if (score < 40) return { tier: 'Moderate Watchlist', color: 'text-amber-700 bg-amber-50 border-amber-200', desc: 'Mild attrition or margin compression. Routine monitoring suggested.' };
    if (score < 65) return { tier: 'Elevated Risk Alert', color: 'text-orange-700 bg-orange-50 border-orange-200', desc: 'Multi-year deficits or student retention drop below regional benchmark.' };
    return { tier: 'Critical Intervention', color: 'text-rose-700 bg-rose-50 border-rose-200', desc: 'High vulnerability of accreditation sanctions or severe fiscal stress.' };
  };

  const riskResult = calculateRisk();

  const quadrants = [
    {
      icon: GraduationCap,
      title: 'Academic Retention & Completion Velocity',
      weight: '35% Core Weight',
      focus: 'First-to-second year retention rate, 4-year and 6-year cohort graduation pacing.',
      thresholds: [
        { label: 'Safe', value: '> 82% First-year retention' },
        { label: 'Warning', value: '72% - 81% Attrition pressure' },
        { label: 'Critical', value: '< 72% High student departure rate' },
      ],
    },
    {
      icon: TrendingDown,
      title: 'Structural Fiscal Margin & Deficit Spread',
      weight: '30% Core Weight',
      focus: 'Net operating surplus/deficit percentage, tuition dependence index, endowment coverage.',
      thresholds: [
        { label: 'Safe', value: 'Positive net operating margin (> 0.5%)' },
        { label: 'Warning', value: '-1.0% to -4.0% multi-year drawdown' },
        { label: 'Critical', value: '> -5.0% sustained structural deficit' },
      ],
    },
    {
      icon: Users,
      title: 'Instructional Load & Faculty Capacity',
      weight: '20% Core Weight',
      focus: 'Full-time equivalent student to instructional faculty ratio and expenditure per FTE.',
      thresholds: [
        { label: 'Safe', value: '12:1 to 16:1 balanced student-to-faculty' },
        { label: 'Warning', value: '17:1 to 22:1 instructional stretching' },
        { label: 'Critical', value: '> 23:1 severe teaching capacity strain' },
      ],
    },
    {
      icon: Award,
      title: 'Regulatory & Cohort Default Tolerances',
      weight: '15% Core Weight',
      focus: 'Three-year cohort default rate (CDR) and regional accreditation compliance standards.',
      thresholds: [
        { label: 'Safe', value: 'CDR < 3.5%, full accreditation clearance' },
        { label: 'Warning', value: 'CDR 4.0% - 7.5%, advisory note' },
        { label: 'Critical', value: 'CDR > 8.0%, Title IV sanction risk' },
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
          <span>AI Early-Warning Architecture</span>
          <span aria-hidden="true">·</span>
          <span>Methodology Guide</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Risk Assessment Framework &amp; Scoring Logic
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
          The automated n8n pipeline processes your uploaded Excel or CSV records against institutional stability benchmarks.
          Below is the four-quadrant diagnostic model used by the AI engine.
        </p>
      </div>

      {/* Quadrants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quadrants.map((q, idx) => {
          const Icon = q.icon;
          return (
            <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-medium text-slate-500 border border-slate-200 px-2 py-0.5 rounded">
                  {q.weight}
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mb-2">{q.title}</h2>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">{q.focus}</p>

              <div className="space-y-1.5 border-t border-slate-100 pt-3">
                {q.thresholds.map((t, tIdx) => (
                  <div key={tIdx} className="flex items-center justify-between text-xs py-1">
                    <span className="text-slate-500 font-medium">{t.label}:</span>
                    <span className="font-mono text-slate-800">{t.value}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Risk Simulator */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <Calculator className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900">
            Interactive Threshold Simulator
          </h2>
        </div>
        <p className="text-xs text-slate-600 mb-6">
          Adjust the sliders below to see how key KPI shifts impact the early-warning risk classification tier calculated by the engine.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div>
            <div className="flex justify-between text-xs mb-1.5 font-medium">
              <span className="text-slate-700">Retention Rate</span>
              <span className="font-mono font-bold text-slate-900">{retention}%</span>
            </div>
            <input
              type="range"
              min="55"
              max="98"
              value={retention}
              onChange={(e) => setRetention(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
            />
            <span className="text-[11px] text-slate-400">Benchmark: &gt; 85%</span>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1.5 font-medium">
              <span className="text-slate-700">Operating Margin</span>
              <span className="font-mono font-bold text-slate-900">{deficit}%</span>
            </div>
            <input
              type="range"
              min="-12"
              max="5"
              step="0.5"
              value={deficit}
              onChange={(e) => setDeficit(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
            />
            <span className="text-[11px] text-slate-400">Negative = Deficit</span>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1.5 font-medium">
              <span className="text-slate-700">Faculty-to-Student</span>
              <span className="font-mono font-bold text-slate-900">1:{facultyRatio}</span>
            </div>
            <input
              type="range"
              min="10"
              max="30"
              value={facultyRatio}
              onChange={(e) => setFacultyRatio(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
            />
            <span className="text-[11px] text-slate-400">Target: 14:1 to 16:1</span>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1.5 font-medium">
              <span className="text-slate-700">Cohort Default Rate</span>
              <span className="font-mono font-bold text-slate-900">{defaultRate}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="15"
              step="0.5"
              value={defaultRate}
              onChange={(e) => setDefaultRate(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
            />
            <span className="text-[11px] text-slate-400">Tolerance: &lt; 5.0%</span>
          </div>
        </div>

        {/* Prediction Output Card */}
        <div className={`p-4 rounded-lg border ${riskResult.color} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider mb-1">
              Simulated Early-Warning Classification
            </div>
            <div className="text-lg font-bold">{riskResult.tier}</div>
            <div className="text-xs opacity-90 mt-0.5">{riskResult.desc}</div>
          </div>
          <div className="text-xs font-medium">
            Generated via standard multi-tier regression weighting
          </div>
        </div>
      </div>
    </div>
  );
};
