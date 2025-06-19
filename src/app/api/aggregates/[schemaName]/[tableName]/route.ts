// File: app/api/aggregates/[schemaName]/[tableName]/route.ts

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: { schemaName: string; tableName: string } }
) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Call your existing SQL function to get the totals
    const { data, error } = await supabase.rpc('get_table_aggregates', {
      p_schema_name: params.schemaName,
      p_table_name: params.tableName,
    });

    if (error) throw error;

    // The function returns an array with one object, so we return that object.
    return NextResponse.json(data[0] || { total_le: 0, total_euro: 0 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}