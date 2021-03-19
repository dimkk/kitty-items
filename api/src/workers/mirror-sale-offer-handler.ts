import { BlockCursorService } from "../services/block-cursor";
import { FlowService } from "../services/flow";
import { EventDetails, BaseEventHandler } from "./base-event-handler";
import { MirrorMarketService } from "../services/mirror-market";

interface SaleOfferCreated {
  itemID: number;
  price: number;
}

class MirrorSaleOfferHandler extends BaseEventHandler {
  constructor(
    blockCursorService: BlockCursorService,
    flowService: FlowService,
    private readonly marketService: MirrorMarketService,
    eventName: string
  ) {
    super(blockCursorService, flowService, eventName);
  }

  async onEvent(details: EventDetails, payload: any): Promise<void> {
    const saleOfferEvent = payload as SaleOfferCreated;
    const saleOffer = await this.marketService.upsertSaleOffer(
      saleOfferEvent.itemID,
      saleOfferEvent.price
    );
    console.log("inserted sale offer = ", saleOffer);
  }
}

export { MirrorSaleOfferHandler };
