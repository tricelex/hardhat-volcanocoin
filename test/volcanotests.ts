import { Contract, utils } from "ethers";
import { expect, use } from "chai";
import { ethers } from "hardhat";
import { MockProvider, solidity } from "ethereum-waffle";

use(solidity);

describe("VolcanoCoin", function () {
  const [wallet, walletTo] = new MockProvider().getWallets();
  let token: Contract;

  beforeEach(async () => {
    const VolcanoCoinFactory = await ethers.getContractFactory(
      "VolcanoCoin",
      wallet
    );
    token = await VolcanoCoinFactory.deploy();
  });

  it("Total supply is initially 10000", async function () {
    await token.totalSupply();
    expect("totalSupply").to.be.calledOnContract(token);
    expect(await token.balanceOf(wallet.address)).to.equal(
      utils.parseEther("10000")
    );
  });

  it("Total supply increased in 1000", async function () {
    await token.increaseTotalSupply();
    expect(await token.balanceOf(wallet.address)).to.equal(
      utils.parseEther("11000")
    );
    await token.increaseTotalSupply();
    expect(await token.balanceOf(wallet.address)).to.equal(
      utils.parseEther("12000")
    );
  });

  it("Only Contract Owner can increase Total supply", async function () {
    await expect(
      token.connect(walletTo).increaseTotalSupply()
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Transfers tokens", async function () {
    await token.transfer(walletTo.address, utils.parseEther("1000"));
    expect(await token.balanceOf(wallet.address)).to.equal(
      utils.parseEther("9000")
    );
    expect(await token.balanceOf(walletTo.address)).to.equal(
      utils.parseEther("1000")
    );
  });
});
