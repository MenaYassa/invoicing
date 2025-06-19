// File: app/api/save/route.ts

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// This function handles POST requests to /api/save
export async function POST(request: Request) {
  try {
    // This code runs on the SERVER.

    // 1. Create a server-side Supabase client.
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          // IMPORTANT: To perform actions as the logged-in user,
          // we need to forward their authentication token to the server-side client.
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      }
    );

    // Get the user's token from the incoming request headers
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) throw new Error("Missing auth header");
    const token = authHeader.replace('Bearer ', '');
    await supabase.auth.setSession({ access_token: token, refresh_token: '' });


    // 2. Get the changes from the request body
    const { schemaName, tableName, primaryKey, inserts, updates, deletes } = await request.json();

    // 3. Create an array to hold all our database operations
    const promises = [];

    // Add delete operations to the list
    if (deletes && deletes.length > 0) {
      promises.push(
        supabase.rpc('delete_rows_by_pk', {
            p_schema_name: schemaName, p_table_name: tableName,
            p_pk_column_name: primaryKey, p_pk_values_array: deletes
        })
      );
    }
    // Add update operations
    if (updates && updates.length > 0) {
        promises.push(
            supabase.rpc('update_rows', {
                p_schema_name: schemaName, p_table_name: tableName,
                p_pk_column_name: primaryKey, p_updates: updates
            })
        );
    }
    // Add insert operations
    if (inserts && inserts.length > 0) {
        promises.push(
            supabase.rpc('insert_rows', {
                p_schema_name: schemaName, p_table_name: tableName,
                p_rows_data: inserts
            })
        );
    }
    
    // 4. Execute all database operations concurrently
    const results = await Promise.all(promises);

    // 5. Check for errors and return the result
    const firstError = results.find(res => res.error);
    if (firstError) {
      throw firstError.error;
    }

    return NextResponse.json({ success: true, message: 'Changes saved successfully.' });

  } catch (error: unknown) {
    console.error('API Save Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}