import stripePackage from "stripe";
import { NextResponse } from "next/server";
import { createOrder } from "@/lib/mongodb/actions/Order.actions";

// Initialize Stripe with your secret key
const stripe = new stripePackage(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(request: Request) {
  // Read the raw body as a buffer to verify the webhook signature
  const body = await request.text();

  // Retrieve the Stripe signature header
  const sig = request.headers.get("stripe-signature") as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event;

  try {
    // Construct the event using the raw body, signature, and secret
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error("Error verifying Stripe signature:", err);
    return NextResponse.json(
      { message: "Webhook error", error: err },
      { status: 400 }
    );
  }

  // Extract the event type
  const eventType = event.type;

  if (eventType === "checkout.session.completed") {
    // Destructure necessary fields from the event
    const { id, amount_total, metadata } = event.data.object as any;

    const order = {
      stripeId: id,
      eventId: metadata?.eventId || "",
      buyerId: metadata?.buyerId || "",
      totalAmount: amount_total ? (amount_total / 100).toString() : "0",
      createdAt: new Date(),
    };

    try {
      // Create the order in the database
      const newOrder = await createOrder(order);
      return NextResponse.json({ message: "OK", order: newOrder });
    } catch (dbError: any) {
      console.error("Error creating order in database:", dbError.message);
      return NextResponse.json(
        { message: "Database error", error: dbError.message },
        { status: 500 }
      );
    }
  }

  // Return a 200 status code for other event types
  return new Response("", { status: 200 });
}
