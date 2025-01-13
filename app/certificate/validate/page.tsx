'use client';
// Validate Certificate
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@radix-ui/themes'
import React, { Fragment } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Schema for form validation
const formSchema = z.object({
  certificateId: z
    .string()
    .refine(value => !isNaN(Number(value)), { message: "Certificate ID must be a valid number" })
    .transform(value => Number(value))
    .refine(value => value > 0, { message: "Certificate ID must be a positive number" })
});

// Types for form data
type FormData = z.infer<typeof formSchema>;

const ValidateCertificate = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  // Form submission handler
  const onSubmit = (data: FormData) => {
    console.log("Form Data:", data);
  };

  // Fields configuration
  const fields = [
    { label: "Certificate ID", id: "certificateId", type: "text", placeholder: "Enter Certificate ID" }
  ];

  return (
    <Fragment>
      <section className="min-h-screen w-full">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 max-w-md mx-auto my-8 rounded shadow-lg flex flex-col border-2"
        >
          <h2 className="text-xl font-semibold mb-4 text-center">Validate Certificate</h2>

          {fields.map(field => (
            <div key={field.id} className="mb-4 grid">
              <label htmlFor={field.id} className="mb-2 text-sm font-medium">
                {field.label}
              </label>
              <input
                id={field.id}
                {...register(field.id as keyof FormData)}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${errors[field.id as keyof FormData] ? "border-red-500" : "focus:ring-blue-500"
                  }`}
                type={field.type}
                placeholder={field.placeholder}
              />
              {errors[field.id as keyof FormData] && (
                <p className="mt-1 text-xs text-red-500">
                  {errors[field.id as keyof FormData]?.message}
                </p>
              )}
            </div>
          ))}

          <Button type="submit" className="w-full px-4 py-4 bg-accent rounded hover:bg-accent-600">
            Validate
          </Button>
        </form>
      </section>
    </Fragment>
  )
}

export default ValidateCertificate
