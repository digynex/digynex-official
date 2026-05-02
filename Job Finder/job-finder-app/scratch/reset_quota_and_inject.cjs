const https = require('https');

const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpY21kcWV5ZWl5Y3puZnp4cXJ4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDM5MzM3NiwiZXhwIjoyMDg1OTY5Mzc2fQ.Y54g33LRG3SN7tUffj_pE_Ql1b-E8LoTRzp1VmfAwzE';
const HOST = 'ticmdqeyeiycznfzxqrx.supabase.co';
const EMAIL = 'amilawijayantha858@gmail.com';

async function makeRequest(path, method, body) {
    const data = JSON.stringify(body);
    const options = {
        hostname: HOST,
        path: path,
        method: method,
        headers: {
            'apikey': API_KEY,
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        }
    };
    if (data) options.headers['Content-Length'] = data.length;

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let resData = '';
            res.on('data', (chunk) => resData += chunk);
            res.on('end', () => resolve({ statusCode: res.statusCode, data: resData }));
        });
        req.on('error', reject);
        if (data) req.write(data);
        req.end();
    });
}

async function run() {
    console.log(`Resetting quota for ${EMAIL}...`);
    // 1. Reset Quota to 10
    const quotaRes = await makeRequest(`/rest/v1/profiles?email=eq.${EMAIL}`, 'PATCH', { cv_limit: 10 });
    console.log(`Quota Reset Status: ${quotaRes.statusCode}`);

    // 2. Inject Test Jobs
    console.log(`Injecting test jobs...`);
    const jobs = [
        { role: 'Final Success Test 1', company: 'DigyNex Global', url: 'https://www.linkedin.com/jobs/view/final-v1' },
        { role: 'Final Success Test 2', company: 'DigyNex Global', url: 'https://www.linkedin.com/jobs/view/final-v2' }
    ];

    for (const job of jobs) {
        const injectRes = await makeRequest('/rest/v1/user_activity', 'POST', {
            user_id: EMAIL,
            action: 'JOB_QUEUED',
            details: {
                job_url: job.url,
                role: job.role,
                company: job.company,
                status: 'pending'
            }
        });
        console.log(`Job Injected: ${job.role} - Status: ${injectRes.statusCode}`);
    }

    console.log('--- DONE ---');
}

run();
