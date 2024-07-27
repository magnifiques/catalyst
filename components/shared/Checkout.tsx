"use client";
import React, { useCallback } from "react";
import { Button } from "../ui/button";
import { IEvent } from "@/lib/mongodb/models/Event.Model";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

import { loadStripe } from "@stripe/stripe-js";
import { checkoutOrder } from "@/lib/mongodb/actions/Order.actions";
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const Checkout = ({ event, userId }: { event: IEvent; userId: string }) => {
  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session
    return fetch("/api/checkout_sessions", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => data.clientSecret);
  }, []);

  const options = { fetchClientSecret };

  const onCheckout = async () => {
    const order = {
      eventTitle: event.title,
      eventId: event._id,
      price: event.price,
      isFree: event.isFree,
      buyerId: userId,
    };

    await checkoutOrder(order);
  };
  return (
    <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
      <form action={onCheckout} method="POST">
        <Button type="submit" role="link" size="lg" className="button sm:w-fit">
          {event.isFree ? "Get Tickets" : "Buy Tickets"}
        </Button>
      </form>
    </EmbeddedCheckoutProvider>
  );
};

export default Checkout;
