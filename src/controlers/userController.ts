import { Request, Response, Router } from "express";
import User, { IUser } from "../models/user";
import { ExtractJwt } from "passport-jwt";
import jwt from 'jsonwebtoken';
import config from '../config/config';
import passport from "passport";

function createToken(user: IUser) {
  return jwt.sign({ id: user.id, 
    apellido: user.apellido, 
    nombre: user.nombre,
    email: user.email,
    direccion: user.direccion,
    celular: user.celular,
    fijo: user.fijo,
    zipcode: user.zipcode,
    localidad: user.localidad,
    roles: user.roles
  }, config.jwtSecret, {
    expiresIn: 86400
  });
};

export const signUp = async (req: Request, res: Response): Promise<Response> => {
  if (!req.body.email || !req.body.password)
    return res.status(400).json({ msg: 'Por favor. Envíe su e-Mail y contraseña' });
  const user = await User.findOne({ email: req.body.email });
  if (user)
    return res.status(400).json({ msg: 'eMail ya existe' });
  if (req.body.password !== req.body.password2)
    return res.status(400).json({msg: 'Las contraseñas no coinciden'})
  delete req.body.password2;
  const newUser = new User(req.body);

  await newUser.save();
  delete newUser.password;
  const token = createToken(newUser);
  console.log(newUser);
  delete newUser.__v;
  delete newUser.password;
  newUser.__v = null;
  newUser.password = null;
  return res.status(200).json({ token, newUser });
};

export const signIn = async (req: Request, res: Response): Promise<Response> => {
  if (!req.body.email || !req.body.password)
    return res.status(401).json({ msg: 'Por favor. Envíe su e-Mail y contraseña' });
  let user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(401).json({ msg: 'Usuario o contraseña ivalidos' });
  const isMatch = await user.comparePassword(req.body.password);
  if (!isMatch)
    return res.status(401).json({ msg: 'Contraseña o Usuario ivalidos' });
  const token = createToken(user);
  console.log(user);
  delete user.__v ;
  delete user.password;
  user.password = null;
  user.__v = null
  return res.status(200).json({ token, user  });
};
/*
export const list = async ( req: Request, res: Response ) =>{
  User.find({}, {password: 0}).sort({name: 1})
  .then( rpta  =>{
    return res.status(200).json(rpta);
  })
  .catch( err =>{
    return res.status(500).json( {error: err});
  } )
}

export const del = async ( req: Request, res: Response ) =>{
  const { id } = req.params
  User.findByIdAndDelete(id)
  .then( rpta  =>{
    console.log(rpta);
    return res.status(200).json(rpta);
  }).catch( err =>{
    return res.status(500).json( {error: err});
  } )
}

export const get = async ( req: Request, res: Response ) =>{
  const { id } = req.params
  User.findById(id, {password: 0})
  .then( rpta => {
    return res.status(200).json(rpta);
  }).catch( err => {
    return res.status(500).json( {error: err});
  })
}

export const put = async ( req: Request, res: Response) => {
  const { id } = req.params;
  User.findOneAndUpdate ({_id: id}, { $set :  req.body  })
  .then( ret => {
    return res.status(200).json({ msg:"Update Ok" });
  }).catch (err => {
    return res.status(500).json( {error: err});
  })
}

export const add = async (req: Request, res: Response) => {
  if (!req.body.email || !req.body.password)
    return res.status(400).json({ msg: 'Por favor. Envíe su e-Mail y contraseña' });
  const user = await User.findOne({ email: req.body.email });
  if (user)
    return res.status(400).json({ msg: 'eMail ya existe' });
  if (req.body.password !== req.body.password2)
    return res.status(400).json({msg: 'Las contraseñas no coinciden'})
  delete req.body.password2;
  const newUser = new User(req.body);

  await newUser.save();
  return res.status(200).json({ msg: 'Usuario creado satisfactoriamente' });
};

export const buscar = async ( req: Request, res: Response ) => {
  const { search } = req.params;
  { $or: [{ name: "Rambo" }, { breed: "Pugg" }, { age: 2 }] }  
  const qry = { $or: [ {"apellido": { $regex: new RegExp( search , 'i') }}, {"nombre": { $regex: new RegExp( search , 'i')}} ] }
  console.log(qry)
  User.find( qry ).sort({name: 1})
  .then( rpta => {
    return res.status(200).json(rpta);
  }).catch( err => {
    return res.status(500).json( {error: err});
  })
}

*/
class UserControler {

	public router: Router = Router();
	constructor() {
		this.config();
	}

	config () {
    this.router.post('/signup', signUp);
    this.router.post('/signin', signIn);
    this.router.get('/api/users/list', this.list );
    this.router.get('/api/users/search/:search',passport.authenticate('jwt', {session:false}), this.buscar );
    this.router.delete('/api/user/:id',passport.authenticate('jwt', {session:false}), this.delete );
    this.router.get('/api/user/:id',passport.authenticate('jwt', {session:false}), this.get );
    this.router.put('/api/user/:id',passport.authenticate('jwt', {session:false}), this.put );
    this.router.post('/api/user/add',passport.authenticate('jwt', {session:false}), this.add );
  }

	public index(req: Request, res: Response) {
		res.send('Usuarios');
	}

	async list(req: Request, res: Response) {
		const articulos = await User.find().sort({name: 1});
		res.json(articulos);
	}

	async get(req: Request, res: Response) {
		const { id } = req.params
		User.findById(id)
		.then( (rpta: any) => {
			return res.status(200).json(rpta);
		}).catch( (err: any) => {
			return res.status(404).json( err );
		})
	}
	
	async delete( req: Request, res: Response ){
		const { id } = req.params;
		User.findByIdAndDelete(id).then( (rpta: any) => {
			console.log(rpta)
			res.status(200).json(rpta);
		}).catch((err: any) => {
			console.log(err);
			res.status(500).json(err);
		})
	}

	async add( req: Request, res: Response ){
		const art = await User.findOne({ name: req.body.name });
		if (art)
			return res.status(400).json({ msg: 'Usuario ya existe', art });
			const newArticulo = new User(req.body);
			await newArticulo.save();
			return res.status(200).json({ msg: 'Usuario creado satisfactoriamente', newArticulo });
	}

	async put( req: Request, res: Response) {
		const { id } = req.params;
		User.findOneAndUpdate ({_id: id}, { $set :  req.body  })
		.then( (_ret: any) => {
			return res.status(200).json({ msg:"Update Ok" });
		}).catch ((err: any) => {
			return res.status(500).json( {error: err});
		})
	}

	buscar ( req: Request, res: Response ) {
		const { search } = req.params
    const qry = { $or: [ {"apellido": { $regex: new RegExp( search , 'i') }}, {"nombre": { $regex: new RegExp( search , 'i')}} ] }
		User.find( qry ).sort({name: 1})
		.then( (rpta: any) => {
			return res.status(200).json(rpta);
		}).catch( (err: any) => {
			return res.status(500).json( {error: err});
		})
	}
	
}

export const userCtrl = new UserControler();