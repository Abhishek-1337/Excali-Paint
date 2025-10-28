import * as z from "zod";

export const SignupUserSchema = z.object({
    email: z.string().email(),
    name: z.string(),
    password: z.string(),
    // name: z.string()
});

export const SigninUserSchema = z.object({
    name: z.string(),
    password: z.string()
});

export const CreateRoomSchema = z.object({
    slug: z.string()
});