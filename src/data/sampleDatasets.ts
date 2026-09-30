import { KPIRow } from '../types';

export const INSTITUTION_PRESETS = [
  { name: 'Apex Institute of Technology', email: 'provost@apexinstitute.edu', type: 'Private STEM University' },
  { name: 'Metropolitan State University', email: 'analytics@metropolitanstate.edu', type: 'Public Comprehensive' },
  { name: 'Heritage Valley College', email: 'administration@heritagevalley.edu', type: 'Liberal Arts College' },
  { name: 'National Polytechnic Institute', email: 'deans.office@nationalpoly.edu', type: 'Technical University' },
  { name: 'Pacific Coast Medical & Health Sciences', email: 'quality@pacificcoasthealth.edu', type: 'Specialized Graduate' },
];

export const STANDARD_KPI_DATA: KPIRow[] = [
  {
    Academic_Year: '2020-21',
    Undergraduate_Enrollment: 11250,
    Graduate_Enrollment: 3420,
    Retention_Rate_Pct: 89.2,
    Six_Year_Graduation_Rate_Pct: 84.1,
    Faculty_To_Student_Ratio: 14.5,
    Total_Operating_Budget_USD: 142000000,
    Endowment_Value_USD: 420000000,
    Net_Operating_Deficit_Surplus_Pct: 1.2,
    Instructional_Expenditure_Per_Student: 16800,
    Job_Placement_Rate_Pct: 91.2,
    Default_Rate_Cohort_Pct: 2.4,
    Accreditation_Risk_Index: 'Low',
  },
  {
    Academic_Year: '2021-22',
    Undergraduate_Enrollment: 11480,
    Graduate_Enrollment: 3510,
    Retention_Rate_Pct: 88.7,
    Six_Year_Graduation_Rate_Pct: 85.0,
    Faculty_To_Student_Ratio: 14.8,
    Total_Operating_Budget_USD: 148500000,
    Endowment_Value_USD: 445000000,
    Net_Operating_Deficit_Surplus_Pct: 0.8,
    Instructional_Expenditure_Per_Student: 17200,
    Job_Placement_Rate_Pct: 92.0,
    Default_Rate_Cohort_Pct: 2.1,
    Accreditation_Risk_Index: 'Low',
  },
  {
    Academic_Year: '2022-23',
    Undergraduate_Enrollment: 11800,
    Graduate_Enrollment: 3640,
    Retention_Rate_Pct: 89.5,
    Six_Year_Graduation_Rate_Pct: 86.2,
    Faculty_To_Student_Ratio: 14.2,
    Total_Operating_Budget_USD: 156000000,
    Endowment_Value_USD: 480000000,
    Net_Operating_Deficit_Surplus_Pct: 1.5,
    Instructional_Expenditure_Per_Student: 17900,
    Job_Placement_Rate_Pct: 93.4,
    Default_Rate_Cohort_Pct: 1.9,
    Accreditation_Risk_Index: 'Low',
  },
  {
    Academic_Year: '2023-24',
    Undergraduate_Enrollment: 12150,
    Graduate_Enrollment: 3780,
    Retention_Rate_Pct: 90.1,
    Six_Year_Graduation_Rate_Pct: 87.4,
    Faculty_To_Student_Ratio: 13.9,
    Total_Operating_Budget_USD: 165000000,
    Endowment_Value_USD: 510000000,
    Net_Operating_Deficit_Surplus_Pct: -0.4,
    Instructional_Expenditure_Per_Student: 18500,
    Job_Placement_Rate_Pct: 93.8,
    Default_Rate_Cohort_Pct: 1.8,
    Accreditation_Risk_Index: 'Low',
  },
  {
    Academic_Year: '2024-25',
    Undergraduate_Enrollment: 12500,
    Graduate_Enrollment: 3920,
    Retention_Rate_Pct: 91.0,
    Six_Year_Graduation_Rate_Pct: 88.2,
    Faculty_To_Student_Ratio: 13.6,
    Total_Operating_Budget_USD: 174000000,
    Endowment_Value_USD: 545000000,
    Net_Operating_Deficit_Surplus_Pct: 0.6,
    Instructional_Expenditure_Per_Student: 19200,
    Job_Placement_Rate_Pct: 94.5,
    Default_Rate_Cohort_Pct: 1.7,
    Accreditation_Risk_Index: 'Low',
  },
  {
    Academic_Year: '2025-26 (Projected)',
    Undergraduate_Enrollment: 12920,
    Graduate_Enrollment: 4050,
    Retention_Rate_Pct: 91.8,
    Six_Year_Graduation_Rate_Pct: 89.1,
    Faculty_To_Student_Ratio: 13.4,
    Total_Operating_Budget_USD: 185000000,
    Endowment_Value_USD: 580000000,
    Net_Operating_Deficit_Surplus_Pct: 1.1,
    Instructional_Expenditure_Per_Student: 19950,
    Job_Placement_Rate_Pct: 95.2,
    Default_Rate_Cohort_Pct: 1.5,
    Accreditation_Risk_Index: 'Low',
  },
];

