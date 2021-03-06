import {Request, Response} from 'express';
import { ObjectID } from 'bson'

class IndexControler {
    public index (req: Request, res: Response){
        res.send('Index')
    }; 
	genObjectId(req: Request, res: Response){
		const newObjectId = new ObjectID();
        console.log(newObjectId);
        res.status(200).json(newObjectId);
	}
}

export const indexCtrl = new IndexControler();
