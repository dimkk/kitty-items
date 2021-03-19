import { BaseModel } from "./base";

class MirrorItem extends BaseModel {
  id!: number;
  type_id?: number;
  owner_address?: string;

  static get tableName() {
    return "mirror_items";
  }
}

export { MirrorItem };
