import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function addSignature(data) {
    const { error } = await supabase
        .from('signatures')
        .insert([{
            full_name: data.fullName,
            email: data.email,
            linkedin_url: data.linkedinUrl,
            document_type: data.documentType,
            message: data.message,
            language: data.language || 'en'
        }]);

    if (error) throw error;
}

export async function getSignatureCount() {
    const { count, error } = await supabase
        .from('signatures')
        .select('*', { count: 'exact', head: true });

    if (error) throw error;
    return count;
}