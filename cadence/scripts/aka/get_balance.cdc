import Aka from "../../contracts/Aka.cdc"
import FungibleToken from "../../contracts/FungibleToken.cdc"

// This script returns an account's Aka balance.

pub fun main(address: Address): UFix64 {
    let account = getAccount(address)
    
    let vaultRef = account.getCapability(Aka.BalancePublicPath)!.borrow<&Aka.Vault{FungibleToken.Balance}>()
        ?? panic("Could not borrow Balance reference to the Vault")

    return vaultRef.balance
}
