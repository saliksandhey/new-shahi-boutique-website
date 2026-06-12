const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://zwapwidrnguersxypvky.supabase.co', 'sb_publishable_GxknJbdem7EjGTk9YbpSSg_fne_gZXq');

async function check() {
  const { data, error } = await supabase.from('orders').select('*').limit(1);
  if (error) {
    console.error(error);
  } else {
    console.log(data);
    if (data.length > 0) {
      console.log('Columns:', Object.keys(data[0]));
    }
  }
}
check();
