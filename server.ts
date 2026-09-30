import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const N8N_FORM_URL = 'https://pranathi2007.app.n8n.cloud/form/18bf7cf1-7ab5-4158-91c7-737b7c8313a2';

// In-memory multer storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25 MB limit
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health / Status endpoint to test n8n form connectivity
app.get('/api/n8n-status', async (_req: Request, res: Response) => {
  const startTime = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(N8N_FORM_URL, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const latencyMs = Date.now() - startTime;
    res.json({
      status: response.ok ? 'connected' : 'degraded',
      statusCode: response.status,
      latencyMs,
      endpointUrl: N8N_FORM_URL,
      formTitle: 'Institutional KPI & Risk Analysis System',
      verified: true,
      lastChecked: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const error = err as Error;
    res.status(502).json({
      status: 'error',
      message: error.message || 'Failed to connect to n8n webhook',
      endpointUrl: N8N_FORM_URL,
      lastChecked: new Date().toISOString(),
    });
  }
});

// Downloadable sample KPI datasets (CSV)
const SAMPLE_DATASETS: Record<string, string> = {
  standard: `Academic_Year,Undergraduate_Enrollment,Graduate_Enrollment,Retention_Rate_Pct,Six_Year_Graduation_Rate_Pct,Faculty_To_Student_Ratio,Total_Operating_Budget_USD,Endowment_Value_USD,Net_Operating_Deficit_Surplus_Pct,Instructional_Expenditure_Per_Student,Job_Placement_Rate_Pct,Default_Rate_Cohort_Pct,Accreditation_Risk_Index
2020,11250,3420,89.2,84.1,14.5,142000000,420000000,1.2,16800,91.2,2.4,Low
2021,11480,3510,88.7,85.0,14.8,148500000,445000000,0.8,17200,92.0,2.1,Low
2022,11800,3640,89.5,86.2,14.2,156000000,480000000,1.5,17900,93.4,1.9,Low
2023,12150,3780,90.1,87.4,13.9,165000000,510000000,-0.4,18500,93.8,1.8,Low
2024,12500,3920,91.0,88.2,13.6,174000000,545000000,0.6,19200,94.5,1.7,Low
2025,12920,4050,91.8,89.1,13.4,185000000,580000000,1.1,19950,95.2,1.5,Low`,

  stressTest: `Academic_Year,Undergraduate_Enrollment,Graduate_Enrollment,Retention_Rate_Pct,Six_Year_Graduation_Rate_Pct,Faculty_To_Student_Ratio,Total_Operating_Budget_USD,Endowment_Value_USD,Net_Operating_Deficit_Surplus_Pct,Instructional_Expenditure_Per_Student,Job_Placement_Rate_Pct,Default_Rate_Cohort_Pct,Accreditation_Risk_Index
2020,8400,1200,81.4,68.2,19.2,78000000,110000000,-1.4,12400,82.1,5.8,Moderate
2021,8120,1150,79.8,66.5,20.1,76500000,105000000,-2.8,11900,80.4,6.2,Moderate
2022,7850,1080,77.2,64.1,21.5,74000000,98000000,-4.5,11200,78.2,7.4,Elevated
2023,7450,1020,74.9,62.0,22.8,71200000,92000000,-6.8,10800,75.9,8.9,High
2024,7100,960,73.1,60.4,23.6,68000000,87000000,-8.2,10300,74.0,9.8,High
2025,6800,910,71.5,59.1,24.5,65000000,82000000,-9.6,9800,72.5,11.2,Critical`,
};

app.get('/api/sample-csv', (req: Request, res: Response) => {
  const type = (req.query.type as string) || 'standard';
  const csvContent = SAMPLE_DATASETS[type] || SAMPLE_DATASETS.standard;
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="institutional_kpi_sample_${type}.csv"`);
  res.send(csvContent);
});

// Proxy submission to n8n form webhook
app.post('/api/submit-assessment', upload.single('kpiFile'), async (req: Request, res: Response) => {
  try {
    const institutionName = (req.body.institutionName || req.body['field-0'] || '').trim();
    const institutionEmail = (req.body.institutionEmail || req.body['field-1'] || '').trim();
    const uploadedFile = req.file;

    if (!institutionName) {
      return res.status(400).json({ success: false, error: 'Institution Name is required.' });
    }
    if (!institutionEmail || !institutionEmail.includes('@')) {
      return res.status(400).json({ success: false, error: 'Valid Institution Email is required.' });
    }

    // Build FormData matching n8n's expected fields: field-0, field-1, field-2
    const n8nFormData = new FormData();
    n8nFormData.append('field-0', institutionName);
    n8nFormData.append('field-1', institutionEmail);

    if (uploadedFile) {
      const fileBlob = new Blob([new Uint8Array(uploadedFile.buffer)], {
        type: uploadedFile.mimetype || 'application/octet-stream',
      });
      n8nFormData.append('field-2', fileBlob, uploadedFile.originalname || 'kpi_dataset.csv');
    } else if (req.body.rawCsvData) {
      // Fallback if client passed raw CSV text (e.g. from sample template)
      const fileBlob = new Blob([req.body.rawCsvData], { type: 'text/csv' });
      n8nFormData.append('field-2', fileBlob, 'kpi_metrics_submission.csv');
    } else {
      return res.status(400).json({ success: false, error: 'A KPI Dataset file (.csv or .xlsx) is required.' });
    }

    // Forward to n8n form webhook
    const n8nResponse = await fetch(N8N_FORM_URL, {
      method: 'POST',
      body: n8nFormData,
    });

    const responseText = await n8nResponse.text();
    let responseJson: any = null;
    try {
      responseJson = JSON.parse(responseText);
    } catch {
      // Not JSON
    }

    if (!n8nResponse.ok) {
      return res.status(n8nResponse.status).json({
        success: false,
        error: `n8n submission returned status ${n8nResponse.status}`,
        details: responseText,
      });
    }

    const referenceId = `KPI-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;

    return res.status(200).json({
      success: true,
      referenceId,
      submittedAt: new Date().toISOString(),
      institutionName,
      institutionEmail,
      fileName: uploadedFile?.originalname || 'kpi_metrics_submission.csv',
      fileSize: uploadedFile?.size || (req.body.rawCsvData ? req.body.rawCsvData.length : 0),
      n8nResponse: responseJson || responseText,
      message: 'Assessment dataset successfully submitted to n8n AI Risk Prediction workflow.',
    });
  } catch (error: any) {
    console.error('Error forwarding to n8n:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'An internal error occurred while communicating with n8n.',
    });
  }
});

// Configure Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer();
