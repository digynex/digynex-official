const https = require('https');

const jobs = [
  { role: 'Full Stack Developer', company: 'DigyNex Test 1', url: 'https://www.linkedin.com/jobs/view/3910300651/' },
  { role: 'Automation Engineer', company: 'DigyNex Test 2', url: 'https://www.linkedin.com/jobs/view/3910300652/' },
  { role: 'Backend Dev', company: 'DigyNex Test 3', url: 'https://www.linkedin.com/jobs/view/3910300653/' }
];

async function inject() {
  for (const job of jobs) {
    const data = JSON.stringify({
      user_id: 'amilawijayantha858@gmail.com',
      action: 'JOB_QUEUED',
      details: {
        job_url: job.url,
        role: job.role,
        company: job.company,
        status: 'pending'
      }
    });

    const options = {
      hostname: 'ticmdqeyeiycznfzxqrx.supabase.co',
      path: '/rest/v1/user_activity',
      method: 'POST',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpY21kcWV5ZWl5Y3puZnp4cXJ4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDM5MzM3NiwiZXhwIjoyMDg1OTY5Mzc2fQ.Y54g33LRG3SN7tUffj_pE_Ql1b-E8LoTRzp1VmfAwzE',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpY21kcWV5ZWl5Y3puZnp4cXJ4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDM5MzM3NiwiZXhwIjoyMDg1OTY5Mzc2fQ.Y54g33LRG3SN7tUffj_pE_Ql1b-E8LoTRzp1VmfAwzE',
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        console.log(`Job Injected for Verified User: ${job.role} - Status: ${res.statusCode}`);
        resolve();
      });
      req.on('error', reject);
      req.write(data);
      req.end();
    });
  }
}

inject();
