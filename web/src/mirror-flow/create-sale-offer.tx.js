import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import {tx} from "./util/tx"

const CODE = fcl.cdc`
  import FungibleToken from 0xFungibleToken
  import NonFungibleToken from 0xNonFungibleToken
  import Aka from 0xAka
  import MirrorItems from 0xMirrorItems
  import MirrorItemsMarket from 0xMirrorItemsMarket

  transaction(saleItemID: UInt64, salePrice: UFix64) {
    prepare(acct: AuthAccount) {
      let market = acct.borrow<&MirrorItemsMarket.Collection>(from: MirrorItemsMarket.CollectionStoragePath) ?? panic("Need the marketplace resouce")

      let sellerPaymentReceiver = acct.getCapability<&Aka.Vault{FungibleToken.Receiver}>(Aka.ReceiverPublicPath)

      let providerPath = /private/MirrorItemsCollectionProvider
      acct.unlink(providerPath)
      if !acct.getCapability<&MirrorItems.Collection{NonFungibleToken.Provider}>(providerPath).check() {
        acct.link<&MirrorItems.Collection{NonFungibleToken.Provider}>(providerPath, target: MirrorItems.CollectionStoragePath)
      }
      if !acct.getCapability<&MirrorItems.Collection{NonFungibleToken.Provider}>(providerPath).check() {
        acct.link<&MirrorItems.Collection{NonFungibleToken.Provider}>(providerPath, target: MirrorItems.CollectionStoragePath)
      }
      let itemProvider = acct.getCapability<&MirrorItems.Collection{NonFungibleToken.Provider}>(providerPath)
      assert(itemProvider.borrow() != nil, message: "Missing or mis-typed KittyItemsCollection provider")

      let offer <- MirrorItemsMarket.createSaleOffer(
        sellerItemProvider: itemProvider,
        saleItemID: saleItemID,
        sellerPaymentReceiver: sellerPaymentReceiver,
        salePrice: salePrice,
      )

      market.insert(offer: <-offer)
    }
  }
`

export function createSaleOffer({itemId, price}, opts = {}) {
  if (itemId == null)
    throw new Error("createSaleOffer(itemId, price) -- itemId required")
  if (price == null)
    throw new Error("createSaleOffer(itemId, price) -- price required")

  // prettier-ignore
  return tx([
    fcl.transaction(CODE),
    fcl.args([
      fcl.arg(Number(itemId), t.UInt64),
      fcl.arg(String(price), t.UFix64),
    ]),
    fcl.proposer(fcl.authz),
    fcl.payer(fcl.authz),
    fcl.authorizations([
      fcl.authz
    ]),
    fcl.limit(1000)
  ], opts)
}
