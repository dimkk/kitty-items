import { BaseModel } from "./base";
import { MirrorItem } from "./mirror-item";

class SaleOffer extends BaseModel {
  id?: string;
  price!: number;
  seller_address?: string;
  is_complete!: boolean;
  tx_hash?: string;

  mirror_item?: MirrorItem;

  static get tableName() {
    return "sale_offers";
  }

  static relationMappings = {
    kitty_item: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: MirrorItem,
      join: {
        from: "sale_mirror_offers.mirror_item_id",
        to: "mirror_items.id",
      },
    },
  };
}

export { SaleOffer };
