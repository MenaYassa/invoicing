// File: app/api/tables/[schemaName]/route.ts

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// The signature is simplified as we only need the params.
export async function GET(
  _request: Request, // Use underscore to indicate it's intentionally unused
  { params }: { params: { schemaName: string } }
) {
  try {
    const schemaName = params.schemaName;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase.rpc('list_tables_by_pattern', {
      p_pattern: '%',
      p_schema_name: schemaName,
    });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}