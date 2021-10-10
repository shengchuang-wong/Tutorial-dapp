pragma solidity >=0.7.0 <0.9.0;

contract Coin {
    // the keyword public it's making the variables
    // here accessible from other contracts
    address public minter;
    mapping(address => uint256) balances;

    event Sent(address from, address to, uint256 amount);

    // constructor only runs when we deploy contract
    constructor() {
        minter = msg.sender;
    }

    // make new coins and send them to an address
    // only the owner can send these coins
    function mint(address receiver, uint256 amount) public {
        require(msg.sender == minter);
        balances[receiver] = balances[receiver] + amount;
    }

    error insufficientBalance(uint256 requested, uint256 available);

    // send any amount of coin to an existing address
    function send(address receiver, uint256 amount) public {
        // require sufficient balances
        if (amount > balances[msg.sender])
            revert insufficientBalance({
                requested: amount,
                available: balances[msg.sender]
            });
        balances[msg.sender] -= amount;
        balances[receiver] += amount;
        emit Sent(msg.sender, receiver, amount);
    }
}
 