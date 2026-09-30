export interface KPIRow {
  Academic_Year: string;
  Undergraduate_Enrollment: number;
  Graduate_Enrollment: number;
  Retention_Rate_Pct: number;
  Six_Year_Graduation_Rate_Pct: number;
  Faculty_To_Student_Ratio: number;
  Total_Operating_Budget_USD: number;
  Endowment_Value_USD: number;
  Net_Operating_Deficit_Surplus_Pct: number;
  Instructional_Expenditure_Per_Student: number;
  Job_Placement_Rate_Pct: number;
  Default_Rate_Cohort_Pct: number;
  Accreditation_Risk_Index: 'Low' | 'Moderate' | 'Elevated' | 'High' | 'Critical';
}

export interface SubmissionRecord {
  id: string;
  referenceId: string;
  institutionName: string;
  institutionEmail: string;
  fileName: string;
  fileSize: number;
  rowCount?: number;
  submittedAt: string;
  status: 'delivered' | 'processing';
  n8nStatus: number;
}

export interface N8nStatusInfo {
  status: 'connected' | 'degraded' | 'error' | 'checking';
  statusCode?: number;
  latencyMs?: number;
  endpointUrl: string;
  formTitle: string;
  verified: boolean;
  lastChecked: string;
}
