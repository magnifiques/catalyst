"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useUploadThing } from "@/lib/uploadthing";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { z } from "zod";
import { authFormSchema } from "@/lib/validator";
import { eventDefaultValues } from "@/constants";
import Dropdown from "./Dropdown";
import { Textarea } from "../ui/textarea";
import FileUploader from "./FileUploader";
import Image from "next/image";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { Checkbox } from "../ui/checkbox";
import { useRouter } from "next/navigation";
import { createEvent } from "@/lib/mongodb/actions/Event.actions";

type EventFormProps = {
  userId: string;
  type: "create" | "update";
};

const EventForm = ({ userId, type }: EventFormProps) => {
  const defaultValues = eventDefaultValues;
  const router = useRouter();

  const { startUpload } = useUploadThing("imageUploader");
  // 1. Define your form.
  const form = useForm<z.infer<typeof authFormSchema>>({
    resolver: zodResolver(authFormSchema),
    defaultValues,
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof authFormSchema>) {
    let uploadedImageUrl = values.imgUrl;

    if (files.length > 0) {
      const uploadedImages = await startUpload(files);

      if (!uploadedImages) return;

      uploadedImageUrl = uploadedImages[0].url;
    }

    if (type === "create") {
      try {
        const newEvent = await createEvent({
          event: { ...values, imgUrl: uploadedImageUrl },
          userId,
          path: "/profile",
        });
        if (newEvent) {
          form.reset();
          router.push(`/events/${newEvent._id}`);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  const [files, setFiles] = useState<File[]>([]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col gap-6 md:flex-row">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Event Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Select Category</FormLabel>
                <FormControl>
                  <Dropdown
                    onChangeHandler={field.onChange}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-6 md:flex-row">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Description</FormLabel>
                <FormControl className="h-20">
                  <Textarea
                    placeholder="Description goes here..."
                    className="textarea rounded-2xl"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-6 md:flex-row">
          <FormField
            control={form.control}
            name="imgUrl"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Upload Image for the event</FormLabel>
                <FormControl className="h-20">
                  <FileUploader
                    onFieldChange={field.onChange}
                    imageUrl={field.value}
                    setFiles={setFiles}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-6 md:flex-row">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <div className="flex-center w-full overflow-hidden h-[54px] rounded-full bg-gray-50 px-4 py-2">
                    <Image
                      src="/assets/icons/location-grey.svg"
                      alt="Calender"
                      height={24}
                      width={24}
                    />
                    <Input
                      placeholder="Event Location"
                      {...field}
                      className="input-field"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-6 md:flex-row">
          <FormField
            control={form.control}
            name="startDateTime"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center w-full overflow-hidden h-[54px] rounded-full bg-gray-50 px-4 py-2">
                    <Image
                      src="/assets/icons/calendar.svg"
                      alt="Calendar"
                      height={24}
                      className="filter-grey"
                      width={24}
                    />
                    <p className="ml-3 whitespace-nowrap text-gray-500">
                      Start Date
                    </p>
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date) => field.onChange(date)}
                      showTimeSelect
                      timeInputLabel="Time:"
                      dateFormat="MM/dd/yyyy h:mm aa"
                      wrapperClassName="datePicker"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDateTime"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center w-full overflow-hidden h-[54px] rounded-full bg-gray-50 px-4 py-2">
                    <Image
                      src="/assets/icons/calendar.svg"
                      alt="Calendar"
                      height={24}
                      className="filter-grey"
                      width={24}
                    />
                    <p className="ml-3 whitespace-nowrap text-gray-500">
                      End Date
                    </p>
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date) => field.onChange(date)}
                      showTimeSelect
                      timeInputLabel="Time:"
                      dateFormat="MM/dd/yyyy h:mm aa"
                      wrapperClassName="datePicker"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-6 md:flex-row">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center w-full overflow-hidden h-[54px] rounded-full bg-gray-50 px-4 py-2">
                    <Image
                      src="/assets/icons/dollar.svg"
                      alt="price"
                      height={24}
                      className="filter-grey"
                      width={24}
                    />
                    <p className="ml-3 whitespace-nowrap text-gray-500">
                      Ticket Price
                    </p>
                    <Input
                      type="number"
                      placeholder="Price"
                      {...field}
                      className="p-regular-16 border-0 bg-gray-50 outline-offset-0 focus:bottom-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <FormField
                      control={form.control}
                      name="isFree"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex items-center ">
                              <label
                                htmlFor="isFree"
                                className="whitespace-nowrap pr-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Free Ticket
                              </label>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                id="isFree"
                                className="mr-2 h-5 w-5 border-2 border-primary-500"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-6 md:flex-row">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center w-full overflow-hidden h-[54px] rounded-full bg-gray-50 px-4 py-2">
                    <Image
                      src="/assets/icons/link.svg"
                      alt="url"
                      height={24}
                      className="filter-grey"
                      width={24}
                    />
                    <p className="ml-3 whitespace-nowrap text-gray-500">Url</p>
                    <Input
                      type="URL"
                      placeholder="Enter the url"
                      {...field}
                      className="p-regular-16 border-0 bg-gray-50 outline-offset-0 focus:bottom-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="button col-span-2 w-full"
        >
          {form.formState.isSubmitting
            ? "Submitting..."
            : `${type === "create" ? "Create" : "Update"} Event`}
        </Button>
      </form>
    </Form>
  );
};

export default EventForm;
