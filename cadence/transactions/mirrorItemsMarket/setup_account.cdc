import MirrorItemsMarket from "../../contracts/MirrorItemsMarket.cdc"

// This transaction configures an account to hold SaleOffer items.

transaction {
    prepare(signer: AuthAccount) {

        // if the account doesn't already have a collection
        if signer.borrow<&MirrorItemsMarket.Collection>(from: MirrorItemsMarket.CollectionStoragePath) == nil {

            // create a new empty collection
            let collection <- MirrorItemsMarket.createEmptyCollection() as! @MirrorItemsMarket.Collection
            
            // save it to the account
            signer.save(<-collection, to: MirrorItemsMarket.CollectionStoragePath)

            // create a public capability for the collection
            signer.link<&MirrorItemsMarket.Collection{MirrorItemsMarket.CollectionPublic}>(MirrorItemsMarket.CollectionPublicPath, target: MirrorItemsMarket.CollectionStoragePath)
        }
    }
}
