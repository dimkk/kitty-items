import MirrorItems from "../../contracts/MirrorItems.cdc"

// This scripts returns the number of MirrorItems currently in existence.

pub fun main(): UInt64 {    
    return MirrorItems.totalSupply
}
