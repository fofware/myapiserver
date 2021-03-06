import express, { Application, NextFunction } from 'express';
import { Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';

import indexRoutes from './routes/indexRoutes';
import peoplesRoutes from './routes/personaRoutes';
import articulosRt from './routes/articulosRoutes';

import passport from 'passport';
import passportMiddelware from './middlewares/passport';
import { userCtrl } from './controlers/userController';
import { personaCtrl } from './controlers/personaControler';
import { productoCtrl } from './controlers/productoControler';
import { ProveedoresArticulosCtrl } from './controlers/proveedoresArticulosControlers';
import { mongoCtrl } from './controlers/mongoTestControler';
import { cajaCtrl } from './controlers/cajaControlers';
import { comprobanteCtrl } from './controlers/comprobantesControler';
import authRoutes from './routes/authRoutes';

export default class Server {

	public app: Application;

	constructor() {
		this.app = express()
		this.config();
		this.routes();
	}
	config(): void {
//		this.app.set('port', process.env.PORT || 3000);
		this.app.use(morgan('common'));
		this.app.use(cors());
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: false }));
		this.app.use(passport.initialize());
		passport.use(passportMiddelware);
		this.app.disable('etag');
	}
	routes(): void {
	
		this.app.use(indexRoutes);
		this.app.use(authRoutes);
		this.app.use('/api', peoplesRoutes);
		this.app.use('/api', articulosRt);
		this.app.use('/api', productoCtrl.router);
		this.app.use( ProveedoresArticulosCtrl.router)
		this.app.use( personaCtrl.router );
		this.app.use( userCtrl.router );
		this.app.use( mongoCtrl.router);
		this.app.use( cajaCtrl.router);
		this.app.use( comprobanteCtrl.router);
	}
	start(): void {
		this.app.listen(this.app.get('port'), () => {
			console.log("Server Run at port", this.app.get('port'));
		});
	}
}
