pragma solidity >=0.7.0 <0.9.0;

contract Will {
    address owner;
    uint fortune;
    bool isDeceased;
    
    constructor() payable public {
        owner = msg.sender;
        fortune = msg.value;
        isDeceased = false;
    }
    
    // create modifier so the only person who can call the contract is the owner
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
    
    // create modifier so that we only allocate funds if friend's gramps deceased
    modifier mustBeDeceased {
        require(isDeceased == true);
        _;
    }
    
    // list of family wallets
    address payable[] familyWallets;
    
    mapping(address => uint) inheritance;
    
    // set inheritance for each address
    function setInheritance(address payable wallet, uint amount) public onlyOwner {
        // to add wallets to the family wallets .push
        familyWallets.push(wallet);
        inheritance[wallet] = amount;
    }
    
    // Pay each family member based on their wallet address
    function payout() private mustBeDeceased {
        for(uint i = 0; i < familyWallets.length; i++) {
             familyWallets[i].transfer(inheritance[familyWallets[i]]);
        }
    }
    
    // oracle switch simulation
    function deceased() public onlyOwner {
        isDeceased = true;
        payout();
    }
    
}