import { supabase } from '../config/supabase.js';

export async function getProduct(product_id) {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', product_id)
        .single();

    if (error) throw error;
    return data;
}