export default {
  solidity: "0.8.20",
  networks: {
    somnia: {
      url: "https://dream-rpc.somnia.network",
      chainId: 50312,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  paths: {
    sources: "./src",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};