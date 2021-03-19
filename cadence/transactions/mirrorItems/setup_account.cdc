import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import MirrorItems from "../../contracts/MirrorItems.cdc"

// This transaction configures an account to hold Mirror Items.

transaction {
    prepare(signer: AuthAccount) {
        // if the account doesn't already have a collection
        if signer.borrow<&MirrorItems.Collection>(from: MirrorItems.CollectionStoragePath) == nil {

            // create a new empty collection
            let collection <- MirrorItems.createEmptyCollection()
            
            // save it to the account
            signer.save(<-collection, to: MirrorItems.CollectionStoragePath)

            // create a public capability for the collection
            signer.link<&MirrorItems.Collection{NonFungibleToken.CollectionPublic, MirrorItems.MirrorItemsCollectionPublic}>(MirrorItems.CollectionPublicPath, target: MirrorItems.CollectionStoragePath)
        }
    }
}
