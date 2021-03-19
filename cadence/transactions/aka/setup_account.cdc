import FungibleToken from "../../contracts/FungibleToken.cdc"
import Aka from "../../contracts/Aka.cdc"

// This transaction is a template for a transaction
// to add a Vault resource to their account
// so that they can use the Aka

transaction {

    prepare(signer: AuthAccount) {

        if signer.borrow<&Aka.Vault>(from: Aka.VaultStoragePath) == nil {
            // Create a new Aka Vault and put it in storage
            signer.save(<-Aka.createEmptyVault(), to: Aka.VaultStoragePath)

            // Create a public capability to the Vault that only exposes
            // the deposit function through the Receiver interface
            signer.link<&Aka.Vault{FungibleToken.Receiver}>(
                Aka.ReceiverPublicPath,
                target: Aka.VaultStoragePath
            )

            // Create a public capability to the Vault that only exposes
            // the balance field through the Balance interface
            signer.link<&Aka.Vault{FungibleToken.Balance}>(
                Aka.BalancePublicPath,
                target: Aka.VaultStoragePath
            )
        }
    }
}
