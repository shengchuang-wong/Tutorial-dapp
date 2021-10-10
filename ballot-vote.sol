pragma solidity >=0.7.0 <0.9.0;

// making a voting contract

// 1. we want the ability to accept proposals and store them
// proposal: their name, number

// 2. voters & voting ability
// keep track of voting
// check voters are authenticated to vote

// 3. chaiman
// authenticate and deploy contract

contract Ballot {
    // all the code goes here
    struct Proposal {
        bytes32 name; // name of proposal
        uint256 voteCount; // number of accumulated votes
    }

    struct Voter {
        bool voted;
        uint256 weight;
        uint256 vote;
    }

		Proposal[] public proposals;

		mapping(address => Voter) public voters; // voters get address as a key and Voter for value

		address public chairperson;

		constructor(bytes32[] memory proposalNames) {
			chairperson = msg.sender;

			// add 1 to chairperson weight
			voters[chairperson].weight = 1;

			for(uint i = 0; i < proposalNames.length; i++) {
				proposals.push(Proposal({
					name: proposalNames[i],
					voteCount: 0
				}));
			}
		}

		// function authenticate votes
		function giveRightToVote(address voter) public {
			require(msg.sender == chairperson, 'only the chaiperson can give access to vote');
			require(!voters[voter].voted, 'the voter has already voted');
			require(voters[voter].weight == 0);

			voters[voter].weight = 1;
		}

		// function for voting
		function vote(uint proposal) public {
			Voter storage sender = voters[msg.sender];
			require(sender.weight != 0, 'has no right to vote');
			require(!sender.voted, 'already voted');
			sender.voted = true;
			sender.vote = proposal;

			proposals[proposal].voteCount += sender.weight;
		}

		// function for showing the results

		// function that shows the winning proposal by integer
		function winningProposal() public view returns (uint winningProposal_) {
			uint winningVoteCount = 0;
			for (uint i = 0; i < proposals.length; i++) {
				if (proposals[i].voteCount > winningVoteCount) {
					winningVoteCount = proposals[i].voteCount;
					winningProposal_ = i;
				}
			}
		}

		// function that shows the winning porposal by name
		function winningName() public view returns (bytes32 winningName_) {
			winningName_ = proposals[winningProposal()].name;
		}
}
