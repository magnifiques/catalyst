import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoutes = createRouteMatcher([
  "/",
  "/events/:id",
  "/api/webhooks/clerk",
  "/api/webhooks/stripe",
  "/api/uploadthing",
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoutes(req)) auth().protect();
});
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
