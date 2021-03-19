import {atomFamily, selectorFamily, useRecoilState} from "recoil"
import {fetchAkasBalance} from "../mirror-flow/fetch-akas-balance.script"
import {IDLE, PROCESSING} from "../global/constants"

export const valueAtom = atomFamily({
  key: "akas-balance::state",
  default: selectorFamily({
    key: "akas-balance::default",
    get: address => async () => fetchAkasBalance(address),
  }),
})

export const statusAtom = atomFamily({
  key: "akas-balance::status",
  default: IDLE,
})

export function useAkasBalance(address) {
  const [balance, setBalance] = useRecoilState(valueAtom(address))
  const [status, setStatus] = useRecoilState(statusAtom(address))

  async function refresh() {
    setStatus(PROCESSING)
    await fetchAkasBalance(address).then(setBalance)
    setStatus(IDLE)
  }

  return {
    balance,
    status,
    refresh,
    async mint() {
      setStatus(PROCESSING)
      await fetch(process.env.REACT_APP_API_AKA_MINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipient: address,
          amount: 5.0,
        }),
      })
      await fetchAkasBalance(address).then(setBalance)
      setStatus(IDLE)
    },
  }
}
