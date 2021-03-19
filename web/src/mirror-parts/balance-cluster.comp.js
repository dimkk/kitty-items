import {Suspense} from "react"
import {useFlowBalance} from "../mirror-hooks/use-flow-balance.hook"
import {useAkasBalance} from "../mirror-hooks/use-akas-balance.hook"
import {useCurrentUser} from "../mirror-hooks/use-current-user.hook"
import {IDLE} from "../global/constants"
import {fmtAkas} from "../util/fmt-akas"
import {
  Box,
  Button,
  Table,
  Tbody,
  Tr,
  Td,
  Flex,
  Heading,
  Spinner,
  Center,
} from "@chakra-ui/react"
import {useInitialized} from "../mirror-hooks/use-initialized.hook"

export function BalanceCluster({address}) {
  const flow = useFlowBalance(address)
  const akas = useAkasBalance(address)
  const init = useInitialized(address)
  return (
    <Box mb="4">
      <Box mb="2">
        <Flex>
          <Heading size="md" mr="4">
            Balances
          </Heading>
          {(flow.status !== IDLE || akas.status !== IDLE) && (
            <Center>
              <Spinner size="sm" />
            </Center>
          )}
        </Flex>
      </Box>
      <Box maxW="200px" borderWidth="1px" borderRadius="lg">
        <Table size="sm">
          <Tbody>
            <Tr>
              <Td>AKA</Td>
              {akas.status === IDLE ? (
                <Td isNumeric>{fmtAkas(akas.balance)}</Td>
              ) : (
                <Td isNumeric>
                  <Spinner size="sm" />
                </Td>
              )}
            </Tr>
          </Tbody>
        </Table>
      </Box>
      <Box mt="2">
        <Flex>
          <Button
            colorScheme="blue"
            disabled={akas.status !== IDLE || !init.isInitialized}
            onClick={akas.mint}
          >
            Request MOAR Akas
          </Button>
        </Flex>
      </Box>
    </Box>
  )
}

export default function WrappedBalanceCluster(props) {
  const [cu] = useCurrentUser()
  if (cu.addr !== props.address) return null

  return (
    <Suspense
      fallback={
        <Flex>
          <Heading size="md" mr="4">
            Balances
          </Heading>
          <Center>
            <Spinner size="sm" />
          </Center>
        </Flex>
      }
    >
      <BalanceCluster {...props} />
    </Suspense>
  )
}
