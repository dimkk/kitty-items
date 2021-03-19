import {Bar, Label} from "../display/bar.comp"
import {useConfig} from "../mirror-hooks/use-config.hook"

const Link = ({address, name}) => {
  const env = useConfig("env")

  return (
    <li>
      {name}:{" "}
      <a href={fvs(env, address, name)} target="_blank" rel="noreferrer">
        {address}
      </a>
    </li>
  )
}

export function ContractsCluster() {
  const aka = useConfig("0xAka")
  const items = useConfig("0xMirrorItems")
  const market = useConfig("0xMirrorItemsMarket")

  return (
    <div>
      <Bar>
        <Label>Contracts</Label>
      </Bar>
      <ul>
        <Link address={aka} name="Aka" />
        <Link address={items} name="MirrorItems" />
        <Link address={market} name="MirrorItemsMarket" />
      </ul>
    </div>
  )
}

export default function WrappedContractsCluster() {
  return <ContractsCluster />
}

function fvs(env, addr, contract) {
  return `https://flow-view-source.com/${env}/account/${addr}/contract/${contract}`
}
