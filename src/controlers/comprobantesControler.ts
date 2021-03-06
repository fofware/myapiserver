import { Request, Response, Router } from 'express';
import passport from "passport";
import comprobante from '../models/comprobante';
import producto from '../models/producto';
import articulo, { IArticulo } from '../models/articulos';
import { decimales, round } from '../common/utils';


class comprobantesControler {

	public router: Router = Router();
	constructor() {
		this.config();
	}

	config() {
		this.router.get('/api/comprobante/', passport.authenticate('jwt', { session: false }), this.index);
		this.router.post('/api/comprobante/add', passport.authenticate('jwt', { session: false }), this.add);
		this.router.get('/api/comprobantes/list', this.list);
		this.router.get('/api/comprobante/fecha', this.fechavta);
		this.router.get('/api/comprobantes/modifica', this.modifica);
		this.router.get('/api/comprobantes/test', this.test);
	}

	public index(req: Request, res: Response) {
		res.send('Comprobantes');
	}

	async list(req: Request, res: Response) {
		const comprobantes = await comprobante.find().sort({ name: 1 });
		res.json(comprobantes);
	}

	async add(req: Request, res: Response) {
		console.log(req.body)
		try {
			const newReg = new comprobante(req.body);
			await newReg.save();
			return res.status(200).json({ msg: 'Registro creado satisfactoriamente', newReg });

		} catch (error) {
			return res.status(500).json(error);

		}
	}
	async fechavta(req: Request, res: Response) {
		try {
			const qry = req.body;
			const data: any[] = await comprobante.aggregate([
				{ $match: qry }
				,

				{
					$unwind: "$items"
				}
				, {
					$addFields:
					{
						count: { $sum: 1 }
					}
				}
				,
				{
					$project:
					{
						'fecha': 1
						, 'hora': 1
						, 'art_id': '$items.productoId'
						, 'name': 1
						, 'cantidad': "$count"
						, 'subTotal': '$items.sumaTotal'
					}
				}
				, { $group: { _id: "$fecha", articulos: { $sum: '$cantidad' }, totalVta: { $sum: '$subTotal' } } }
				,
				{
					$sort: { '_id': 1 }
				}
			]);
			res.status(200).json(data)
		} catch (error) {
			res.status(500).json(error)
		}
	}
	async modifica(req: Request, res: Response) {
		try {
			const qry = req.body;
			const data: any[] = await comprobante.aggregate([
				{ $match: qry }
				, {
					$sort: { 'fecha': 1 }
				}
			]);
			let newData: [] = [];
/*
			for (let i = 0; i < data.length; i++) {
				const cmp = data[i];
				cmp.bultos = 0;
				for (let n = 0; n < cmp.items.length; n++) {
					const item = cmp.items[n];
					if (Number.isInteger(item.cantidad) ) cmp.bultos += item.cantidad;
					else cmp.bultos += 1;
				}
				await comprobante.updateMany({_id: cmp._id}, { $set: {cmp} });
			}
*/
/*
			for (let i = 0; i < data.length; i++) {
				const cmp = data[i];
				cmp.sumaCompra = cmp.sumaCompra == null ? 0 : cmp.sumaCompra;
				cmp.sumaReposicion = cmp.sumaReposicion == null ? 0 : cmp.sumaReposicion;
				cmp.bultos = 0;
				for (let n = 0; n < cmp.items.length; n++) {
					const item = cmp.items[n];
					if (Number.isInteger(item.cantidad) ) cmp.bultos += item.cantidad;
					else cmp.bultos += 1;
					
					if (item.compra == undefined
						|| !item.compra) item.compra = 0;

					if (item.reposicion == undefined
						|| !item.reposicion) item.reposicion = 0;

					const p: any = await producto.findById(item.productoId);
					if (item.compra == 0 || item.reposicion == 0) {
						if (p) {
							if (p.pesable == true) {
								const pp = await producto.findById( p.parent );
								if (pp) {
									item.compra = pp.compra/pp.contiene;
									item.reposicion = pp.reposicion/pp.contiene;
									item.sumaCompra = round(item.cantidad * pp.compra, decimales);
									item.sumaReposicion = round(item.cantidad * pp.reposicion, decimales);
								} else {
									console.log("error No pp", item)
									console.log("error No pp p", p)
								}
								cmp.bultos++;
							} else {
								item.compra = item.compra > 0 ? item.compra : p.compra || 0;
								item.reposicion = item.reposicion > 0 ? item.reposicion : p.reposicion || 0;
								if(!p.pCompra){
									let parent = item.productoId;
									let contenido = 1;
									do {
										const pp:any = await producto.findOne({parent: parent});
										if (pp) {
											contenido = contenido / pp.contiene;
											item.compra = round(pp.compra*contenido,decimales);
											item.reposicion = round(pp.reposicion*contenido,decimales);
											parent = pp._id;
										}
									} while ((item.compra == 0 || item.reposicion == 0) && parent);
								}
								cmp.bultos += item.cantidad;
								if (item.compra == 0 || item.reposicion == 0){
									console.log(item);
									item.compra = item.precio/1.3;
									item.reposicion = item.compra;
								}
							}
						} else {
							console.log("no p", item)
							item.compra = item.precio/1.3;
							item.reposicion = item.compra;
						}
					}
					item.sumaCompra = round(item.cantidad * item.compra , decimales);
					item.sumaReposicion = round(item.cantidad * item.reposicion, decimales);
					const a: any = await articulo.findById(item.articuloId);
					item.name = `${a.name} ${await p.getFullName()}`;
					if (p.parent && !p.pesable) {
						let parent = p.parent;
						do {
							let pp: any = await producto.findById(parent);
							item.name += await pp.getFullName();
							parent = pp.parent;
						} while (parent);
					}
					cmp.sumaReposicion += item.sumaReposicion;
					cmp.sumaCompra += item.sumaCompra;
				}
				await comprobante.updateMany({_id: cmp._id}, { $set: {cmp} });
			}
*/
			res.status(200).json(data)
		} catch (error) {
			console.log(error)
			res.status(500).json(error)
		}
	}

