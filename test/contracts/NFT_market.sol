// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";
import "../contracts/fungible_token.sol";


contract MetaMarket is ReentrancyGuard {
  using Counters for Counters.Counter;
  using SafeMath for uint256;
  Counters.Counter private _itemIds;
  Counters.Counter private _itemsSold;

  address payable owner;
  uint256 listingPrice = 0.025 ether;

  constructor() {
    owner = payable(msg.sender);
  }

  struct MarketItem {
    uint itemId;
    address nftContract;
    uint256 tokenId;
    address payable seller;
    address payable owner;
    uint256 price;
    bool sold;
    bool cancelled;
    uint256 bidIncrement;
    uint256 startBlock;
    uint256 endBlock;
    address highestBidder;
    mapping(address => uint256) fundsByBidder;
    uint highestBindingBid;
    bool ownerHasWithdrawn
  }

  mapping(uint256 => MarketItem) private idToMarketItem;

  event MarketItemCreated (
    uint indexed itemId,
    address indexed nftContract,
    uint256 indexed tokenId,
    address seller,
    address owner,
    uint256 price,
    bool sold,
    bool cancelled,
    uint256 bidIncrement,
    uint256 startBlock,
    uint256 endBlock,
    address highestBidder,
    uint highestBindingBid,
    bool ownerHasWithdrawn
  );

  /* Returns the listing price of the contract */
  function getListingPrice() public view returns (uint256) {
    return listingPrice;
  }

  /* Places an item for sale on the marketplace */
  function listItem(address nftContract, uint256 tokenId, uint256 price, uint256 _bidIncrement, uint256 _startBlock, uint256 _endBlock) public payable nonReentrant {
    if (_startBlock >= _endBlock) throw; //if start time later than end time, reject
    if (_startBlock < block.number) throw; //if start block before current block, reject
    require(price > 0, "Price must be above 0");
    require(msg.value == listingPrice, "Price must be equal to listing price");

    _itemIds.increment();
    uint256 itemId = _itemIds.current();

    idToMarketItem[itemId] =  MarketItem(
      itemId,
      nftContract,
      tokenId,
      payable(msg.sender),
      payable(address(0)),
      price,
      false,
      false,
      _bidIncrement,
      _startBlock,
      _endBlock,
      msg.sender,
      0,
      false
      
    );

    IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

    emit MarketItemCreated(
      itemId,
      nftContract,
      tokenId,
      msg.sender,
      address(0),
      price,
      false,
      false,
      _bidIncrement,
      _startBlock,
      _endBlock,
      msg.sender,
      0,
      false
    );
  }


  modifier onlyNotOwner {
      if (msg.sender == owner) throw;
      _;
  }

  modifier onlyAfterStart {
      if (block.number < startBlock) throw;
      _;
  }

  modifier onlyBeforeEnd {
      if (block.number > endBlock) throw;
      _;
  }

  modifier onlyNotCanceled {
      if (canceled) throw;
      _;
  }

  function min(uint a, uint b) private returns (uint) {
        if (a < b) return a;
        return b;
    }

  modifier onlyEndedOrCanceled {
    if (block.number < endBlock && !canceled) throw;
    _;
  }

  function withdraw()
        onlyEndedOrCanceled
        returns (bool success)
    {
        address withdrawalAccount;
        uint withdrawalAmount;

        if (msg.sender == owner) {
            // the auction's owner should be allowed to withdraw the highestBindingBid
            withdrawalAccount = highestBidder;
            withdrawalAmount = highestBindingBid;
            ownerHasWithdrawn = true;

        } else if (msg.sender == highestBidder) {
            // the highest bidder should only be allowed to withdraw the difference between their
            // highest bid and the highestBindingBid
            withdrawalAccount = highestBidder;
            if (ownerHasWithdrawn) {
                withdrawalAmount = fundsByBidder[highestBidder];
            } else {
                withdrawalAmount = fundsByBidder[highestBidder] - highestBindingBid;
            }

        } else {
            // anyone who participated but did not win the auction should be allowed to withdraw
            // the full amount of their funds
            withdrawalAccount = msg.sender;
            withdrawalAmount = fundsByBidder[withdrawalAccount];
        }

        if (withdrawalAmount == 0) throw;

        fundsByBidder[withdrawalAccount] -= withdrawalAmount;

        // send the funds
        if (!msg.sender.send(withdrawalAmount)) throw;

        LogWithdrawal(msg.sender, withdrawalAccount, withdrawalAmount);

        return true;
    }


  function bid(address nftContract, uint256 itemId) public payable nonReentrant {
    // reject payments of 0 ETH
    if (msg.value == 0) throw;

    // calculate the user's total bid based on the current amount they've sent to the contract plus whatever has been sent with this transaction
    uint newBid = fundsByBidder[msg.sender] + msg.value;

    // if the user isn't willing to overbid the highest binding bid, revert the transaction
    if (newBid <= highestBindingBid) throw;

    // grab the previous highest bid (before updating fundsByBidder, in case msg.sender is the highestBidder and is just increasing their maximum bid).
    uint highestBid = fundsByBidder[highestBidder];

    fundsByBidder[msg.sender] = newBid;

    if (newBid <= highestBid) {
        // if the user has overbid the highestBindingBid but not the highestBid, we simply increase the highestBindingBid and leave highestBidder alone.
        highestBindingBid = min(newBid + bidIncrement, highestBid);
    } else {
        // if msg.sender is already the highest bidder, they must simply be wanting to raise their maximum bid, in which case we shouldn't increase the highestBindingBid.
        // if the user is NOT highestBidder, and has overbid highestBid completely, we set them as the new highestBidder and recalculate highestBindingBid.
        if (msg.sender != highestBidder) {
            highestBidder = msg.sender;
            highestBindingBid = min(newBid, highestBid + bidIncrement);
        }
        highestBid = newBid;
    }
    endBlock += 40;
    return true;
}
  // OLD
  /* Creates the sale of a marketplace item */
  /* Transfers ownership of the item, as well as funds between parties */
  // function createMarketSale(address nftContract, uint256 itemId) public payable nonReentrant {
  //   uint price = idToMarketItem[itemId].price;
  //   uint tokenId = idToMarketItem[itemId].tokenId;
  //   require(msg.value == price, "Please submit the asking price in order to complete the purchase");

  //   idToMarketItem[itemId].seller.transfer(msg.value);
  //   IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
  //   idToMarketItem[itemId].owner = payable(msg.sender);
  //   idToMarketItem[itemId].sold = true;
  //   _itemsSold.increment();
  //   payable(owner).transfer(listingPrice);
  // } 

  /* Returns all unsold market items */
  function fetchMarketItems() public view returns (MarketItem[] memory) {
    uint itemCount = _itemIds.current();
    uint unsoldItemCount = _itemIds.current() - _itemsSold.current();
    uint currentIndex = 0;

    MarketItem[] memory items = new MarketItem[](unsoldItemCount);
    for (uint i = 0; i < itemCount; i++) {
      if (idToMarketItem[i + 1].owner == address(0)) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  /* Returns only items that a user has purchased */
  function fetchMyNFTs() public view returns (MarketItem[] memory) {
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].owner == msg.sender) {
        itemCount += 1;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].owner == msg.sender) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  /* Returns only items a user has created */
  function fetchItemsCreated() public view returns (MarketItem[] memory) {
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].seller == msg.sender) {
        itemCount += 1;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].seller == msg.sender) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }
}
