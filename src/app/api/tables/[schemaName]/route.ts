// File: app/api/tables/[schemaName]/route.ts

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// This function handles GET requests to /api/tables/[schemaName]
export async function GET(
  request: Request,
  { params }: { params: { schemaName: string } }
) {
  const schemaName = params.schemaName;

  // We create a new, server-side Supabase client here.
  // Note: For server-side use, you should use Service Role Key for elevated privileges
  // if needed, but for now, we'll continue with the anon key.
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    const { data, error } = await supabase.rpc('list_tables_by_pattern', {
      p_pattern: '%',
      p_schema_name: schemaName,
    });

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}