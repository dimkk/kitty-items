import * as t from "@onflow/types";
import * as fcl from "@onflow/fcl";
import { FlowService } from "./flow";
import * as fs from "fs";
import * as path from "path";

import { MirrorSaleOffer } from "../models/mirror-sale-offer";

const fungibleTokenPath = "\"../../contracts/FungibleToken.cdc\"";
const nonFungibleTokenPath = "\"../../contracts/NonFungibleToken.cdc\"";
const akaPath = "\"../../contracts/Aka.cdc\"";
const mirrorItemsPath = "\"../../contracts/MirrorItems.cdc\"";
const mirrorItemsMarkPath = "\"../../contracts/MirrorItemsMarket.cdc\"";

class MirrorMarketService {
  constructor(
    private readonly flowService: FlowService,
    private readonly fungibleTokenAddress: string,
    private readonly akaAddress: string,
    private readonly nonFungibleTokenAddress: string,
    private readonly mirrorItemsAddress: string,
    private readonly mirrorMarketAddress: string
  ) {}

  setupAccount = () => {
    const authorization = this.flowService.authorizeMinter();
    
    const transaction = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/transactions/mirrorItemsMarket/setup_account.cdc`
        ),
        "utf8"
      )
      .replace(mirrorItemsMarkPath, fcl.withPrefix(this.mirrorMarketAddress));

    return this.flowService.sendTx({
      transaction,
      args: [],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization,
    });
  };

  getItem = (account: string, itemId: number) => {
    const script = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/cadence/mirrorItemsMarket/scripts/read_collection_ids.cdc`
        ),
        "utf8"
      )
      .replace(mirrorItemsMarkPath, fcl.withPrefix(this.mirrorMarketAddress));

    return this.flowService.executeScript<any[]>({
      script,
      args: [fcl.arg(account, t.Address), fcl.arg(itemId, t.UInt64)],
    });
  };

  getItems = (account: string) => {
    const script = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/cadence/mirrorItemsMarket/scripts/read_collection_ids.cdc`
        ),
        "utf8"
      )
      .replace(mirrorItemsMarkPath, fcl.withPrefix(this.mirrorMarketAddress));

    return this.flowService.executeScript<number[]>({
      script,
      args: [fcl.arg(account, t.Address)],
    });
  };

  buy = (account: string, itemId: number) => {
    const authorization = this.flowService.authorizeMinter();

    const transaction = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/transactions/mirrorItemsMarket/buy_market_item.cdc`
        ),
        "utf8"
      )
      .replace(fungibleTokenPath, fcl.withPrefix(this.fungibleTokenAddress))
      .replace(nonFungibleTokenPath, fcl.withPrefix(this.nonFungibleTokenAddress))
      .replace(akaPath, fcl.withPrefix(this.akaAddress))
      .replace(mirrorItemsPath, fcl.withPrefix(this.mirrorItemsAddress))
      .replace(mirrorItemsMarkPath, fcl.withPrefix(this.mirrorMarketAddress));

    return this.flowService.sendTx({
      transaction,
      args: [fcl.arg(account, t.Address), fcl.arg(itemId, t.UInt64)],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization,
    });
  };

  sell = (itemId: number, price: number) => {
    const authorization = this.flowService.authorizeMinter();

    const transaction = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/transactions/mirrorItemsMarket/sell_market_item.cdc`
        ),
        "utf8"
      )
      .replace(fungibleTokenPath, fcl.withPrefix(this.fungibleTokenAddress))
      .replace(nonFungibleTokenPath, fcl.withPrefix(this.nonFungibleTokenAddress))
      .replace(akaPath, fcl.withPrefix(this.akaAddress))
      .replace(mirrorItemsPath, fcl.withPrefix(this.mirrorItemsAddress))
      .replace(mirrorItemsMarkPath, fcl.withPrefix(this.mirrorMarketAddress));

    return this.flowService.sendTx({
      transaction,
      args: [
        fcl.arg(itemId, t.UInt64),
        fcl.arg(price.toFixed(8).toString(), t.UFix64),
      ],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization,
    });
  };

  findMostRecentSales = async () => {
    return MirrorSaleOffer.query().orderBy("created_at", "desc").limit(20);
  };

  upsertSaleOffer = async (itemId: number, price: number) => {
    return MirrorSaleOffer.transaction(async (tx) => {
      const saleOffers = await MirrorSaleOffer.query(tx).insertGraphAndFetch([
        {
          mirror_item: {
            id: itemId,
          },
          price: price,
          is_complete: false,
        },
      ]);
      return saleOffers[0];
    });
  };
}

export { MirrorMarketService };
