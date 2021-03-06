import { Router } from 'express';
import {personaCtrl} from '../controlers/personaControler';

class PersonaRoute {
    router : Router = Router();
    constructor (){
        this.config();
    };
    config(): void {
        this.router.use(personaCtrl.router);
//        this.router.get('/',personaCtrl.index);

    }
};

const personaRoute = new PersonaRoute();

export default personaRoute.router;