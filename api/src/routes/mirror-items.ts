import express, { Request, Response, Router } from "express";
import { MirrorItemsService } from "../services/mirror-items";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";

function initMirrorItemsRouter(mirrorItemsService: MirrorItemsService): Router {
  const router = express.Router();

  router.post(
    "/mirror-items/mint",
    [body("recipient").exists(), body("typeId").isInt()],
    validateRequest,
    async (req: Request, res: Response) => {
      const { recipient, typeId } = req.body;
      const tx = await mirrorItemsService.mint(recipient, typeId);
      return res.send({
        transaction: tx,
      });
    }
  );

  router.post("/mirror-items/setup", async (req: Request, res: Response) => {
    const transaction = await mirrorItemsService.setupAccount();
    return res.send({
      transaction,
    });
  });

  router.post(
    "/mirror-items/transfer",
    [body("recipient").exists(), body("itemId").isInt()],
    validateRequest,
    async (req: Request, res: Response) => {
      const { recipient, itemId } = req.body;
      const tx = await mirrorItemsService.transfer(recipient, itemId);
      return res.send({
        transaction: tx,
      });
    }
  );

  router.get(
    "/mirror-items/collection/:account",
    async (req: Request, res: Response) => {
      const collection = await mirrorItemsService.getCollectionIds(
        req.params.account
      );
      return res.send({
        collection,
      });
    }
  );

  router.get(
    "/mirror-items/item/:itemId",
    async (req: Request, res: Response) => {
      const item = await mirrorItemsService.getMirrorItemType(
        parseInt(req.params.itemId)
      );
      return res.send({
        item,
      });
    }
  );

  router.get("/mirror-items/supply", async (req: Request, res: Response) => {
    const supply = await mirrorItemsService.getSupply();
    return res.send({
      supply,
    });
  });

  return router;
}

export default initMirrorItemsRouter;
