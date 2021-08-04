pragma solidity 0.8.4;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol"; //token framework
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol"; //management of permissions

contract Token is ERC721, Ownable {
    struct Enjimon {
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

    function mint(uint8 damage, uint8 magic, uint endurance, uint8 level) public onlyOwner {

        _tokenDetails[nextId] = Enjimon(damage, magic, endurance, level, block.timestamp, block.timestamp);
        
        _safeMint(msg.sender, nextId);
        
        nextId++;
   
    }

    function feed(uint256 tokenId) public {
        Enjimon storage enjimon =_tokenDetails[nextId]; 
        
        require(enjimon.lastMeal + enjimon.endurance > block.timestamp);
        enjimon.lastMeal = block.timestamp;
    }

    
   function train(uint256 tokenId) public {
        Enjimon storage enjimon =_tokenDetails[nextId];

        require(block.timestamp > enjimon.lastTrained + fTeen);
        enjimon.level+=1;

    }
 

    //requires enjimon to be alive or they can never transfer the token
    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override {
        Enjimon storage enjimon =_tokenDetails[nextId];
        
        require(enjimon.lastMeal + enjimon.endurance > block.timestamp); //must be alive
    }


}
