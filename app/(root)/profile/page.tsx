import Collection from "@/components/shared/Collection";
import { Button } from "@/components/ui/button";
import { getEventsByUser } from "@/lib/mongodb/actions/Event.actions";
import { getOrdersByUser } from "@/lib/mongodb/actions/Order.actions";
import { IOrder } from "@/lib/mongodb/models/Order.Model";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import React from "react";

const page = async () => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;
  console.log(userId);
  const orders = await getOrdersByUser({ userId, page: 1 });
  const orderedEvents = orders?.data.map((order: IOrder) => order.event || []);

  const organizedEvents = await getEventsByUser({ userId, page: 1 });
  return (
    <>
      {/* My Tickets */}
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left">My Tickets</h3>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href="/#events">Explore More Events</Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8 ">
        <Collection
          data={orderedEvents}
          emptyTitle="No Event Tickets purchased yet"
          emptySubtitle="No worries! - plenty of exciting events to explore"
          collectionType="My_Tickets"
          limit={3}
          page={1}
          urlParamName="ordersPage"
          totalPages={2}
        />
      </section>

      {/* My Events */}

      {/* Events organized */}
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left">Events Organized</h3>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href="/events/create">Create a new Event</Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8 ">
        <Collection
          data={organizedEvents?.data}
          emptyTitle="No events have been created yet"
          emptySubtitle="Create events"
          collectionType="Events_Organized"
          limit={6}
          page={1}
          urlParamName="eventsPage"
          totalPages={2}
        />
      </section>
    </>
  );
};

export default page;
