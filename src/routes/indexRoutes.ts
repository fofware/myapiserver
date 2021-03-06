import { Router } from 'express';
import {indexCtrl} from '../controlers/indexControler';

class IndexRoutes {
    router : Router = Router();
    constructor (){
        this.config();
    };
    config(): void {
        this.router.get('/',indexCtrl.index);
        this.router.get('/api/Oid',indexCtrl.genObjectId);
    }
};

const indexRoutes = new IndexRoutes();

export default indexRoutes.router;