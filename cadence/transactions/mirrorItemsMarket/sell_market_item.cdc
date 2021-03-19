import FungibleToken from "../../contracts/FungibleToken.cdc"
import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import Aka from "../../contracts/Aka.cdc"
import MirrorItems from "../../contracts/MirrorItems.cdc"
import MirrorItemsMarket from "../../contracts/MirrorItemsMarket.cdc"

transaction(saleItemID: UInt64, saleItemPrice: UFix64) {
    let akaVault: Capability<&Aka.Vault{FungibleToken.Receiver}>
    let mirrorItemsCollection: Capability<&MirrorItems.Collection{NonFungibleToken.Provider}>
    let marketCollection: &MirrorItemsMarket.Collection

    prepare(signer: AuthAccount) {
        // we need a provider capability, but one is not provided by default so we create one.
        let MirrorItemsCollectionProviderPrivatePath = /private/mirrorItemsCollectionProvider

        self.akaVault = signer.getCapability<&Aka.Vault{FungibleToken.Receiver}>(Aka.ReceiverPublicPath)!
        assert(self.akaVault.borrow() != nil, message: "Missing or mis-typed Aka receiver")

        if !signer.getCapability<&MirrorItems.Collection{NonFungibleToken.Provider}>(MirrorItemsCollectionProviderPrivatePath)!.check() {
            signer.link<&MirrorItems.Collection{NonFungibleToken.Provider}>(MirrorItemsCollectionProviderPrivatePath, target: MirrorItems.CollectionStoragePath)
        }

        self.mirrorItemsCollection = signer.getCapability<&MirrorItems.Collection{NonFungibleToken.Provider}>(MirrorItemsCollectionProviderPrivatePath)!
        assert(self.mirrorItemsCollection.borrow() != nil, message: "Missing or mis-typed MirrorItemsCollection provider")

        self.marketCollection = signer.borrow<&MirrorItemsMarket.Collection>(from: MirrorItemsMarket.CollectionStoragePath)
            ?? panic("Missing or mis-typed MirrorItemsMarket Collection")
    }

    execute {
        let offer <- MirrorItemsMarket.createSaleOffer (
            sellerItemProvider: self.mirrorItemsCollection,
            saleItemID: saleItemID,
            sellerPaymentReceiver: self.akaVault,
            salePrice: saleItemPrice
        )
        self.marketCollection.insert(offer: <-offer)
    }
}
