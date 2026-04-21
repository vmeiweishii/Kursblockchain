import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  const adminPrivateKey =
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  const servicePrivateKey =
    "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";

  const admin = new ethers.Wallet(adminPrivateKey, provider);
  const service = new ethers.Wallet(servicePrivateKey, provider);

  const artifactPath = path.join(
    __dirname,
    "..",
    "artifacts",
    "contracts",
    "DevicePassportRegistry.sol",
    "DevicePassportRegistry.json",
  );
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, admin);

  const contract = await factory.deploy(admin.address);
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();
  const nextNonce = await provider.getTransactionCount(admin.address, "latest");
  await (await contract.authorizeService(service.address, { nonce: nextNonce })).wait();

  const output = {
    contractAddress,
    adminAddress: admin.address,
    demoServiceAddress: service.address,
    abi: artifact.abi,
  };

  fs.mkdirSync(path.join(__dirname, "..", "backend"), { recursive: true });
  fs.mkdirSync(path.join(__dirname, "..", "frontend", "src"), { recursive: true });
  fs.writeFileSync(
    path.join(__dirname, "..", "backend", "contract-config.json"),
    JSON.stringify(output, null, 2),
  );
  fs.writeFileSync(
    path.join(__dirname, "..", "frontend", "src", "contract-config.json"),
    JSON.stringify(output, null, 2),
  );

  console.log("Contract deployed and config exported:");
  console.log(JSON.stringify(output, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
