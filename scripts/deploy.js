const main = async () => {
    const nftContractFactory = await hre.ethers.getContractFactory('Green2CleanNFT');
    const nftContract = await nftContractFactory.deploy();
    await nftContract.deployed();
    console.log("Contract deployed to:", nftContract.address);

  //call the function
  let txn = await nftContract.makeNFT()
  //wait for mining
  await txn.wait()
  console.log("Minted NFT #1")

};
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  runMain();