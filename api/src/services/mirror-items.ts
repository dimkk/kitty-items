import * as t from "@onflow/types";
import * as fcl from "@onflow/fcl";
import { FlowService } from "./flow";
import * as fs from "fs";
import * as path from "path";

const nonFungibleTokenPath = "\"../../contracts/NonFungibleToken.cdc\"";
const mirrorItemsPath = "\"../../contracts/MirrorItems.cdc\"";

class MirrorItemsService {
  constructor(
    private readonly flowService: FlowService,
    private readonly nonFungibleTokenAddress: string,
    private readonly mirrorItemsAddress: string
  ) {}

  setupAccount = async () => {
    const authorization = this.flowService.authorizeMinter();

    const transaction = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/transactions/mirrorItems/setup_account.cdc`
        ),
        "utf8"
      )
      .replace(nonFungibleTokenPath, fcl.withPrefix(this.nonFungibleTokenAddress))
      .replace(mirrorItemsPath, fcl.withPrefix(this.mirrorItemsAddress));

    return this.flowService.sendTx({
      transaction,
      args: [],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization,
    });
  };

  mint = async (recipient: string, typeId: number) => {
    const authorization = this.flowService.authorizeMinter();

    const transaction = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/transactions/mirrorItems/mint_mirror_item.cdc`
        ),
        "utf8"
      )
      .replace(nonFungibleTokenPath, fcl.withPrefix(this.nonFungibleTokenAddress))
      .replace(mirrorItemsPath, fcl.withPrefix(this.mirrorItemsAddress));

    return this.flowService.sendTx({
      transaction,
      args: [fcl.arg(recipient, t.Address), fcl.arg(typeId, t.UInt64)],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization,
    });
  };

  transfer = async (recipient: string, itemId: number) => {
    const authorization = this.flowService.authorizeMinter();

    const transaction = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/transactions/mirrorItems/transfer_mirror_item.cdc`
        ),
        "utf8"
      )
      .replace(nonFungibleTokenPath, fcl.withPrefix(this.nonFungibleTokenAddress))
      .replace(mirrorItemsPath, fcl.withPrefix(this.mirrorItemsAddress));

    return this.flowService.sendTx({
      transaction,
      args: [fcl.arg(recipient, t.Address), fcl.arg(itemId, t.UInt64)],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization,
    });
  };

  getCollectionIds = async (account: string): Promise<number[]> => {
    const script = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/scripts/mirrorItems/read_collection_ids.cdc`
        ),
        "utf8"
      )
      .replace(nonFungibleTokenPath, fcl.withPrefix(this.nonFungibleTokenAddress))
      .replace(mirrorItemsPath, fcl.withPrefix(this.mirrorItemsAddress));

    return this.flowService.executeScript<number[]>({
      script,
      args: [fcl.arg(account, t.Address)],
    });
  };

  getMirrorItemType = async (itemId: number): Promise<number> => {
    const script = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/scripts/mirrorItems/read_mirror_item_type_id.cdc`
        ),
        "utf8"
      )
      .replace(nonFungibleTokenPath, fcl.withPrefix(this.nonFungibleTokenAddress))
      .replace(mirrorItemsPath, fcl.withPrefix(this.mirrorItemsAddress));

    return this.flowService.executeScript<number>({
      script,
      args: [fcl.arg(itemId, t.UInt64)],
    });
  };

  getSupply = async (): Promise<number> => {
    const script = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/scripts/mirrorItems/read_mirror_items_supply.cdc`
        ),
        "utf8"
      )
      .replace(mirrorItemsPath, fcl.withPrefix(this.mirrorItemsAddress));

    return this.flowService.executeScript<number>({ script, args: [] });
  };
}

export { MirrorItemsService };
