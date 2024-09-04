import { initTRPC, TRPCError } from "@trpc/server";
import SuperJSON from "superjson";
import { ZodError } from "zod";

import { Context } from "./context";

const t = initTRPC.context<Context>().create({
  transformer: SuperJSON,
  errorFormatter(opts) {
    const { shape, error } = opts;
    return {
      ...shape,
      data: {
        ...shape.data,
        cause: error.cause?.message,
        zodError:
          error.code === "BAD_REQUEST" && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    };
  },
});

export const { router, middleware, createCallerFactory } = t;

const isAuthed = middleware(({ next, ctx }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({ ctx: { session: ctx.session } });
});

const isAdmin = middleware(({ next, ctx }) => {
  if (ctx.session?.user.role !== "ADMIN") {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({ ctx: { session: ctx.session } });
});

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
export const adminProcedure = t.procedure.use(isAuthed).use(isAdmin);
