
// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

interface reqPayload {
  name: string;
}

console.info('server started');

(Deno as any).serve(async (req: Request) => {
  // Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    }});
  }

  try {
    const { name }: reqPayload = await req.json();
    const data = {
      message: `Hello ${name}! Welcome to Uttarandhra Tirupati Serverless API.`,
      timestamp: new Date().toISOString()
    };

    return new Response(
      JSON.stringify(data),
      { headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', 
      }}
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
});
