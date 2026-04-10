import { supabase } from '../config/supabase.js';

export async function getPendingJobs() {
    const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'pending');

    if (error) throw error;
    return data;
}

export async function updateJobStatus(id, status) {
    await supabase
        .from('jobs')
        .update({ status })
        .eq('id', id);
}

export async function createOrderLog(order) {
    await supabase.from('orders').insert(order);
}