// File: app/api/data/[schemaName]/[tableName]/route.ts

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// This function handles GET requests to /api/data/[schemaName]/[tableName]
export async function GET(
  request: Request,
  { params }: { params: { schemaName: string; tableName: string } }
) {
  try {
    // This code runs on the SERVER, never in the user's browser.

    // 1. Extract dynamic parts from the URL (e.g., 'BOQ', 'PH3A-Civil-Works')
    const schemaName = params.schemaName;
    const tableName = params.tableName;

    // 2. Extract query parameters for pagination, sorting, etc.
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const sortBy = searchParams.get('sortBy') || 'Item_Code';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    const filters = JSON.parse(searchParams.get('filters') || '{}');

    // 3. Create a server-side Supabase client using your environment variables
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // 4. Securely call your existing SQL function
    const { data, error } = await supabase.rpc('get_filtered_paginated_table', {
      p_schema_name: schemaName,
      p_table_name: tableName,
      p_filters: filters,
      p_sort_column: sortBy,
      p_sort_direction: sortOrder,
      p_page_number: page,
      p_rows_per_page: limit,
    });

    if (error) {
      // If the database function returns an error, pass it on
      throw error;
    }

    // 5. Return the data successfully as JSON
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('API Route Error:', error);
    // Return a standard error response if anything goes wrong
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}