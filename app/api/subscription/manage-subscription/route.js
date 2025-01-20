import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(req) {
  const returnUrl = process.env.HOST_URL;
  const customerId = await req.json();

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${returnUrl}/dashboard`,
  });
  
  return NextResponse.json(portalSession);
}
