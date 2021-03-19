import Aka from "../../contracts/Aka.cdc"

// This script returns the total amount of Aka currently in existence.

pub fun main(): UFix64 {

    let supply = Aka.totalSupply

    log(supply)

    return supply
}
