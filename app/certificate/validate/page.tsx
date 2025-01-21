'use client';
import { config } from '@/utils/config';
// Validate Certificate
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Flex, Table } from '@radix-ui/themes';
import { readContract } from '@wagmi/core';
import React, { Fragment, useState } from 'react'
import { useForm } from 'react-hook-form';
import contractABI from '@/utils/abi/certify.json';
import { z } from 'zod';
import { useAccount } from 'wagmi';
import { sepolia } from 'viem/chains';

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
  const [certificateData, setCertificateData] = useState<any | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const { address } = useAccount();
  const CONTRACT_ADDRESS = '0x7eb9193dFAa562E7d8Fc0D236111CB03aF7a8b01';

  const fetchCollegeDetails = async (certificateId: number) => {
    if (!address || !certificateId) return;

    try {
      const certificatedata = await readContract(config, {
        abi: contractABI,
        address: CONTRACT_ADDRESS as `0x${string}`,
        functionName: 'getCertificateById',
        chainId: sepolia.id,
        account: address,
        args: [
          certificateId
        ]
      });
      setCertificateData(certificatedata);
    } catch (err: any) {
      console.error('Error fetching data:', err);
    }
  }

  // Form submission handler
  const onSubmit = (data: FormData) => {
    fetchCollegeDetails(data.certificateId);
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

          {/* Certificate Data */}
          {
            certificateData && (
              <Flex className='w-full mt-4' justify={'center'}>
                <Flex direction="column" gap="5" maxWidth="350px" justify={'center'}>
                  <Table.Root>
                    <Table.Body>

                      <Table.Row>
                        <Table.RowHeaderCell>Student Name</Table.RowHeaderCell>
                        <Table.Cell>{certificateData.studentName}</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.RowHeaderCell>Course Name</Table.RowHeaderCell>
                        <Table.Cell>{certificateData.courseName}</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.RowHeaderCell>Percentage</Table.RowHeaderCell>
                        <Table.Cell>{certificateData.studentPercentage} %</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.RowHeaderCell>Certificate ID</Table.RowHeaderCell>
                        <Table.Cell>{certificateData.certificateId}</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.RowHeaderCell>College Name</Table.RowHeaderCell>
                        <Table.Cell>{certificateData.collegeName}</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.RowHeaderCell>College ID</Table.RowHeaderCell>
                        <Table.Cell>{certificateData.collegeId}</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.RowHeaderCell>Issue Date</Table.RowHeaderCell>
                        <Table.Cell>{certificateData.issueDate}</Table.Cell>
                      </Table.Row>

                    </Table.Body>
                  </Table.Root>
                </Flex>
              </Flex>
            )
          }
        </form>

        {/* Certificate */}
        {
          (certificateData) && (
            <Flex justify={'center'} align={'center'}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="500"
                height="600"
                viewBox="0 0 800 600"
                style={{
                  borderRadius: '15px',
                  fontFamily: 'Arial, sans-serif',
                }}
              >
                {/* Outer border */}
                <rect x="20" y="20" width="760" height="560" rx="15" fill="none" stroke="#9333EA" strokeWidth="8" />

                {/* Title */}
                <text x="400" y="100" textAnchor="middle" fill="#9333EA" fontSize="40" fontWeight="bold">
                  Certificate of Completion
                </text>

                {/* Subtitle */}
                <text x="400" y="150" textAnchor="middle" fill="#555" fontSize="20" fontStyle="italic">
                  This certificate is proudly presented to
                </text>

                {/* Student Name */}
                <text id="studentName" x="400" y="200" textAnchor="middle" fontSize="30" fontWeight="bold" fill="#9333EA">
                  {certificateData.studentName}
                </text>

                {/* Main Text - Using foreignObject for wrapping */}
                <foreignObject x="100" y="220" width="600" height="300">
                  <div style={{ fontSize: '16px', color: '#555', textAlign: 'center', lineHeight: '1.5' }}>
                    This is to certify that the student has successfully completed the <strong>{certificateData.courseName}</strong> program at
                    <strong> {certificateData.collegeName}</strong>, bearing  College ID <strong>{certificateData.collegeId}</strong>. The program was conducted
                    with the highest standards of academic excellence, equipping the student with essential skills and knowledge in the respective
                    field of study.
                    <br /><br />
                    The certificate is being issued on <strong>{certificateData.issueDate}</strong>, as a recognition of the student’s dedication, hard
                    work, and successful achievement in fulfilling all the requirements of the program.
                  </div>
                </foreignObject>

                {/* Signature line */}
                <text x="400" y="450" textAnchor="middle" fill="#9333EA" fontSize="14">
                  Obtained score is {certificateData.studentPercentage}%
                </text>
                <line x1="200" y1="470" x2="600" y2="470" stroke="#4a90e2" strokeWidth="2" strokeDasharray="5,5" />

                {/* Footer text */}
                <text x="400" y="500" textAnchor="middle" fill="#9333EA" fontSize="14">
                  {(certificateData.certificateId) ? `Authenticated Certificate ID is ${certificateData.certificateId}` : 'Certificate ID not issued'}
                </text>
                <text x="400" y="530" textAnchor="middle" fill="#333" fontSize="14">
                  This certificate is digitally verified and authenticated.
                </text>
              </svg>
            </Flex>
          )
        }
      </section>
    </Fragment>
  )
}

export default ValidateCertificate
