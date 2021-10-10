import React, { useState, useEffect } from 'react'
import Web3 from 'web3'

import Tether from '../truffle_abis/Tether.json'
import RWD from '../truffle_abis/RWD.json'
import DecentralBank from '../truffle_abis/DecentralBank.json'
import NavBar from './Navbar'
import Main from './Main'
import './App.css'

const App = () => {
  const [account, setAccount] = useState('0x0')
  const [tether, setTether] = useState({})
  const [rwd, setRwd] = useState({})
  const [decentralBank, setDecentralBank] = useState({})
  const [tetherBalance, setTetherBalance] = useState('0')
  const [rwdBalance, setRwdBalance] = useState('0')
  const [stakingBalance, setStakingBalance] = useState('0')
  const [loading, setLoading] = useState(true)

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert('No etereum browser detected! You can check out MetaMask!')
    }
  }

  const loadBlockchainData = async () => {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    setAccount(accounts[0])
  }

  const loadTetherContract = async () => {
    const web3 = window.web3
    const networkId = await web3.eth.net.getId()
    const tetherData = Tether.networks[networkId]
    if (tetherData) {
      const tether = new web3.eth.Contract(Tether.abi, tetherData.address)
      setTether(tether)
      let tetherBalance = await tether.methods.balanceOf(account).call()
      setTetherBalance(tetherBalance.toString())
      console.log({ tetherBalance })
    } else {
      window.alert('Error! Tether contract not deployed - no detected network!')
    }
  }

  const loadRWDContract = async () => {
    const web3 = window.web3
    const networkId = await web3.eth.net.getId()
    const rwdData = RWD.networks[networkId]
    if (rwdData) {
      const rwd = new web3.eth.Contract(RWD.abi, rwdData.address)
      setRwd(rwd)
      let rwdBalance = await rwd.methods.balanceOf(account).call()
      setRwdBalance(rwdBalance.toString())
      console.log({ rwdBalance })
    } else {
      window.alert('Error! Reward Tokens contract not deployed - no detected network!')
    }
  }

  const loadDecentralBankContract = async () => {
    const web3 = window.web3
    const networkId = await web3.eth.net.getId()
    const decentralBankData = DecentralBank.networks[networkId]
    if (decentralBankData) {
      const decentralBank = new web3.eth.Contract(DecentralBank.abi, decentralBankData.address)
      setDecentralBank(decentralBank)
      let stakingBalance = await decentralBank.methods.stakingBalance(account).call()
      setStakingBalance(stakingBalance.toString())
      console.log({ stakingBalance })
    } else {
      window.alert('Error! Decentral Bank contract not deployed - no detected network!')
    }
  }

  useEffect(() => {
    loadWeb3()
    loadBlockchainData()
  }, [])

  useEffect(() => {
    if (account !== '0x0') {
      loadTetherContract()
      loadRWDContract()
      loadDecentralBankContract()
      setLoading(false)
    }
  }, [account])

  // two function one that stakes and done that unstakes
  // leverage our decentral bank contract - deposit tokens and unstaking
  // depositTokens transferFrom ...
  // function approve transaction hash ...
  // staking function - decentralBank.depositTokens(send transactionHash)

  // staking function
  const stakeTokens = (amount) => {
    setLoading(true)

    tether.methods.approve(decentralBank._address, amount).send({ from: account }).on('transactionHash', hash => { }).on('error', err => console.log({ err }))
    decentralBank.methods.depositTokens(amount).send({ from: account }).on('transactionHash', hash => {
      setLoading(false)
    }).on('error', err => console.log({ err }))
  }

  // unstaking function
  const unstakeTokens = () => {
    setLoading(true)
    decentralBank.methods.unstakeTokens().send({ from: account }).on('transactionHash', hash => {
      setLoading(false)
    }).on('error', err => console.log({ err }))
  }

  let content

  if (loading) {
    content = <p id='loader' className='text-center' style={{ margin: '30px' }}>LOADING PLEASE...</p>
  } else {
    content = <Main tetherBalance={tetherBalance} rwdBalance={rwdBalance} stakingBalance={stakingBalance} stakeTokens={stakeTokens} unstakeTokens={unstakeTokens} />
  }


  return (

    <div className='text-center'>
      <NavBar account={account} />
      <div className={'container-fluid mt-5'}>
        <div className='row'>
          <main role='main' className='col-lg-12 ml-auto mr-auto' style={{ maxWidth: '600px', minHeight: '100vm' }}>
            <div>
              {content}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default App