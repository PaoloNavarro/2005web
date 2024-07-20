// supabase-config.js
const { createClient } = supabase

const supabaseUrl = 'https://gdyjqfbwejlqsppncgnd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkeWpxZmJ3ZWpscXNwcG5jZ25kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE0ODQ0OTgsImV4cCI6MjAzNzA2MDQ5OH0.UsmHzKjmPcnj_VPN_8owK3z7Lpk-bE2ARZDBnmb5jvY';
const _supabase  = createClient(supabaseUrl, supabaseKey);
