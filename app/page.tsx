import { Box, Heading, Text } from "@radix-ui/themes";
import React, { Fragment } from 'react';
import Squares from "./components/Squares";

const page = () => {
  return (
    <Fragment>
      <div className="flex flex-col items-center justify-center h-[100vh] relative">
        <Squares
          speed={0.5}
          squareSize={100}
          direction='diagonal' // up, down, left, right, diagonal
        />
        <Box className="flex flex-col items-center justify-center h-auto w-[300px] py-10 px-5 absolute top-[30vh] backdrop-blur-sm shadow-xl space-y-4">
          <Heading as='h1' size="9" className="text-center">Certify</Heading>
          <Box className="text-center">
            <Text className="text-center">Certificate generation and validation using Web3</Text>
          </Box>
        </Box>
      </div>
    </Fragment>
  )
}

export default page;
