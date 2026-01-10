
// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

declare var Deno: any;

console.info('verify-payment function started');

(Deno as any).serve(async (req: Request) => {
  // Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    }});
  }

  try {
    const { transactionId, amount, category } = await req.json();
    
    // Simulate server-side validation logic
    console.log(`Verifying transaction ${transactionId} for ₹${amount}`);
    
    // Logic: Amount must be positive. 
    // In a real app, this would check with a Payment Gateway API (Razorpay/Stripe).
    const isValid = amount > 0 && transactionId && transactionId.length > 3;
    
    // Artificial delay to simulate banking API call
    await new Promise(resolve => setTimeout(resolve, 800));

    return new Response(
      JSON.stringify({ 
        success: isValid, 
        message: isValid ? 'Transaction Verified Successfully' : 'Invalid Transaction Details',
        serverTimestamp: new Date().toISOString(),
        receiptId: `RCPT-${Math.floor(Math.random() * 10000)}`
      }),
      { headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', 
      }}
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid request body', success: false }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
});
