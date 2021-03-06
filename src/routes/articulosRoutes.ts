import { Router } from 'express';
import { articuloCtrl } from '../controlers/articuloControler';
import articulos from '../models/articulos';

class ArticulosRoutes {
    router : Router = Router();
    constructor (){
        this.config();
    };
    config(): void {
        this.router.get('/articulos/',articuloCtrl.index);
        this.router.use( articuloCtrl.router );
    }
};

const articulosRoutes = new ArticulosRoutes();

export default articulosRoutes.router;