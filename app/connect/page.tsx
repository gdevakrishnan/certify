import { WalletInfo } from '@/components/WalletInfo'
import { WalletOptions } from '@/components/WalletOption'
import React, { Fragment } from 'react'

const connectPage = () => {
  return (
    <Fragment>
        <WalletOptions />
        <WalletInfo />
    </Fragment>
  )
}

export default connectPage
