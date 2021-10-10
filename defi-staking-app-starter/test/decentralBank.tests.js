const { assert } = require('chai');

const Tether = artifacts.require('Tether');
const RWD = artifacts.require('RWD');
const DecentralBank = artifacts.require('DecentralBank');

require('chai')
  .use(require('chai-as-promised'))
  .should()

// accounts in the parameters
contract('DecentralBank', ([owner, customer]) => {
  let tether, rwd, decentralBank

  function tokens(number) {
    return web3.utils.toWei(number, 'ether');
  }

  before(async () => {
    // Load Contracts
    tether = await Tether.new()
    rwd = await RWD.new()
    decentralBank = await DecentralBank.new(rwd.address, tether.address)

    // Transfer all tokens to Decentral Bank (1 million)
    await rwd.transfer(decentralBank.address, tokens('1000000'))

    // Transfer 00 mock Tethers to Customer
    await tether.transfer(customer, tokens('100'), { from: owner })
  })

  // All tests goes below here
  describe('Mock Tether Deployment', async () => {
    it('matches name successfully', async () => {
      const name = await tether.name()
      assert.equal(name, 'Mock Tether Token')
    })
  })

  describe('Mock RWD Deployment', async () => {
    it('matches name successfully', async () => {
      const name = await rwd.name()
      assert.equal(name, 'Reward Token')
    })
  })

  describe('Decentral Bank Deployment', async () => {
    it('matches name successfully', async () => {
      const name = await decentralBank.name()
      assert.equal(name, 'Decentral Bank')
    })


    it('contract has tokens', async () => {
      const balance = await rwd.balanceOf(decentralBank.address)
      assert.equal(balance, tokens('1000000'))
    })

    describe('Yield Farming', async () => {
      it('rewards token for staking', async () => {
        let result
        // Check investor balance
        result = await tether.balanceOf(customer)
        assert.equal(result.toString(), tokens('100'), 'customer mock wallet before staking')

        // Check staking for customer of 100 tokens
        await tether.approve(decentralBank.address, tokens('100'), { from: customer })
        await decentralBank.depositTokens(tokens('100'), { from: customer })

        // Check updated balance of customer
        result = await tether.balanceOf(customer)
        assert.equal(result.toString(), tokens('0'), 'customer balance should be 0 after staking')

        // Check updated balance of decentral bank
        result = await tether.balanceOf(decentralBank.address)
        assert.equal(result.toString(), tokens('100'), 'decentral bank balance after customer staking')

        // Is staking balance
        result = await decentralBank.isStaked(customer)
        assert.equal(result.toString(),  'true', 'customer staking status is active')

        // Check customer staking balance
        result = await decentralBank.stakingBalance(customer)
        assert.equal(result.toString(), tokens('100'), 'customer staking balance should be  100')

        // Issue rewards tokens
        await decentralBank.issueTokens({from: owner})

        // Ensure only the owner can issue tokens
        await decentralBank.issueTokens({from: customer}).should.be.rejected

        // Unstake tokens
        await decentralBank.unstakeTokens({from: customer})

        // Check unstaking balances
        result = await tether.balanceOf(customer)
        assert.equal(result.toString(), tokens('100'), 'customer mock wallet after unstaking')

        // Check updated balance of decentral bank
        result = await tether.balanceOf(decentralBank.address)
        assert.equal(result.toString(), tokens('0'), 'decentral bank balance after customer unstaking')

        // Is staking balance
        result = await decentralBank.isStaked(customer)
        assert.equal(result.toString(),  'false', 'customer staking status is inactive')
      })

    })


  })

})