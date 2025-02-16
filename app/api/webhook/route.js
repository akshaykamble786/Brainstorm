import { adminDb } from "@/config/FirebaseAdminConfig";
import { stripe } from "@/lib/stripe/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  const headersList = headers();
  const body = await req.text();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    throw new Response("no response", { status: 400 });
  }

  if (!process.env.STRIPE_WEBHOOK_KEY) {
    return new NextResponse("STRIPE_WEBHOOK_KEY is not set", { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_KEY
    );
  } catch (error) {
    console.log(error);
    return new NextResponse("webhook error", { status: 400 });
  }

  const getUserDetails = async (customerId) => {
    const userDoc = await adminDb
      .collection("users")
      .where("stripeCustomerId", "==", customerId)
      .limit(1)
      .get();

    if (!userDoc.empty) {
      return userDoc.docs[0];
    }
  };

  switch (event.type) {
    case "checkout.session.completed":
    case "payment_intent.succeeded": {
      const invoice = event.data.object;
      const customerId = invoice.customer;

      const userDetails = await getUserDetails(customerId);

      if (!userDetails?.id) {
        return new NextResponse("user not found", { status: 400 });
      }

      await adminDb.collection("users").doc(userDetails?.id).update({
        hasActiveSubscription: true,
      });
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object;
      const customerId = subscription.customer;

      if (
        subscription.status === "canceled" ||
        subscription.cancel_at_period_end
      ) {
        const userDetails = await getUserDetails(customerId);
        if (!userDetails?.id) {
          return new NextResponse("User not found", { status: 404 });
        }

        await adminDb.collection("users").doc(userDetails?.id).update({
          hasActiveSubscription: false,
        });
      }
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const customerId = subscription.customer;

      const userDetails = await getUserDetails(customerId);
      if (!userDetails?.id) {
        return new NextResponse("User not found", { status: 404 });
      }

      await adminDb.collection("users").doc(userDetails?.id).update({
        hasActiveSubscription: false,
      });
      break;
    }

    default:
      console.log(`unhandled event type ${event.type}`);
  }

  return NextResponse.json({ message: "webhook received" });
}
