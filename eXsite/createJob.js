import { supabase } from './config/supabase.js';

const product_id = "b0eda773-2a0d-4368-b639-d62599543404";

const { data, error } = await supabase
    .from('jobs')
    .insert({
        product_id,
        status: 'pending'
    })
    .select();

console.log("Job:", data, error);