export const STRESS_TEST_KPI_DATA: KPIRow[] = [
  {
    Academic_Year: '2020-21',
    Undergraduate_Enrollment: 8400,
    Graduate_Enrollment: 1200,
    Retention_Rate_Pct: 81.4,
    Six_Year_Graduation_Rate_Pct: 68.2,
    Faculty_To_Student_Ratio: 19.2,
    Total_Operating_Budget_USD: 78000000,
    Endowment_Value_USD: 110000000,
    Net_Operating_Deficit_Surplus_Pct: -1.4,
    Instructional_Expenditure_Per_Student: 12400,
    Job_Placement_Rate_Pct: 82.1,
    Default_Rate_Cohort_Pct: 5.8,
    Accreditation_Risk_Index: 'Moderate',
  },
  {
    Academic_Year: '2021-22',
    Undergraduate_Enrollment: 8120,
    Graduate_Enrollment: 1150,
    Retention_Rate_Pct: 79.8,
    Six_Year_Graduation_Rate_Pct: 66.5,
    Faculty_To_Student_Ratio: 20.1,
    Total_Operating_Budget_USD: 76500000,
    Endowment_Value_USD: 105000000,
    Net_Operating_Deficit_Surplus_Pct: -2.8,
    Instructional_Expenditure_Per_Student: 11900,
    Job_Placement_Rate_Pct: 80.4,
    Default_Rate_Cohort_Pct: 6.2,
    Accreditation_Risk_Index: 'Moderate',
  },
  {
    Academic_Year: '2022-23',
    Undergraduate_Enrollment: 7850,
    Graduate_Enrollment: 1080,
    Retention_Rate_Pct: 77.2,
    Six_Year_Graduation_Rate_Pct: 64.1,
    Faculty_To_Student_Ratio: 21.5,
    Total_Operating_Budget_USD: 74000000,
    Endowment_Value_USD: 98000000,
    Net_Operating_Deficit_Surplus_Pct: -4.5,
    Instructional_Expenditure_Per_Student: 11200,
    Job_Placement_Rate_Pct: 78.2,
    Default_Rate_Cohort_Pct: 7.4,
    Accreditation_Risk_Index: 'Elevated',
  },
  {
    Academic_Year: '2023-24',
    Undergraduate_Enrollment: 7450,
    Graduate_Enrollment: 1020,
    Retention_Rate_Pct: 74.9,
    Six_Year_Graduation_Rate_Pct: 62.0,
    Faculty_To_Student_Ratio: 22.8,
    Total_Operating_Budget_USD: 71200000,
    Endowment_Value_USD: 92000000,
    Net_Operating_Deficit_Surplus_Pct: -6.8,
    Instructional_Expenditure_Per_Student: 10800,
    Job_Placement_Rate_Pct: 75.9,
    Default_Rate_Cohort_Pct: 8.9,
    Accreditation_Risk_Index: 'High',
  },
  {
    Academic_Year: '2024-25',
    Undergraduate_Enrollment: 7100,
    Graduate_Enrollment: 960,
    Retention_Rate_Pct: 73.1,
    Six_Year_Graduation_Rate_Pct: 60.4,
    Faculty_To_Student_Ratio: 23.6,
    Total_Operating_Budget_USD: 68000000,
    Endowment_Value_USD: 87000000,
    Net_Operating_Deficit_Surplus_Pct: -8.2,
    Instructional_Expenditure_Per_Student: 10300,
    Job_Placement_Rate_Pct: 74.0,
    Default_Rate_Cohort_Pct: 9.8,
    Accreditation_Risk_Index: 'High',
  },
  {
    Academic_Year: '2025-26 (Projected)',
    Undergraduate_Enrollment: 6800,
    Graduate_Enrollment: 910,
    Retention_Rate_Pct: 71.5,
    Six_Year_Graduation_Rate_Pct: 59.1,
    Faculty_To_Student_Ratio: 24.5,
    Total_Operating_Budget_USD: 65000000,
    Endowment_Value_USD: 82000000,
    Net_Operating_Deficit_Surplus_Pct: -9.6,
    Instructional_Expenditure_Per_Student: 9800,
    Job_Placement_Rate_Pct: 72.5,
    Default_Rate_Cohort_Pct: 11.2,
    Accreditation_Risk_Index: 'Critical',
  },
];

export function convertRowsToCSV(rows: KPIRow[]): string {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]) as (keyof KPIRow)[];
  const csvLines = [headers.join(',')];

  for (const row of rows) {
    const line = headers.map(header => {
      const val = row[header];
      if (typeof val === 'string' && val.includes(',')) {
        return `"${val}"`;
      }
      return String(val);
    }).join(',');
    csvLines.push(line);
  }

  return csvLines.join('\n');
}

export function parseCSVText(csvText: string): { headers: string[]; rows: string[][] } {
  const lines = csvText.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
  if (!lines.length) return { headers: [], rows: [] };

  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseLine(lines[0]);
  const rows = lines.slice(1).map(parseLine);
  return { headers, rows };
}
