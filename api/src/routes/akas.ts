import express, { Request, Response, Router } from "express";
import { AkasService } from "../services/akas";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";

function initAkasRouter(akasService: AkasService): Router {
  const router = express.Router();

  router.post(
    "/akas/mint",
    [body("recipient").exists(), body("amount").isDecimal()],
    validateRequest,
    async (req: Request, res: Response) => {
      const { recipient, amount } = req.body;

      const transaction = await akasService.mint(recipient, amount);
      return res.send({
        transaction,
      });
    }
  );

  router.post("/akas/setup", async (req: Request, res: Response) => {
    const transaction = await akasService.setupAccount();
    return res.send({
      transaction,
    });
  });

  router.post(
    "/akas/burn",
    [
      body("amount").isInt({
        gt: 0,
      }),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
      const { amount } = req.body;
      const transaction = await akasService.burn(amount);
      return res.send({
        transaction,
      });
    }
  );

  router.post(
    "/akas/transfer",
    [
      body("recipient").exists(),
      body("amount").isInt({
        gt: 0,
      }),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
      const { recipient, amount } = req.body;
      const transaction = await akasService.transfer(recipient, amount);
      return res.send({
        transaction,
      });
    }
  );

  router.get(
    "/akas/balance/:account",
    async (req: Request, res: Response) => {
      const balance = await akasService.getBalance(req.params.account);
      return res.send({
        balance,
      });
    }
  );

  router.get("/akas/supply", async (req: Request, res: Response) => {
    const supply = await akasService.getSupply();
    return res.send({
      supply,
    });
  });

  return router;
}

export default initAkasRouter;
