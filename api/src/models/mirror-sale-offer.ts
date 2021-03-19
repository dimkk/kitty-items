import { BaseModel } from "./base";
import { MirrorItem } from "./mirror-item";

class MirrorSaleOffer extends BaseModel {
  id?: string;
  price!: number;
  seller_address?: string;
  is_complete!: boolean;
  tx_hash?: string;

  mirror_item?: MirrorItem;

  static get tableName() {
    return "mirror_sale_offers";
  }

  static relationMappings = {
    mirror_item: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: MirrorItem,
      join: {
        from: "mirror_sale_offers.mirror_item_id",
        to: "mirror_items.id",
      },
    },
  };
}

export { MirrorSaleOffer };
