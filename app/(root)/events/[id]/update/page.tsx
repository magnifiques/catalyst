import EventForm from "@/components/shared/EventForm";
import { getEventById } from "@/lib/mongodb/actions/Event.actions";
import { UpdateEventParams } from "@/types";
import { auth } from "@clerk/nextjs/server";
import React from "react";

type UpdateEventProps = {
  params: {
    id: string;
  };
};

const UpdateEvent = async ({ params: { id } }: UpdateEventProps) => {
  const event = await getEventById(id);

  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">
          Update An Event
        </h3>
      </section>
      <div className="wrapper my-8">
        <EventForm
          event={event}
          userId={userId}
          eventId={event._id}
          type="update"
        />
      </div>
    </>
  );
};

export default UpdateEvent;