	async test(req: Request, res: Response) {
		try {
			const qry = req.body;
//			const qry = {fecha: null};
			const data: any[] = await comprobante.aggregate([
				{ $match: qry }
				, {
					$sort: { 'fecha': 1 }
				}
			]);
			let newData: [] = [];
/*
			for (let i = 0; i < data.length; i++) {
				const cmp = data[i];
				cmp.bultos = 0;
				for (let n = 0; n < cmp.items.length; n++) {
					const item = cmp.items[n];
					if (Number.isInteger(item.cantidad) ) cmp.bultos += item.cantidad;
					else cmp.bultos += 1;
				}
				await comprobante.updateMany({_id: cmp._id}, { $set: {cmp} });
			}
*/
/*
			for (let i = 0; i < data.length; i++) {
				const cmp = data[i];
				cmp.sumaCompra = cmp.sumaCompra == null ? 0 : cmp.sumaCompra;
				cmp.sumaReposicion = cmp.sumaReposicion == null ? 0 : cmp.sumaReposicion;
				cmp.bultos = 0;
				for (let n = 0; n < cmp.items.length; n++) {
					const item = cmp.items[n];
					if (Number.isInteger(item.cantidad) ) cmp.bultos += item.cantidad;
					else cmp.bultos += 1;
					
					if (item.compra == undefined
						|| !item.compra) item.compra = 0;

					if (item.reposicion == undefined
						|| !item.reposicion) item.reposicion = 0;

					const p: any = await producto.findById(item.productoId);
					if (item.compra == 0 || item.reposicion == 0) {
						if (p) {
							if (p.pesable == true) {
								const pp = await producto.findById( p.parent );
								if (pp) {
									item.compra = pp.compra/pp.contiene;
									item.reposicion = pp.reposicion/pp.contiene;
									item.sumaCompra = round(item.cantidad * pp.compra, decimales);
									item.sumaReposicion = round(item.cantidad * pp.reposicion, decimales);
								} else {
									console.log("error No pp", item)
									console.log("error No pp p", p)
								}
								cmp.bultos++;
							} else {
								item.compra = item.compra > 0 ? item.compra : p.compra || 0;
								item.reposicion = item.reposicion > 0 ? item.reposicion : p.reposicion || 0;
								if(!p.pCompra){
									let parent = item.productoId;
									let contenido = 1;
									do {
										const pp:any = await producto.findOne({parent: parent});
										if (pp) {
											contenido = contenido / pp.contiene;
											item.compra = round(pp.compra*contenido,decimales);
											item.reposicion = round(pp.reposicion*contenido,decimales);
											parent = pp._id;
										}
									} while ((item.compra == 0 || item.reposicion == 0) && parent);
								}
								cmp.bultos += item.cantidad;
								if (item.compra == 0 || item.reposicion == 0){
									console.log(item);
									item.compra = item.precio/1.3;
									item.reposicion = item.compra;
								}
							}
						} else {
							console.log("no p", item)
							item.compra = item.precio/1.3;
							item.reposicion = item.compra;
						}
					}
					item.sumaCompra = round(item.cantidad * item.compra , decimales);
					item.sumaReposicion = round(item.cantidad * item.reposicion, decimales);
					const a: any = await articulo.findById(item.articuloId);
					item.name = `${a.name} ${await p.getFullName()}`;
					if (p.parent && !p.pesable) {
						let parent = p.parent;
						do {
							let pp: any = await producto.findById(parent);
							item.name += await pp.getFullName();
							parent = pp.parent;
						} while (parent);
					}
					cmp.sumaReposicion += item.sumaReposicion;
					cmp.sumaCompra += item.sumaCompra;
				}
				await comprobante.updateMany({_id: cmp._id}, { $set: {cmp} });
			}
*/
			res.status(200).json(data)
		} catch (error) {
			console.log(error)
			res.status(500).json(error)
		}
	}



}

export const comprobanteCtrl = new comprobantesControler();