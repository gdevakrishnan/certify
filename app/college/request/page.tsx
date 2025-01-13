'use client';
import React, { Fragment } from "react";
import { Button } from "@radix-ui/themes";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Define Zod schema for validation
const formSchema = z.object({
  collegeName: z.string().min(1, { message: "College Name is required" }),
  collegeDistrict: z.string().min(1, { message: "College District is required" }),
  collegeState: z.string().min(1, { message: "College State is required" }),
  collegeEmail: z.string().email({ message: "Invalid Email Address" }),
  collegePhNo: z
    .string()
    .min(1, { message: "College Phone Number is required" })
    .regex(/^\d+$/, { message: "Phone Number must contain only numbers" }),
  collegePinCode: z
    .string()
    .min(1, { message: "College Pin Code is required" })
    .regex(/^\d+$/, { message: "Pin Code must contain only numbers" }),
});

type FormData = z.infer<typeof formSchema>;

const CollegeRequests = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    console.log("Form Data:", data);
  };

  const fields = [
    { label: "College Name", id: "collegeName", type: "text", placeholder: "College Name" },
    { label: "College District", id: "collegeDistrict", type: "text", placeholder: "College District" },
    { label: "College State", id: "collegeState", type: "text", placeholder: "College State" },
    { label: "College Email", id: "collegeEmail", type: "email", placeholder: "College Email" },
    { label: "College Phone Number", id: "collegePhNo", type: "text", placeholder: "College Phone Number" },
    { label: "College Pin Code", id: "collegePinCode", type: "text", placeholder: "College Pin Code" },
  ];

  return (
    <Fragment>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 max-w-md mx-auto my-8 rounded shadow-lg flex flex-col border-2"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">College Requests</h2>
        {fields.map((field) => (
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
        <Button type="submit" className="w-full px-4 py-2 bg-accent rounded hover:bg-accent-600">
          Get Access
        </Button>
      </form>
    </Fragment>
  );
};

export default CollegeRequests;
