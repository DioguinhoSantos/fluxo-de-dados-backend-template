import express, { Request, Response } from 'express';
import cors from 'cors'
import { accounts } from './database'
import { ACCOUNT_TYPE } from './types'

const app = express()

app.use(express.json())
app.use(cors())

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003")
})

app.get("/ping", (req: Request, res: Response) => {
    res.send("Pong!")
})

app.get("/accounts", (req: Request, res: Response) => {
    res.send(accounts)
})

app.get("/accounts/:id", (req: Request, res: Response) => {

    try {
        
        const id = String(req.params.id)
    
        const result = accounts.find((account) => account.id === id) 

        if (!result) {
            res.statusCode = 404;
            throw new Error("Não achamo");
        }
    
        res.status(200).send(result)

    } catch ( error: any ) {

        console.log(error);
        res.status(400).send(error.message);       

    }

})

app.delete("/accounts/:id", (req: Request, res: Response) => {
    
    try {
        
        const id = req.params.id
    
        const accountIndex = accounts.findIndex((account) => account.id === id)
        const result = accounts.find((account) => account.id === id)

        if (id[0] !== 'a') {
            res.statusCode = 400;
            throw new Error('id deve começar com a');
        }

        if (!result){
            res.statusCode = 400;
            throw new Error('Não encontrado')
        }
        
        if (accountIndex >= 0) {
            accounts.splice(accountIndex, 1)
        }

        res.status(200).send("Item deletado com sucesso")

    } catch (error) {
        console.log(error);
        res.status(400).send(error.message);  
    }
    
})

app.put("/accounts/:id", (req: Request, res: Response) => {
    const id = req.params.id

    const newId = req.body.id as string | undefined
    const newOwnerName = req.body.ownerName as string | undefined
    const newBalance = req.body.balance as number | undefined
    const newType = req.body.type as ACCOUNT_TYPE | undefined

    const account = accounts.find((account) => account.id === id) 

    if (account) {
        account.id = newId || account.id
        account.ownerName = newOwnerName || account.ownerName
        account.type = newType || account.type

        account.balance = isNaN(newBalance) ? account.balance : newBalance
    }

    res.status(200).send("Atualização realizada com sucesso")
})