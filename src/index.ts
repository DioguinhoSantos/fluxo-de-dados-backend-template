import express, { Request, Response } from "express";
import cors from "cors";
import { accounts } from "./database";
import { ACCOUNT_TYPE } from "./types";
import { send } from "process";

const app = express();

app.use(express.json());
app.use(cors());

app.listen(3003, () => {
  console.log("Servidor rodando na porta 3003");
});

app.get("/ping", (req: Request, res: Response) => {
  res.send("Pong!");
});

app.get("/accounts", (req: Request, res: Response) => {
  res.send(accounts);
});

app.get("/accounts/:id", (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const result = accounts.find((account) => account.id === id);

    if (id[0] !== "a") {
      res.statusCode = 402;
      throw new Error('tem que começar com "a"');
    }

    if (!result) {
      res.statusCode = 401;
      throw new Error("Não achamo");
    }

    res.status(200).send(result);
  } catch (error: any) {
    // console.log(error);
    res.status(res.statusCode).send(error.message);

    if (res.statusCode === 200) {
      req.statusCode = 500;
    }
  }
});

app.delete("/accounts/:id", (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const accountIndex = accounts.findIndex((account) => account.id === id);
    const result2 = accounts.find((account) => account.id === id);

    if (id[0] !== "a") {
      res.statusCode = 402;
      throw new Error('tem que começar com "a"');
    }

    if (!result2) {
      res.statusCode = 401;
      throw new Error("num tem essa conta");
    }

    if (accountIndex >= 0) {
      accounts.splice(accountIndex, 1);
    }

    res.status(200).send("Item deletado com sucesso");
  } catch (error: any) {
    console.log(error);

    res.status(res.statusCode).send(error.message);
  }
});

app.put("/accounts/:id", (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const newId = req.body.id as string | undefined;
    const newOwnerName = req.body.ownerName as string | undefined;
    const newBalance = req.body.balance as number | undefined;
    const newType = req.body.type as ACCOUNT_TYPE | undefined;
    
    const account = accounts.find((account) => account.id === id);
    
    if (!account) {
      res.statusCode = 401;
      throw new Error("num tem essa conta");
    }

    if (newId !== undefined) {
      if (newId[0] !== "a") {
        res.statusCode = 402;
        throw new Error('Id tem que começar com "a"');
      }
    }

    if (newOwnerName !== undefined) {
      if (newOwnerName.length < 2) {
        res.statusCode = 403;
        throw new Error("O nome deve ter pelo menos 2 caracteres");
      }
    }

    if (newBalance !== undefined) {
      //typeof sempre retorna uma string
      if (typeof newBalance !== "number") {
        res.statusCode = 400;
        throw new Error("bota um número");
      }

      if (newBalance <= 0) {
        res.statusCode = 400;
        throw new Error("O valor precisa ser maior ou igual a zero");
      }
    }

    if (newType !== undefined) {
      if (
        newType !== ACCOUNT_TYPE.GOLD &&
        newType !== ACCOUNT_TYPE.PLATINUM &&
        newType !== ACCOUNT_TYPE.BLACK
      ) {
        res.statusCode = 400;
        throw new Error("Selecione um tipo válido");
      }
    }

    if (account) {
      account.id = newId || account.id;
      account.ownerName = newOwnerName || account.ownerName;
      account.type = newType || account.type;

      account.balance = isNaN(newBalance) ? account.balance : newBalance;
    }

    res.status(200).send("Atualização realizada com sucesso");
    
  } catch (error: any) {
    console.log(error);

    res.status(res.statusCode).send(error.message);
  }
});
