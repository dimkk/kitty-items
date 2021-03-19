import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import {tx} from "./util/tx"
import {invariant} from "@onflow/util-invariant"

const CODE = fcl.cdc`
  import FungibleToken from 0xFungibleToken
  import NonFungibleToken from 0xNonFungibleToken
  import Aka from 0xAka
  import MirrorItems from 0xMirrorItems
  import MirrorItemsMarket from 0xMirrorItemsMarket

  transaction(saleItemID: UInt64, marketCollectionAddress: Address) {
      let paymentVault: @FungibleToken.Vault
      let mirrorItemsCollection: &MirrorItems.Collection{NonFungibleToken.Receiver}
      let marketCollection: &MirrorItemsMarket.Collection{MirrorItemsMarket.CollectionPublic}

      prepare(acct: AuthAccount) {
          self.marketCollection = getAccount(marketCollectionAddress)
              .getCapability<&MirrorItemsMarket.Collection{MirrorItemsMarket.CollectionPublic}>(MirrorItemsMarket.CollectionPublicPath)
              .borrow() ?? panic("Could not borrow market collection from market address")

          let price = self.marketCollection.borrowSaleItem(saleItemID: saleItemID)!.salePrice

          let mainAkaVault = acct.borrow<&Aka.Vault>(from: Aka.VaultStoragePath)
              ?? panic("Cannot borrow Aka vault from acct storage")
          self.paymentVault <- mainAkaVault.withdraw(amount: price)

          self.mirrorItemsCollection = acct.borrow<&MirrorItems.Collection{NonFungibleToken.Receiver}>(
              from: MirrorItems.CollectionStoragePath
          ) ?? panic("Cannot borrow MirrorItems collection receiver from acct")
      }

      execute {
          self.marketCollection.purchase(
              saleItemID: saleItemID,
              buyerCollection: self.mirrorItemsCollection,
              buyerPayment: <- self.paymentVault
          )
      }
  }
`

// prettier-ignore
export function buyMarketItem({itemId, ownerAddress}, opts = {}) {
  invariant(itemId != null, "buyMarketItem({itemId, ownerAddress}) -- itemId required")
  invariant(ownerAddress != null, "buyMarketItem({itemId, ownerAddress}) -- ownerAddress required")

  return tx([
    fcl.transaction(CODE),
    fcl.args([
      fcl.arg(Number(itemId), t.UInt64),
      fcl.arg(String(ownerAddress), t.Address),
    ]),
    fcl.proposer(fcl.authz),
    fcl.payer(fcl.authz),
    fcl.authorizations([fcl.authz]),
    fcl.limit(1000),
  ], opts)
}
