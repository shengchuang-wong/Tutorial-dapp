// this is where our code goes

pragma solidity >=0.7.0 <0.9.0;

// create a contract that can stoore data and return the data back

// be able to do the following:

contract simpleStorage {
    // write all the code inside here - functions and state
    
    uint storeData;
    
    function set(uint x) public {
        storeData = x;
    }
    
    function get() public view returns (uint) {
        return storeData;
    }
    
}