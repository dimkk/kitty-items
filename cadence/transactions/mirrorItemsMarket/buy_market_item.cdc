import FungibleToken from "../../contracts/FungibleToken.cdc"
import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import Aka from "../../contracts/Aka.cdc"
import MirrorItems from "../../contracts/MirrorItems.cdc"
import MirrorItemsMarket from "../../contracts/MirrorItemsMarket.cdc"

transaction(saleItemID: UInt64, marketCollectionAddress: Address) {
    let paymentVault: @FungibleToken.Vault
    let mirrorItemsCollection: &MirrorItems.Collection{NonFungibleToken.Receiver}
    let marketCollection: &MirrorItemsMarket.Collection{MirrorItemsMarket.CollectionPublic}

    prepare(signer: AuthAccount) {
        self.marketCollection = getAccount(marketCollectionAddress)
            .getCapability<&MirrorItemsMarket.Collection{MirrorItemsMarket.CollectionPublic}>(
                MirrorItemsMarket.CollectionPublicPath
            )!
            .borrow()
            ?? panic("Could not borrow market collection from market address")

        let saleItem = self.marketCollection.borrowSaleItem(saleItemID: saleItemID)
                    ?? panic("No item with that ID")
        let price = saleItem.salePrice

        let mainAkaVault = signer.borrow<&Aka.Vault>(from: Aka.VaultStoragePath)
            ?? panic("Cannot borrow Aka vault from acct storage")
        self.paymentVault <- mainAkaVault.withdraw(amount: price)

        self.mirrorItemsCollection = signer.borrow<&MirrorItems.Collection{NonFungibleToken.Receiver}>(
            from: MirrorItems.CollectionStoragePath
        ) ?? panic("Cannot borrow KittyItems collection receiver from acct")
    }

    execute {
        self.marketCollection.purchase(
            saleItemID: saleItemID,
            buyerCollection: self.mirrorItemsCollection,
            buyerPayment: <- self.paymentVault
        )
    }
}
