const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ticmdqeyeiycznfzxqrx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpY21kcWV5ZWl5Y3puZnp4cXJ4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDM5MzM3NiwiZXhwIjoyMDg1OTY5Mzc2fQ.Y54g33LRG3SN7tUffj_pE_Ql1b-E8LoTRzp1VmfAwzE'
);

async function run() {
  const email = 'amilawijayantha858@gmail.com';

  console.log('Cleaning up old records...');
  const { error: deleteError } = await supabase
    .from('user_activity')
    .delete()
    .eq('user_id', email)
    .eq('action', 'JOB_QUEUED');

  if (deleteError) {
    console.error('Delete Error:', deleteError);
    return;
  }
  console.log('Deleted old JOB_QUEUED records.');

  console.log('Injecting fresh test job...');
  const { error: insertError } = await supabase
    .from('user_activity')
    .insert([
      {
        user_id: email,
        action: 'JOB_QUEUED',
        details: {
          status: 'pending',
          job_url: 'https://www.linkedin.com/jobs/view/final-clean-test-v100',
          role: 'Strategic Automation Lead',
          company: 'DigyNex Global'
        }
      }
    ]);

  if (insertError) {
    console.error('Insert Error:', insertError);
  } else {
    console.log('✅ Fresh test job injected successfully!');
  }
}

run();
