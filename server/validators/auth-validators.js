const { z } = require("zod");

const signupSchema = z.object({
    username: z
        .string({ required_error: "Name is required" })
        .trim()
        .min(3, { message: "Name must be at least 3 characters" })
        .max(50, { message: "Name must not be more than 50 characters" }),

    email: z
        .string({ required_error: "Email is required" })
        .email({ message: "Invalid email format" })
        .min(3, { message: "Name must be at least 3 characters" })
        .max(50, { message: "Name must not be more than 50 characters" }),

    password: z
        .string({ required_error: "Password is required" })
        .min(8, { message: "Password must be at least 8 characters" })
        .max(50, { message: "Password must not be more than 50 characters" }),
});

module.exports = signupSchema;
