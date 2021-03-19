import {send, decode, script, args, arg, cdc} from "@onflow/fcl"
import {Address} from "@onflow/types"

const CODE = cdc`
  import FungibleToken from 0xFungibleToken
  import NonFungibleToken from 0xNonFungibleToken
  import Aka from 0xAka
  import MirrorItems from 0xMirrorItems
  import MirrorItemsMarket from 0xMirrorItemsMarket

  pub fun hasAka(_ address: Address): Bool {
    let receiver: Bool = getAccount(address)
      .getCapability<&Aka.Vault{FungibleToken.Receiver}>(Aka.ReceiverPublicPath)
      .check()

    let balance: Bool = getAccount(address)
      .getCapability<&Aka.Vault{FungibleToken.Balance}>(Aka.BalancePublicPath)
      .check()

    return receiver && balance
  }

  pub fun hasMirrorItems(_ address: Address): Bool {
    return getAccount(address)
      .getCapability<&MirrorItems.Collection{NonFungibleToken.CollectionPublic, MirrorItems.MirrorItemsCollectionPublic}>(MirrorItems.CollectionPublicPath)
      .check()
  }

  pub fun hasMirrorItemsMarket(_ address: Address): Bool {
    return getAccount(address)
      .getCapability<&MirrorItemsMarket.Collection{MirrorItemsMarket.CollectionPublic}>(MirrorItemsMarket.CollectionPublicPath)
      .check()
  }

  pub fun main(address: Address): {String: Bool} {
    let ret: {String: Bool} = {}
    ret["Aka"] = hasAka(address)
    ret["MirrorItems"] = hasMirrorItems(address)
    ret["MirrorItemsMarket"] = hasMirrorItemsMarket(address)
    return ret
  }
`

export function isAccountInitialized(address) {
  if (address == null) return Promise.resolve(false)

  // prettier-ignore
  return send([
    script(CODE),
    args([
      arg(address, Address)
    ])
  ]).then(decode)
}
