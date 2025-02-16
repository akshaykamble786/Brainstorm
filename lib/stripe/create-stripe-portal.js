"use server";

import { adminDb } from "@/config/FirebaseAdminConfig";
import { auth, currentUser } from "@clerk/nextjs/server";
import { stripe } from "./stripe";

export async function createStripePortal() {
  try {
    auth().protect();
    
    const user = await currentUser();
    
    if (!user) {
      throw new Error("Unauthorized: User not found");
    }

    const userDetails = {
      email: user.emailAddresses[0].emailAddress,
      name: `${user.firstName} ${user.lastName}`,
      avatar: user.imageUrl
    };

    const userDoc = await adminDb.collection("users").doc(userDetails.email).get();
    const userData = userDoc.data();

    if (!userData?.stripeCustomerId) {
      throw new Error("Stripe customer ID not found");
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: userData.stripeCustomerId,
      return_url: `${process.env.HOST_URL}/pricing`,
    });

    return session.url;
  } catch (error) {
    console.error("Error creating stripe portal:", error);
  }
}