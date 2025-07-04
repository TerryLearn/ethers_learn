import { ethers } from "ethers";

// //1.创建Provider
// const achademe_URL =
//   "https://eth-mainnet.g.alchemy.com/v2/U57o5HcGeidRWNXl_MAVg";
// //连接以太坊主网
// const provider = new ethers.JsonRpcApiProvider(achademe_URL);

// 利用Alchemy的rpc节点连接以太坊网络
// 准备 alchemy API 可以参考https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md
const ALCHEMY_GOERLI_URL =
  "https://eth-sepolia.g.alchemy.com/v2/U57o5HcGeidRWNXl_MAVg";
const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);

// 利用私钥和provider创建wallet对象
const privateKey =
  "0xa87fcf572a39667cf60e46a078baa6fa62544fccbbacbcf025fcacb55336fa40";
const wallet = new ethers.Wallet(privateKey, provider);

// WETH的ABI
const abiWETH = [
  "function balanceOf(address) public view returns(uint)",
  "function deposit() public payable",
  "function transfer(address, uint) public returns (bool)",
  "function withdraw(uint) public",
];
// WETH合约地址（Goerli测试网）
const addressWETH = "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9";
// WETH Contract

// 声明可写合约
const contractWETH = new ethers.Contract(addressWETH, abiWETH, wallet);
// 也可以声明一个只读合约，再用connect(wallet)函数转换成可写合约。
// const contractWETH = new ethers.Contract(addressWETH, abiWETH, provider)
// contractWETH.connect(wallet)

const main = async () => {
  const address = await wallet.getAddress();
  // 1. 读取WETH合约的链上信息（WETH abi）
  console.log("\n1. 读取WETH余额", address);
  const balanceWETH = await contractWETH.balanceOf(address);
  console.log(`存款前WETH持仓: ${ethers.formatEther(balanceWETH)}\n`);
  //读取钱包内ETH余额
  const balanceETH = await provider.getBalance(wallet);
  // 如果钱包ETH足够
  if (ethers.formatEther(balanceETH) > 0.0015) {
    // 2. 调用deposit()函数，将0.001 ETH转为WETH
    console.log("\n2. 调用deposit()函数，存入0.001 ETH");
    // 发起交易
    const tx = await contractWETH.deposit({
      value: ethers.parseEther("0.001"),
    });
    // 等待交易上链
    await tx.wait();
    console.log(`交易详情：`);
    console.log(tx);
    const balanceWETH_deposit = await contractWETH.balanceOf(address);
    console.log(`存款后WETH持仓: ${ethers.formatEther(balanceWETH_deposit)}\n`);

    // 3. 调用transfer()函数，将0.001 WETH转账给 vitalik
    console.log("\n3. 调用transfer()函数，给vitalik转账0.001 WETH");
    // 发起交易
    const tx2 = await contractWETH.transfer(
      "vitalik.eth",
      ethers.parseEther("0.001")
    );
    // 等待交易上链
    await tx2.wait();
    const balanceWETH_transfer = await contractWETH.balanceOf(address);
    console.log(
      `转账后WETH持仓: ${ethers.formatEther(balanceWETH_transfer)}\n`
    );
  } else {
    // 如果ETH不足
    console.log("ETH不足，去水龙头领一些Goerli ETH");
    console.log("1. chainlink水龙头: https://faucets.chain.link/goerli");
    console.log("2. paradigm水龙头: https://faucet.paradigm.xyz/");
  }
};

main();
