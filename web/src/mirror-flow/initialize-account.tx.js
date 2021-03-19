// prettier-ignore
import {transaction, limit, proposer, payer, authorizations, authz, cdc} from "@onflow/fcl"
import {invariant} from "@onflow/util-invariant"
import {tx} from "./util/tx"

const CODE = cdc`
  import FungibleToken from 0xFungibleToken
  import NonFungibleToken from 0xNonFungibleToken
  import Aka from 0xAka
  import MirrorItems from 0xMirrorItems
  import MirrorItemsMarket from 0xMirrorItemsMarket

  pub fun hasAka(_ address: Address): Bool {
    let receiver = getAccount(address)
      .getCapability<&Aka.Vault{FungibleToken.Receiver}>(Aka.ReceiverPublicPath)
      .check()

    let balance = getAccount(address)
      .getCapability<&Aka.Vault{FungibleToken.Balance}>(Aka.BalancePublicPath)
      .check()

    return receiver && balance
  }

  pub fun hasItems(_ address: Address): Bool {
    return getAccount(address)
      .getCapability<&MirrorItems.Collection{NonFungibleToken.CollectionPublic, MirrorItems.MirrorItemsCollectionPublic}>(MirrorItems.CollectionPublicPath)
      .check()
  }

  pub fun hasMarket(_ address: Address): Bool {
    return getAccount(address)
      .getCapability<&MirrorItemsMarket.Collection{MirrorItemsMarket.CollectionPublic}>(MirrorItemsMarket.CollectionPublicPath)
      .check()
  }

  transaction {
    prepare(acct: AuthAccount) {
      if !hasAka(acct.address) {
        if acct.borrow<&Aka.Vault>(from: Aka.VaultStoragePath) == nil {
          acct.save(<-Aka.createEmptyVault(), to: Aka.VaultStoragePath)
        }
        acct.unlink(Aka.ReceiverPublicPath)
        acct.unlink(Aka.BalancePublicPath)
        acct.link<&Aka.Vault{FungibleToken.Receiver}>(Aka.ReceiverPublicPath, target: Aka.VaultStoragePath)
        acct.link<&Aka.Vault{FungibleToken.Balance}>(Aka.BalancePublicPath, target: Aka.VaultStoragePath)
      }

      if !hasItems(acct.address) {
        if acct.borrow<&MirrorItems.Collection>(from: MirrorItems.CollectionStoragePath) == nil {
          acct.save(<-MirrorItems.createEmptyCollection(), to: MirrorItems.CollectionStoragePath)
        }
        acct.unlink(MirrorItems.CollectionPublicPath)
        acct.link<&MirrorItems.Collection{NonFungibleToken.CollectionPublic, MirrorItems.MirrorItemsCollectionPublic}>(MirrorItems.CollectionPublicPath, target: MirrorItems.CollectionStoragePath)
      }

      if !hasMarket(acct.address) {
        if acct.borrow<&MirrorItemsMarket.Collection>(from: MirrorItemsMarket.CollectionStoragePath) == nil {
          acct.save(<-MirrorItemsMarket.createEmptyCollection(), to: MirrorItemsMarket.CollectionStoragePath)
        }
        acct.unlink(MirrorItemsMarket.CollectionPublicPath)
        acct.link<&MirrorItemsMarket.Collection{MirrorItemsMarket.CollectionPublic}>(MirrorItemsMarket.CollectionPublicPath, target:MirrorItemsMarket.CollectionStoragePath)
      }
    }
  }
`

export async function initializeAccount(address, opts = {}) {
  // prettier-ignore
  invariant(address != null, "Tried to initialize an account but no address was supplied")

  return tx(
    [
      transaction(CODE),
      limit(70),
      proposer(authz),
      payer(authz),
      authorizations([authz]),
    ],
    opts
  )
}
