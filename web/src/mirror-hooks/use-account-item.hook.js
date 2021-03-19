import {sansPrefix} from "@onflow/fcl"
import {atomFamily, selectorFamily, useRecoilState} from "recoil"
import {useCurrentUser} from "../mirror-hooks/use-current-user.hook"
import {fetchAccountItem} from "../mirror-flow/fetch-account-item.script"
import {createSaleOffer} from "../mirror-flow/create-sale-offer.tx"
import {IDLE, PROCESSING} from "../global/constants"
import {useAccountItems} from "../mirror-hooks/use-account-items.hook"
import {useMarketItems} from "../mirror-hooks/use-market-items.hook"

function expand(key) {
  return key.split("|")
}

function comp(address, id) {
  return [address, id].join("|")
}

export const $state = atomFamily({
  key: "account-item::state",
  default: selectorFamily({
    key: "account-item::default",
    get: key => async () => fetchAccountItem(...expand(key)),
  }),
})

export const $status = atomFamily({
  key: "account-item::status",
  default: IDLE,
})

export function useAccountItem(address, id) {
  const [cu] = useCurrentUser()
  const accountItems = useAccountItems(address)
  const marketItems = useMarketItems(address)
  const key = comp(address, id)
  const [item, setItem] = useRecoilState($state(key))
  const [status, setStatus] = useRecoilState($status(key))

  return {
    ...item,
    status,
    forSale: marketItems.has(id),
    owned: sansPrefix(cu.addr) === sansPrefix(address),
    async sell(price) {
      await createSaleOffer(
        {itemId: id, price: price},
        {
          onStart() {
            setStatus(PROCESSING)
          },
          async onSuccess() {
            accountItems.refresh()
            marketItems.refresh()
          },
          async onComplete() {
            setStatus(IDLE)
          },
        }
      )
    },
    async refresh() {
      setStatus(PROCESSING)
      await fetchAccountItem(...expand(key)).then(setItem)
      setStatus(IDLE)
    },
  }
}
