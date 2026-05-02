const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ticmdqeyeiycznfzxqrx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpY21kcWV5ZWl5Y3puZnp4cXJ4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDM5MzM3NiwiZXhwIjoyMDg1OTY5Mzc2fQ.Y54g33LRG3SN7tUffj_pE_Ql1b-E8LoTRzp1VmfAwzE'
);

async function run() {
  const { error } = await supabase
    .from('user_activity')
    .insert([
      {
        user_id: 'amilawijayantha858@gmail.com',
        action: 'JOB_QUEUED',
        details: {
          status: 'pending',
          job_url: 'https://www.linkedin.com/jobs/view/final-neural-success-v7',
          role: 'Automation Lead',
          company: 'DigyNex'
        }
      }
    ]);

  if (error) console.error('Error:', error);
  else console.log('✅ Test data injected successfully!');
}

run();
