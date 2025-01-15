import { WalletInfo } from '@/components/WalletInfo'
import { WalletOptions } from '@/components/WalletOption'
import React, { Fragment } from 'react'

const connectPage = () => {
  return (
    <Fragment>
      <section className='min-h-screen'>
        <WalletOptions />
        {/* <WalletInfo /> */}
      </section>
    </Fragment>
  )
}

export default connectPage
