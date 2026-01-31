
import { createClient } from 'https://esm.sh/@supabase/supabase-js@^2.48.1';

const supabaseUrl = 'https://ypfcgahrjzezkeiwmcox.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwZmNnYWhyanplemtlaXdtY294Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4NDI4OTAsImV4cCI6MjA4NTQxODg5MH0.b_xxvco0Up-L2iZUnTfWdDHvD6U9JOlCb93qVzlO8xk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
