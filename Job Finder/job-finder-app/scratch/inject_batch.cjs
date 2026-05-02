const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ticmdqeyeiycznfzxqrx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpY21kcWV5ZWl5Y3puZnp4cXJ4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDM5MzM3NiwiZXhwIjoyMDg1OTY5Mzc2fQ.Y54g33LRG3SN7tUffj_pE_Ql1b-E8LoTRzp1VmfAwzE'
);

async function run() {
  const email = 'amilawijayantha858@gmail.com';

  console.log('Clearing all old JOB_QUEUED records for', email);
  await supabase.from('user_activity').delete().eq('user_id', email).eq('action', 'JOB_QUEUED');

  const testJobs = [
    {
      user_id: email,
      action: 'JOB_QUEUED',
      details: {
        status: 'pending',
        job_url: 'https://www.linkedin.com/jobs/view/strategic-ai-lead-2026',
        role: 'AI Strategy Lead',
        company: 'DigyNex Labs'
      }
    },
    {
      user_id: email,
      action: 'JOB_QUEUED',
      details: {
        status: 'pending',
        job_url: 'https://www.linkedin.com/jobs/view/fullstack-neural-dev',
        role: 'Fullstack Neural Engineer',
        company: 'Neural Bridge Corp'
      }
    },
    {
      user_id: email,
      action: 'JOB_QUEUED',
      details: {
        status: 'pending',
        job_url: 'https://www.linkedin.com/jobs/view/automation-expert-qa',
        role: 'Automation Expert',
        company: 'Career Nexus'
      }
    }
  ];

  console.log('Injecting 3 fresh test jobs...');
  const { error } = await supabase.from('user_activity').insert(testJobs);

  if (error) console.error('Error:', error);
  else console.log('✅ 3 test jobs injected successfully!');
}

run();
