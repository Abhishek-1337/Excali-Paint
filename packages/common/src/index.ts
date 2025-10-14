import * as z from "zod";

export const SignupUserSchema = z.object({
    email: z.string().email(),
    username: z.string(),
    password: z.string,
    name: z.string
});

export const SigninUserSchema = z.object({
    username: z.string(),
    password: z.string()
});

export const CreateRoomSchema = z.object({
    name: z.string(),
    slug: z.string()
})