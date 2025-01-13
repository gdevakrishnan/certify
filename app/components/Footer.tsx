'use client';
import React from 'react';
import { Box, Text, Link, Flex } from '@radix-ui/themes';

const Footer = () => {
    return (
        <Flex direction={'column'} align={'center'} justify={'center'} gap={'2'} className='py-4 border-t-2'>
            <Text align={'center'}>
                Certify - Designed and developed by{' '}
                <Link href="https://www.linkedin.com/in/deva-krishnan-52981a245/" target="_blank">
                    Devakrishnan Gopal
                </Link>
            </Text>
            <Text align={'center'}>
                &copy; {new Date().getFullYear()} Certify. All Rights Reserved.
            </Text>
        </Flex>
    );
};

export default Footer;
