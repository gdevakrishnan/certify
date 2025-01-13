'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@radix-ui/themes';
import React, { Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Schema for form validation
const formSchema = z.object({
  certificateId: z
    .string()
    .refine(value => !isNaN(Number(value)), { message: "Certificate ID must be a valid number" })
    .transform(value => Number(value))
    .refine(value => value > 0, { message: "Certificate ID must be a positive number" }),

  collegeId: z
    .string()
    .refine(value => !isNaN(Number(value)), { message: "College ID must be a valid number" })
    .transform(value => Number(value))
    .refine(value => value > 0, { message: "College ID must be a positive number" }),

  collegeName: z.string().min(1, { message: "College Name is required" }),
  
  studentName: z.string().min(1, { message: "Student Name is required" }),
  
  studentPercentage: z
    .string()
    .regex(/^\d+(\.\d+)?$/, { message: "Student Percentage must be a valid number" }),

  courseName: z.string().min(1, { message: "Course Name is required" }),

  issueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Issue Date must be in YYYY-MM-DD format" })
    .refine(value => {
      const date = new Date(value);
      return date instanceof Date && !isNaN(date.getTime());
    }, { message: "Issue Date must be a valid date in YYYY-MM-DD format" })
});

// Types for form data
type FormData = z.infer<typeof formSchema>;

// Form Component
const GenerateCertificate = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  // Form submission handler
  const onSubmit = (data: FormData) => {
    console.log("Form Data:", data);
  };

  // Fields configuration
  const fields = [
    { label: "Certificate ID", id: "certificateId", type: "text", placeholder: "Enter Certificate ID" },
    { label: "College ID", id: "collegeId", type: "text", placeholder: "Enter College ID" },
    { label: "College Name", id: "collegeName", type: "text", placeholder: "Enter College Name" },
    { label: "Student Name", id: "studentName", type: "text", placeholder: "Enter Student Name" },
    { label: "Student Percentage", id: "studentPercentage", type: "text", placeholder: "Enter Student Percentage" },
    { label: "Course Name", id: "courseName", type: "text", placeholder: "Enter Course Name" },
    { label: "Issue Date", id: "issueDate", type: "date", placeholder: "Select Issue Date" },
  ];

  return (
    <Fragment>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 max-w-md mx-auto my-8 rounded shadow-lg flex flex-col border-2"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">Generate Certificate</h2>
        
        {fields.map(field => (
          <div key={field.id} className="mb-4 grid">
            <label htmlFor={field.id} className="mb-2 text-sm font-medium">
              {field.label}
            </label>
            <input
              id={field.id}
              {...register(field.id as keyof FormData)}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${
                errors[field.id as keyof FormData] ? "border-red-500" : "focus:ring-blue-500"
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
          Generate
        </Button>
      </form>
    </Fragment>
  );
};

export default GenerateCertificate;
