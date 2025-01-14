import React, { Fragment } from 'react'
import { WalletOptions } from '../components/WalletOption'
import { WalletInfo } from '../components/WalletInfo'

const connectPage = () => {
  return (
    <Fragment>
        <WalletOptions />
        <WalletInfo />
    </Fragment>
  )
}

export default connectPage
