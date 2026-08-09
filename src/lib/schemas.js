import { z } from 'zod';

export const AppealSchema = z.object({
    subject: z.string().describe("The subject line of the appeal email in English"),
    bodyEnglish: z.string().describe("The full appeal email body in professional English"),
    bodyUrdu: z.string().describe("The full appeal email body in professional Urdu (Unicode script)"),
    instructionsForUser: z.string().describe("Short user instructions on how to submit this appeal to LinkedIn")
});

export const SignatureSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email").optional(),
    linkedinUrl: z.string().url("Please enter a valid LinkedIn URL").optional(),
    documentType: z.string(),
    message: z.string().optional()
});