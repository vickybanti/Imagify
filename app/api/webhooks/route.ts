/* eslint-disable camelcase */
import { WebhookEvent } from "@clerk/nextjs/server";
import { createClerkClient } from '@clerk/backend'
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

import { createUser, deleteUser, updateUser } from "@/lib/actions/user.actions";

export async function POST(req: Request) {
  // Ensure the webhook secret is provided
  const WEBHOOK_SECRET = process.env.SIGNING_SECRET;


const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If headers are missing, return an error response
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- missing svix headers", {
      status: 400,
    });
  }

  // Get the body of the request
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with the webhook secret
  const webhook = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the webhook payload
  try {
    evt = webhook.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred during verification", {
      status: 400,
    });
  }

  // Extract the event type and data
  const eventType = evt.type;
  const { id } = evt.data;
  console.log(id)

  try {

    // Handle "user.created" event
    if (eventType === "user.created") {
      const {id, email_addresses, image_url, first_name, last_name, username } = evt.data;


      const user = {
        clerkId: id,
    email: email_addresses[0]?.email_address || "", // Fallback for email
    username: username ?? "", // Default to an empty string if null/undefined
    firstName: first_name ?? "",
    lastName: last_name ?? "",
    photo: image_url,
    planId: 1, // Provide default value as defined in schema
    creditBalance: 10, // Provide default value as defined in schema
        
      };

      const newUser = await createUser(user);

      // Update public metadata with Clerk client
      if (newUser) {
        if (id) {
          await clerkClient.users.updateUserMetadata(id, {
            publicMetadata: {
              userId: newUser._id,
            },
          });
        } else {
          throw new Error("User ID is not defined");
        }

      return NextResponse.json({ message: "User created successfully", user: newUser });
    }
  }
    // Handle "user.updated" event
    if (eventType === "user.updated") {
      const { id, image_url, first_name, last_name, username } = evt.data;


      const user = {
        firstName: first_name ?? "",
        lastName: last_name ?? "",
        username: username ?? "",
        photo: image_url,
      };
      if(id){
        const updatedUser = await updateUser(id, user);

        return NextResponse.json({ message: "User updated successfully", user: updatedUser });

      }

    }

    // Handle "user.deleted" event
    if (eventType === "user.deleted") {
      const {id} = evt.data;
      if (id) {
      const deletedUser = await deleteUser(id);

      return NextResponse.json({ message: "User deleted successfully", user: deletedUser });
   
       }
       }

    // Log unhandled event types
    console.log(`Unhandled webhook event: ID = ${id}, Type = ${eventType}`);
    console.log("Webhook body:", body);

    return new Response("Event type not handled", { status: 200 });
  } catch (error) {
    console.error("Error handling webhook event:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
