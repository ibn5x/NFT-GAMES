pragma solidity 0.8.4;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol"; //token framework
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol"; //management of permissions

contract Token is ERC721, Ownable {
    struct Enjimon {
        string enjimonName;
        uint8 damage; //0-255
        uint8 magic; 
        uint256 endurance;
        uint8 level;
        uint256 lastMeal;
        uint256 lastTrained;
    }

    uint nextId = 0;
    uint fTeen = 900; //rough interval of 15 mins

    mapping(uint256 => Enjimon) private _tokenDetails;

    constructor(string memory name, string memory symbol) ERC721(name, symbol){}

    function mint(string memory enjimonName, uint8 damage, uint8 magic, uint endurance, uint8 level) public onlyOwner {

        _tokenDetails[nextId] = Enjimon(enjimonName, damage, magic, endurance, level, block.timestamp, block.timestamp);
        
        _safeMint(msg.sender, nextId);
        
        nextId++;
   
    }

    function feed(uint256 tokenId) public {
        Enjimon storage enjimon =_tokenDetails[tokenId]; 
        
        require(enjimon.lastMeal + enjimon.endurance > block.timestamp);
        enjimon.lastMeal = block.timestamp;
    }

    
   function train(uint256 tokenId) public {
        Enjimon storage enjimon =_tokenDetails[tokenId];

        require(block.timestamp > enjimon.lastTrained + fTeen);
        enjimon.lastTrained = block.timestamp;
        enjimon.level+=1;

    }
 
 function getTokenDetails(uint tokenId) public view returns(Enjimon memory){
        return _tokenDetails[tokenId];
 }

 function getAllTokensForUser(address user) public view returns (uint256[] memory){
     uint256 tokenCount = balanceOf(user);
     if(tokenCount == 0)
        {
            return new uint256[](0);
        }
    else
        {
            uint256[] memory result = new uint256[](tokenCount);
            uint256 totalEnjimon = nextId;
            uint256 i;
            uint256 resIndex = 0;

            for(i = 0; i < totalEnjimon; i++){
                if(ownerOf(i) == user)
                    {
                        result[resIndex] = i;
                        resIndex++;
                    }
            }
                return result;
        }
 }

    //requires enjimon to be alive or they can never transfer the token
    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override {
        Enjimon storage enjimon =_tokenDetails[tokenId];
        
        require(enjimon.lastMeal + enjimon.endurance > block.timestamp); //must be alive
    }


}
