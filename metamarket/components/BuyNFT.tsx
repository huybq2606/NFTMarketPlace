import { experimentalStyled as styled } from "@mui/material/styles";
import Link from "next/link";
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"

interface NFTProps {
    tokenId: string;
    nftName: string;
    creatorName: string;
    sellerName: string;
    price: string;
    image: string;
}

import {nftmarketaddress, nftaddress} from '../config'
import Market from '../artifacts/contracts/NFT_market.sol/MetaMarket.json'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'

export default async function BuyNFT(props: NFTProps) {
    console.log("here")
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(props.price.toString(), 'ether')   
    const transaction = await contract.createMarketSale(nftaddress, props.tokenId, {
      value: price
    })
    await transaction.wait()
    window.location.href = "/dashboard";
  }
  