import { supabase } from './config/supabase.js';

const product = {
    name: "Test",
    url: "https://www.amazon.in/dp/B0GQQNT6VG/ref=sspa_dk_detail_3",
    platform: "amazon",
    target_price: 230
};

const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select();

console.log("Inserted:", data, error);