// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

// We first import some OpenZeppelin Contracts.
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

import { Base64 } from "./libraries/Base64.sol";
// We inherit the contract we imported. This means we'll have access
// to the inherited contract's methods.
contract Green2CleanNFT is ERC721URIStorage {
  // Magic given to us by OpenZeppelin to help us keep track of tokenIds.
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

    string baseSvg = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

    string[] firstWords = ["Adorable", "Affectionate", "Memorable", "Optimistic", "Perky", "Satisfying", "Squiggly", "Bodacious", "Ravishing", "Indubitable", "Ineffable", "Frivolous", "Trusty", "Wacky"];
    string[] secondWords = ["Fish", "Wolf", "Aardvark", "Elephant", "Puppy", "Fox", "Squirrel", "Buffalo", "Chipmunk", "Anteater", "Gorilla", "Wombat", "Lynx", "Orangatang", "Platypus", "Koala", "Wallaby", "Chinchilla", "Barracuda"];
    string[] thirdWords = ["Taco", "Peanut", "Bean", "Sandwich", "Twinkie", "Spaghetti", "Cereal", "Soup", "Salad", "CheeseBall", "Oats", "Wafers", "Cookies", "Tuna"];
    event NewNFTMinted(address sender, uint256 tokenId);

    // We need to pass the name of our NFTs token and its symbol.
    constructor() ERC721 ("Green2CleanCollection", "G2C") {
        console.log("Green2Clean Test NFT contract.");
    }
    //create function to randomly pick first word from array
    function pickRandomFirstWord(uint256 tokenId) public view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("FIRST_WORD", Strings.toString(tokenId))));
        //Squash num between 0 and arrayLength to avoid going out of bounds
        rand = rand % firstWords.length;
        return firstWords[rand];
    }
    function pickRandomSecondWord(uint256 tokenId) public view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("SECOND_WORD", Strings.toString(tokenId))));
        //Squash num between 0 and arrayLength to avoid going out of bounds
        rand = rand % secondWords.length;
        return secondWords[rand];
    }
    function pickRandomThirdWord(uint256 tokenId) public view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("THIRD_WORD", Strings.toString(tokenId))));
        //Squash num between 0 and arrayLength to avoid going out of bounds
        rand = rand % thirdWords.length;
        return thirdWords[rand];
    }    
    function random(string memory input) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(input)));
    }
    function makeNFT() public {
        //get current tokenId
        uint256 newTokenId = _tokenIds.current();
        //randomly grab word from each array
        string memory first = pickRandomFirstWord(newTokenId);
        string memory second = pickRandomSecondWord(newTokenId);
        string memory third = pickRandomThirdWord(newTokenId);
        string memory combinedWord = string(abi.encodePacked(first, second, third));
        
        //concatenate 3 array strings and close txt and svg tags
        string memory finalSvg = string(abi.encodePacked(baseSvg, combinedWord, "</text></svg>")); 
        //get all JSON metadata and base64 encode
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        //set title of NFT as the generated word
                        combinedWord,
                        '", "description": "A Green2Clean NFT Collection.", "image": "data:image/svg+xml;base64,',
                        //we add data:image/svg+xml;base64 and then append our bas64 encode our svg
                        Base64.encode(bytes(finalSvg)),
                        '"}'
                    )
                )
            )
        );
        //prepend data:application/json;base64, to our data
        string memory finalTokenUri = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        console.log("\n----------------");
        console.log(finalTokenUri);
        console.log("\n----------------");
        
        //mint new NFT to sender
        _safeMint(msg.sender, newTokenId);
        //set NFT data uri
        _setTokenURI(newTokenId, finalTokenUri);

        //increment counter for next id
        _tokenIds.increment();
        console.log("My NFT with ID %s has been minted to %s",
        newTokenId, msg.sender);
        emit NewNFTMinted(msg.sender, newTokenId);
    }
}