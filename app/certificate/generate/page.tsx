'use client';

import { config } from '@/utils/config';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Flex, Text } from '@radix-ui/themes';
import { readContract } from '@wagmi/core';
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, FieldErrors } from 'react-hook-form';
import { useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { useWriteContract } from 'wagmi';
import contractABI from '@/utils/abi/certify.json';
import { z } from 'zod';
import { sepolia } from 'viem/chains';
import { useWatchContractEvent } from 'wagmi';

// Schema for form validation
const formSchema = z.object({
  collegeId: z
    .string()
    .refine((value) => !isNaN(Number(value)), { message: 'College ID must be a valid number' })
    .transform((value) => Number(value))
    .refine((value) => value > 0, { message: 'College ID must be a positive number' }),
  collegeName: z.string().min(1, { message: 'College Name is required' }),
  studentName: z.string().min(1, { message: 'Student Name is required' }),
  studentPercentage: z
    .string()
    .regex(/^\d+(\.\d+)?$/, { message: 'Student Percentage must be a valid number' }),
  courseName: z.string().min(1, { message: 'Course Name is required' }),
  issueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Issue Date must be in YYYY-MM-DD format' })
    .refine(
      (value) => {
        const date = new Date(value);
        return date instanceof Date && !isNaN(date.getTime());
      },
      { message: 'Issue Date must be a valid date in YYYY-MM-DD format' }
    ),
});

// Types for form data
type FormData = z.infer<typeof formSchema>;

const GenerateCertificate = () => {
  const [certificateData, setCertificateData] = useState<FormData | null>(null);
  const [transactionStatus, setTransactionStatus] = useState<string | null>(null);
  const [certificateId, setCertificateId] = useState<bigint | null>(null);

  // Memorize the fields for better performance
  const fields = useMemo(
    () => [
      { label: 'College ID', id: 'collegeId', type: 'text', placeholder: 'Enter College ID' },
      { label: 'College Name', id: 'collegeName', type: 'text', placeholder: 'Enter College Name' },
      { label: 'Student Name', id: 'studentName', type: 'text', placeholder: 'Enter Student Name' },
      { label: 'Student Percentage', id: 'studentPercentage', type: 'text', placeholder: 'Enter Student Percentage' },
      { label: 'Course Name', id: 'courseName', type: 'text', placeholder: 'Enter Course Name' },
      { label: 'Issue Date', id: 'issueDate', type: 'date', placeholder: 'Select Issue Date' },
    ],
    []
  );

  // Web3
  // Is the college was registered or not
  const CONTRACT_ADDRESS = '0x96EC6272b3bD0c5934b150dc8ca9ea4FF0009BeA';
  const { address } = useAccount();

  const { data: hash, error: writeError, isPending, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // Fetch college ID
  const fetchCollegeId = async () => {
    if (!address) return;

    try {
      const collegeid = await readContract(config, {
        abi: contractABI,
        address: CONTRACT_ADDRESS as `0x${string}`,
        functionName: 'getCollegeIdByAddress',
        chainId: sepolia.id,
        account: address,
        args: [
          address
        ]
      });

      return (typeof collegeid == "bigint" ? collegeid : null);
    } catch (err: any) {
      console.error('Error fetching data:', err);
    }
  }

  // Watch contract events
  useWatchContractEvent({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: contractABI,
    eventName: 'certificateGenerated',
    onLogs(logs) {
      setCertificateId((logs[0] as any).args.certificateId);
      if ((logs[0] as any).args.certificateId) {
        console.log("Certificate generated successfully!!!");
      }
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  // Form submission handler
  const onSubmit = useCallback(
    async (data: FormData) => {
      setCertificateData(data);
      const collegeId = await fetchCollegeId();

      if (!collegeId || collegeId < 1) return console.log("College ID not found");
      if (parseInt(data?.collegeId?.toString() || '') != parseInt(collegeId.toString()))
        return console.log("College ID Mismatch");

      setTransactionStatus(null); // Reset status on new submission

      try {
        await writeContract({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: contractABI,
          functionName: 'generateCertificate',
          args: [
            data.collegeId,
            data.collegeName,
            data.studentName,
            data.studentPercentage,
            data.courseName,
            data.issueDate
          ],
        });

        setTransactionStatus('Transaction submitting! please wait...');
      } catch (e) {
        setTransactionStatus(`Error: ${(e as any)?.message}`);
      }
    }, [writeContract]
  )

  // Update transaction status on success or error
  useEffect(() => {
    if (isConfirmed) {
      setTransactionStatus('Transaction confirmed successfully!');
    } else if (writeError) {
      setTransactionStatus(`Error: ${writeError.message}`);
    }

    if (isConfirmed || writeError) {
      setTimeout(() => {
        setTransactionStatus(null);
      }, 3000);
    }
  }, [isConfirmed, writeError]);

  const renderError = (fieldId: keyof FormData, fieldErrors: FieldErrors<FormData>) => {
    const error = fieldErrors[fieldId];
    return error ? <p className="mt-1 text-xs text-red-500">{error.message}</p> : null;
  };

  return (
    <Fragment>
      <section className="min-h-screen w-full">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 max-w-md mx-auto my-8 rounded shadow-lg flex flex-col border-2"
        >
          <h2 className="text-xl font-semibold mb-4 text-center">Generate Certificate</h2>

          {fields.map((field) => (
            <div key={field.id} className="mb-4 grid">
              <label htmlFor={field.id} className="mb-2 text-sm font-medium">
                {field.label}
              </label>
              <input
                id={field.id}
                {...register(field.id as keyof FormData)}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${errors[field.id as keyof FormData] ? 'border-red-500' : 'focus:ring-blue-500'
                  }`}
                type={field.type}
                placeholder={field.placeholder}
              />
              {renderError(field.id as keyof FormData, errors)}
            </div>
          ))}

          <Button type="submit" className="w-full px-4 py-4 bg-accent rounded hover:bg-accent-600">
            Generate
          </Button>
          {transactionStatus && (
            <Text align={'center'}
              className={`mt-4 text-center text-sm ${transactionStatus.startsWith('Error') ? 'text-red-500' : 'text-green-500'
                }`}
            >
              {transactionStatus.startsWith('Error') ? "Error occured" : transactionStatus}
            </Text>
          )}
        </form>
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
                <line x1="200" y1="450" x2="600" y2="450" stroke="#4a90e2" strokeWidth="2" strokeDasharray="5,5" />

                {/* Footer text */}
                {
                  <text x="400" y="500" textAnchor="middle" fill="#9333EA" fontSize="14">
                    {(certificateId) ?  `Authenticated Certificate ID is ${certificateId}` : 'Certificate ID not issued' }
                  </text>
                }
                <text x="400" y="530" textAnchor="middle" fill="#333" fontSize="14">
                  This certificate is digitally verified and authenticated.
                </text>
              </svg>
            </Flex>
          )
        }

      </section>
    </Fragment>
  );
};

export default GenerateCertificate;
