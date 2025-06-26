import { ethers } from "ethers";

//连接以太坊
// const provider = ethers.getDefaultProvider();

const ALCHEMY_MAINNET_URL =
  "https://sepolia.infura.io/v3/fa6570c4ea274db8ae998b829014fca6";
const provider = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL);
const main = async () => {
  //查询ETH余额， vitalik表示以太坊创始人的余额
  const balance = await provider.getBalance(`vitalik.eth`);
  console.log(`ETH Balance of vitalik:${ethers.formatEther(balance)} ETH`);
};

main();
