import MirrorItemsMarket from "../../contracts/MirrorItemsMarket.cdc"

transaction(saleItemID: UInt64) {
    let marketCollection: &MirrorItemsMarket.Collection

    prepare(signer: AuthAccount) {
        self.marketCollection = signer.borrow<&MirrorItemsMarket.Collection>(from: MirrorItemsMarket.CollectionStoragePath)
            ?? panic("Missing or mis-typed MirrorItemsMarket Collection")
    }

    execute {
        let offer <-self.marketCollection.remove(saleItemID: saleItemID)
        destroy offer
    }
}
