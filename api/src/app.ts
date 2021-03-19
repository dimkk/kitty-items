import "express-async-errors";
import express, { Request, Response } from "express";
import Knex from "knex";
import cors from "cors";
import { Model } from "objection";
import { json, urlencoded } from "body-parser";
import { KibblesService } from "./services/kibbles";
import { KittyItemsService } from "./services/kitty-items";
import { MarketService } from "./services/market";
import initKibblesRouter from "./routes/kibbles";
import initKittyItemsRouter from "./routes/kitty-items";
import initMarketRouter from "./routes/market";

import { AkasService } from "./services/akas"
import { MirrorItemsService } from "./services/mirror-items"
import { MirrorMarketService } from "./services/mirror-market"
import initAkasRouter from "./routes/akas"
import initMirrorItemsRouter from "./routes/mirror-items"
import initMirrorMarketRouter from "./routes/mirror-market"

const V1 = "/v1/";

// Init all routes, setup middlewares and dependencies
const initApp = (
  knex: Knex,
  kibblesService: KibblesService,
  kittyItemsService: KittyItemsService,
  marketService: MarketService,
  akasService : AkasService,
  mirrorItemsService : MirrorItemsService,
  mirrorMarketService : MirrorMarketService
) => {
  Model.knex(knex);
  const app = express();

  // @ts-ignore
  app.use(cors());
  app.use(json());
  app.use(urlencoded({ extended: false }));
  app.use(V1, initKibblesRouter(kibblesService));
  app.use(V1, initKittyItemsRouter(kittyItemsService));
  app.use(V1, initMarketRouter(marketService));
  app.use(V1, initAkasRouter(akasService));
  app.use(V1, initMirrorItemsRouter(mirrorItemsService));
  app.use(V1, initMirrorMarketRouter(mirrorMarketService));

  app.all("*", async (req: Request, res: Response) => {
    return res.sendStatus(404);
  });

  return app;
};

export default initApp;
