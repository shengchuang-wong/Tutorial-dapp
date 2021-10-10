import React from 'react'

import tetherImage from '../tether.png'

const Main = ({
  tetherBalance,
  rwdBalance,
  stakingBalance,
  stakeTokens,
  unstakeTokens,
}) => {

  const { web3 } = window

  const submitForm = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target )
    let amount = formData.get('amount')
    amount = web3.utils.toWei(amount, 'Ether')
    stakeTokens(amount)
  }

  return (
    <div id='content' className='mt-3'>
      <table className='table text-muted text-center'>
        <thead>
          <tr style={{ color: 'black' }}>
            <th scope='col'>Staking Balance</th>
            <th scope='col'>Reward Balance</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ color: 'black' }}>
            <td>{web3.utils.fromWei(stakingBalance, 'Ether')} USDT</td>
            <td>{web3.utils.fromWei(rwdBalance, 'Ether')} RWD</td>
          </tr>
        </tbody>
      </table>
      <div className='card mb-2' style={{ opacity: '.9' }}>
        <form onSubmit={submitForm} className='mb-3'>
          <div style={{ borderSpacing: '0 1em' }}>
            <label className='float-left' style={{ marginLeft: '15px' }}><b>Stake Tokens</b></label>
            <label className='float-right' style={{ marginRight: '8px' }}>Balance: {web3.utils.fromWei(tetherBalance, 'Ether')}</label>
            <div className='input-group mb-4'>
              <input type='text' placeholder='0' name='amount' required />
              <div className='input-group-open'>
                <div className='input-group-text'>
                  <img src={tetherImage} alt='tether' height='32' />
                  &nbsp;&nbsp;&nbsp;USDT
                </div>
              </div>
            </div>
            <button type='submit' className='btn btn-primary btn-lg btn-block'>DEPOSIT</button>
          </div>
        </form>
        <button onClick={() => unstakeTokens()} className='btn btn-primary btn-lg btn-block'>WITHDRAW</button>
        <div className='card-body text-center' style={{color: 'blue'}}>
          AIRDROP
        </div>
      </div>
    </div>
  )
}

export default Main