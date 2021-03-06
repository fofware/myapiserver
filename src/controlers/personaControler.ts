import {Request, Response, Router} from 'express';
import passport from "passport";
import persona from '../models/persona';

class PersonaControler {

	public router: Router = Router();
	constructor() {
		this.config();
	}

	config () {
    this.router.get('/api/personas/list',passport.authenticate('jwt', {session:false}), this.list );
    this.router.get('/api/personas/search/:search',passport.authenticate('jwt', {session:false}), this.search );
    this.router.delete('/api/persona/:id',passport.authenticate('jwt', {session:false}), this.delete );
    this.router.get('/api/persona/:id',passport.authenticate('jwt', {session:false}), this.get );
    this.router.put('/api/persona/:id',passport.authenticate('jwt', {session:false}), this.put );
    this.router.post('/api/persona/add',passport.authenticate('jwt', {session:false}), this.add );
    this.router.post('/api/persona/find',passport.authenticate('jwt', {session:false}), this.find );
  }

	public index(req: Request, res: Response) {
		res.send('Usuarios');
	}

	async list(req: Request, res: Response) {
		const articulos = await persona.find().sort({name: 1});
		res.json(articulos);
	}

	async get(req: Request, res: Response) {
		const { id } = req.params
		persona.findById(id)
		.then( rpta => {
			return res.status(200).json(rpta);
		}).catch( err => {
			return res.status(404).json( err );
		})
	}
	
	async delete( req: Request, res: Response ){
		const { id } = req.params;
		persona.findByIdAndDelete(id).then( rpta => {
			console.log(rpta)
			res.status(200).json(rpta);
		}).catch(err => {
			console.log(err);
			res.status(500).json(err);
		})
	}

	async add( req: Request, res: Response ){
//		const art = await persona.findOne({ name: req.body.name });
//		if (art)
//			return res.status(400).json({ msg: 'Persona ya existe', art });
			const newReg = new persona(req.body);
			await newReg.save();
			return res.status(200).json({ msg: 'Usuario creado satisfactoriamente', newReg });
	}

	async put( req: Request, res: Response) {
		const { id } = req.params;
		persona.findOneAndUpdate ({_id: id}, { $set :  req.body  })
		.then( ret => {
			return res.status(200).json({ msg:"Update Ok" });
		}).catch (err => {
			return res.status(500).json( {error: err});
		})
	}

	search ( req: Request, res: Response ) {
		const { search } = req.params
    const qry = { $or: [ {"apellido": { $regex: new RegExp( search , 'i') }}, {"nombre": { $regex: new RegExp( search , 'i')}} ] }
		persona.find( qry ).sort({name: 1})
		.then( rpta => {
			return res.status(200).json(rpta);
		}).catch( err => {
			return res.status(500).json( {error: err});
		})
	}
	find( req: Request, res: Response){
		console.log(req.body);
    const qry = { $or: [ {"apellido": { $regex: new RegExp( req.body.search , 'i') }}, {"nombre": { $regex: new RegExp( req.body.search , 'i')}} ] }
		persona.find( qry ).sort({name: 1})
		.then( rpta => {
			return res.status(200).json(rpta);
		}).catch( err => {
			return res.status(500).json( {error: err});
		})
	}

}

export const personaCtrl = new PersonaControler();