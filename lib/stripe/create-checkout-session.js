"use server";

import { auth } from "@clerk/nextjs/server";
import { stripe } from "./stripe";
import { adminDb } from "@/config/FirebaseAdminConfig";

export async function createCheckoutSession(userDetails) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found");
  }

  const userRef = adminDb.collection("users").doc(userDetails.email);
  
  try {
    const userDoc = await userRef.get();
    let stripeCustomerId;

    if (!userDoc.exists) {
      const customer = await stripe.customers.create({
        email: userDetails.email,
        name: userDetails.name,
        metadata: {
          userId,
          clerkUserId: userId
        },
      });

      await userRef.set({
        email: userDetails.email,
        name: userDetails.name,
        stripeCustomerId: customer.id,
        avatar: userDetails?.avatar || "",
      }, { merge: true });

      stripeCustomerId = customer.id;
    } else {
      if (!userDoc.data()?.stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: userDetails.email,
          name: userDetails.name,
          metadata: {
            userId,
            clerkUserId: userId
          },
        });

        await userRef.update({
          stripeCustomerId: customer.id
        });

        stripeCustomerId = customer.id;
      } else {
        stripeCustomerId = userDoc.data().stripeCustomerId;
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: "price_1Qt9GzSC3SzWTkQ2PquA7Xpa",
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer: stripeCustomerId,
      success_url: `${process.env.HOST_URL}/pricing`,
      cancel_url: `${process.env.HOST_URL}`,
      metadata: {
        userId,
        userEmail: userDetails.email
      }
    });

    return session.id;
  } catch (error) {
    console.error('Error in createCheckoutSession:', error);
    throw new Error('Failed to create checkout session');
  }
}