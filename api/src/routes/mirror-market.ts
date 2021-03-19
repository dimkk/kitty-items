import express, { Request, Response, Router } from "express";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";
import { MirrorMarketService } from "../services/mirror-market";

function initMirrorMarketRouter(mirrorMarketService: MirrorMarketService): Router {
  const router = express.Router();

  router.post(
    "/mirror-market/buy",
    [body("account").exists(), body("itemId").isInt()],
    validateRequest,
    async (req: Request, res: Response) => {
      const { account, itemId } = req.body;
      const tx = await mirrorMarketService.buy(account, itemId);
      return res.send({
        transactionId: tx,
      });
    }
  );

  router.post("/mirror-market/setup", async (req: Request, res: Response) => {
    const tx = await mirrorMarketService.setupAccount();
    return res.send({
      transactionId: tx,
    });
  });

  router.post(
    "/mirror-market/sell",
    [body("itemId").isInt(), body("price").isDecimal()],
    validateRequest,
    async (req: Request, res: Response) => {
      const { itemId, price } = req.body;
      const tx = await mirrorMarketService.sell(itemId, price);
      return res.send({
        transactionId: tx,
      });
    }
  );

  router.get(
    "/mirror-market/collection/:account",
    async (req: Request, res: Response) => {
      const items = await mirrorMarketService.getItems(req.params.account);
      return res.send({
        items,
      });
    }
  );

  router.get(
    "/mirror-market/collection/:account/:item",
    async (req: Request, res: Response) => {
      const item = await mirrorMarketService.getItem(
        req.params.account,
        parseInt(req.params.item)
      );
      return res.send({
        item,
      });
    }
  );

  router.get("/mirror-market/latest", async (req: Request, res: Response) => {
    const latestSaleOffers = await mirrorMarketService.findMostRecentSales();
    return res.send({
      latestSaleOffers,
    });
  });

  return router;
}

export default initMirrorMarketRouter;
