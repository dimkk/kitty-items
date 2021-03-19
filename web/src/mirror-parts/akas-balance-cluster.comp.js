import {Suspense} from "react"
import {useInitialized} from "../mirror-hooks/use-initialized.hook"
import {useAkasBalance} from "../mirror-hooks/use-akas-balance.hook"
import {Bar, Label, Button} from "../display/bar.comp"
import {IDLE} from "../global/constants"
import {Loading} from "../mirror-parts/loading.comp"
import {fmtAkas} from "../util/fmt-akas"

export function AkasBalanceCluster({address}) {
  const init = useInitialized(address)
  const aka = useAkasBalance(address)
  if (address == null || !init.isInitialized) return null

  return (
    <Bar>
      <Label>Akas Balance:</Label>
      <Label strong good={aka.balance > 0} bad={aka.balance <= 0}>
        {fmtAkas(aka.balance)}
      </Label>
      <Button disabled={aka.status !== IDLE} onClick={aka.refresh}>
        Refresh
      </Button>
      <Button disabled={aka.status !== IDLE} onClick={aka.mint}>
        Mint
      </Button>
      {aka.status !== IDLE && <Loading label={aka.status} />}
    </Bar>
  )
}

export default function WrappedAkasBalanceCluster({address}) {
  return (
    <Suspense
      fallback={
        <Bar>
          <Loading label="Fetching Akas Balance" />
        </Bar>
      }
    >
      <AkasBalanceCluster address={address} />
    </Suspense>
  )
}
