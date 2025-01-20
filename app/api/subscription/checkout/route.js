import { stripe } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;
    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID not configured" }, 
        { status: 500 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: user.emailAddresses[0].emailAddress,
      allow_promotion_codes: true,
      subscription_data: { trial_from_plan: true },
      ui_mode: "embedded",
      return_url: `${process.env.HOST_URL}/dashboard`,
    });

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (error) {
    console.error('Stripe session creation error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}