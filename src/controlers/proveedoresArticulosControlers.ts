import {Request, Response, Router} from 'express';
import { ObjectID } from 'bson'
import passport from "passport";
import articulo, { IArticulo } from '../models/articulos';
import producto, { IProducto } from '../models/producto';
import provArt from '../models/proveedoresArticulos';

/*
db.proveedoresarticulos.aggregate([
	{
		$lookup:
		{
			from: 'productos',
			localField: 'producto',
			foreignField: '_id',
			as: 'extradata'
		}
	}
	,{
		$unwind: "$extradata"
	}
])
	,{
		$project:{
			'barcode': '$extra_data.code',
			'proveedor': 1,
			'articulo': 1,
			'producto': 1,
			'name': 1,
			'codigo': 1,
			'stockMinimo': 1,
			'precioUltimaCpra': 1,
			'precioReposicion': 1,
			'ofertas': 1,
			'image': 1
		}
	}
])
*/	

const readProveedorArticulos = async function ( qry: any ) {
  try {
    let retData: any = { productos: <any>[], articulos: <any>[] };
    const artList = await articulo.find(qry.Articulo)
    for (let index = 0; index < artList.length; index++) {
      artList[index] = artList[index]._id;
    }
//    retData.productos = await provArt.find(qry.Proveedor)
		qry.Proveedor.proveedor = new ObjectID(qry.Proveedor.proveedor);
		console.log(qry.Proveedor)
		retData.productos = await provArt.aggregate([
			{
				$match: qry.Proveedor
			},
				{
					$lookup:{
						from: "productos",
						localField: "producto",
						foreignField: "_id",
						as: "extra_data"
					}
				}
				,{
					$unwind: "$extra_data"
				}
				,{
					$project:{
						'barcode': '$extra_data.codigo',
						'stock': '$extra_data.stock',
						'proveedor': 1,
						'articulo': 1,
						'producto': 1,
						'name': 1,
						'codigo': 1,
						'stockMinimo': 1,
						'precioUltimaCpra': 1,
						'precioReposicion': 1,
						'ofertas': 1,
						'image': 1
					}
				}
		])
		let noList: any = [];
    for (let i = 0; i < retData.productos.length; i++) {
      const e: any = retData.productos[i];
      noList[i] = new ObjectID(e.producto);
    }
  
    qry.Producto['pesable'] = { $ne: true };
    qry.Producto['_id'] = { $not: { $in: noList } }
    qry.Producto['articulo'] = { $in: artList }
  
    retData.articulos = await producto.aggregate([
      { $match: qry.Producto }
      , {
        $graphLookup:
        {
          from: "productos"
          , startWith: "$parent"
          , connectFromField: "parent"
          , connectToField: "_id"
          , as: "productos"
          ,restrictSearchWithMatch: qry.Producto
        }
      }
      , {
        $lookup:
        {
          from: "articulos",
          localField: "articulo",
          foreignField: "_id",
          as: "articulo"
        }
      }
      ,{
        $unwind: "$articulo"
      }
      ,{
        $project:
        {
          "_id": 1
          , "art_id": "$articulo._id"
          , "art_name": "$articulo.name"
					, "art_image": "$articulo.image"
					, "barcode": "$codigo"
					, "codigo": 1
          , "name": 1
          , "contiene": 1
          , "unidad": 1
          , "precio": 1
          , "stock": 1
					, "image": 1
					, "parent": 1
          , "productos": 1
        }
      }
      , {
        $sort: { 'art_name': 1, 'name': 1, 'contiene': 1 }
      }
    ])
    return retData;  
  } catch (error) {
    return error;
  }
/*


	try {
		if (!qry.Articulo) qry.Articulo = {};
		if (!qry.Producto) qry.Producto = {};
		if (!qry.Proveedor) qry.Proveedor = {};

		for (const key in qry.Articulo) {
			if (Object.prototype.hasOwnProperty.call(qry.Articulo, key)) {
				const array:any[] = qry.Articulo[key];
				if ( key == '$and' || key == '$or' ) {
					for (let i = 0; i < array.length; i++) {
						for (const id in array[i]){
							const element:any = array[i][id];
							if(element['$regex']){
								qry.Articulo[key][i][id] = {$regex: new RegExp(element['$regex'], element['mod'])}
							}
						}
						console.log(qry.Articulo[key])
					}
				} else {
					const element = qry.Articulo[key];
					if (element['$regex']) {
						qry.Articulo[key]['$regex'] = new RegExp(qry.Articulo[key]['$regex'], 'i')
					}
					if (element['$in']) {
						if (element['$in']['$regExp']) {
							let array = element['$in']['$regExp']
							for (let index = 0; index < array.length; index++) {
								array[index] = new RegExp(`^${array[index]}`, 'i');
								console.log(array[index])
							}
							qry.Articulo[key]['$in'] = array
						}
					}
				}
			}
		}
		let noProdList:any = [];
		let noArtList:any = [];
		let retData:any = {productos:<any>[], articulos:<any>[]};
		console.log(qry);
		if(qry.Proveedor.proveedor) {
			qry.Proveedor.proveedor = new ObjectID(qry.Proveedor.proveedor);
//			console.log("qry.Proveedor",qry.Proveedor);
			retData.productos = await provArt.find(qry.Proveedor);
//			console.log("retData.productos",retData.productos)
			for (let i = 0; i < retData.productos.length; i++) {
				const e:any = retData.productos[i];
				if (e.producto) noProdList.push(new ObjectID(e.producto));
				if (e.articulo) noArtList.push(new ObjectID(e.articulo));
			}
		}
		qry.Producto['pesable'] = { $ne: true };
		qry.Producto['_id'] = { $not: {$in: noProdList}}
		qry.Articulo['_id'] = { $not: {$in: noArtList}}
		console.log(noProdList);
		console.log(noArtList);
		console.log(qry);
		console.log(qry.Articulo['$and']);
		retData.articulos = await articulo.aggregate([
			{ $match: qry.Articulo }
			,{ $graphLookup:
				{
					from: "productos"
					,startWith: "$_id"
					,connectFromField: "parent"
					,connectToField: "articulo"
					,as: "productos"
					,restrictSearchWithMatch: qry.Producto
				}
			}
		]).sort({name: 1})
		return retData;
	} catch (error) {
		return error;		
	}
*/
}	

class ProveedoresArticulosControler {

	public router: Router = Router();
	constructor() {
		this.config();
	}

	config () {
    this.router.get('/api/proveedoresarticulos/list', this.list );
		this.router.post( '/api/proveedoresarticulos/', passport.authenticate('jwt', {session:false}), this.add );
		this.router.post( '/api/proveedoresarticulos/insmany', passport.authenticate('jwt', {session:false}), this.insMany );
		this.router.post( '/api/proveedoresarticulos/buscar', passport.authenticate('jwt', {session:false}), this.buscar );
		this.router.put( '/api/proveedoresarticulos/:id', passport.authenticate('jwt', {session:false}), this.put );
		this.router.delete( '/api/proveedoresarticulos/:id', passport.authenticate('jwt', {session:false}), this.delete );
	}

	async list(req: Request, res: Response) {
		const articulos = await provArt.find();
		res.json(articulos);
	}

	async buscar (req: Request, res: Response){
		let qry = req.body
		if (!qry.Articulo) qry.Articulo = {};
		if (!qry.Producto) qry.Producto = {};
		if (!qry.Proveedor) qry.Proveedor = {};

		for (const key in qry.Articulo) {
			if (Object.prototype.hasOwnProperty.call(qry.Articulo, key)) {
				const array: any[] = qry.Articulo[key];
				if (key == '$and' || key == '$or') {
					for (let i = 0; i < array.length; i++) {
						for (const id in array[i]) {
							const element: any = array[i][id];
							if (element['$regex']) {
								qry.Articulo[key][i][id] = { $regex: new RegExp(element['$regex'], element['mod']) }
							}
						}
					}
				} else {
					const element = qry.Articulo[key];
					if (element['$regex']) {
						qry.Articulo[key]['$regex'] = new RegExp(qry.Articulo[key]['$regex'], 'i')
					}
					if (element['$in']) {
						if (element['$in']['$regExp']) {
							let array = element['$in']['$regExp']
							for (let index = 0; index < array.length; index++) {
								array[index] = new RegExp(`^${array[index]}`, 'i');
							}
							qry.Articulo[key]['$in'] = array
						}
					}
				}
			}
		}

		for (const key in qry.Producto) {
			if (Object.prototype.hasOwnProperty.call(qry.Producto, key)) {
				const array: any[] = qry.Producto[key];
				if (key == '$and' || key == '$or') {
					for (let i = 0; i < array.length; i++) {
						for (const id in array[i]) {
							const element: any = array[i][id];
							if (element['$regex']) {
								qry.Producto[key][i][id] = { $regex: new RegExp(element['$regex'], element['mod']) }
							}
						}
					}
				} else {
					const element = qry.Producto[key];
					if (element['$regex']) {
						qry.Producto[key]['$regex'] = new RegExp(qry.Producto[key]['$regex'], 'i')
					}
					if (element['$in']) {
						if (element['$in']['$regExp']) {
							let array = element['$in']['$regExp']
							for (let index = 0; index < array.length; index++) {
								array[index] = new RegExp(`^${array[index]}`, 'i');
							}
							qry.Producto[key]['$in'] = array
						}
					}
				}
			}
		}

		try {
			const rpta = await readProveedorArticulos(qry);
			res.status(200).json(rpta);
		} catch (error) {
			res.status(404).json(error);
		}
	
	}
	async add( req: Request, res: Response){
		try {
			const reg = await provArt.findOne({ proveedor: new ObjectID(req.body.proveedor), producto: new ObjectID(req.body.producto), articulo: new ObjectID(req.body.articulo) });
			if (reg)
				return res.status(400).json({ msg: 'Registro ya existe', reg });
			const newReg = new provArt(req.body);
			await newReg.save();
			res.status(200).json( newReg );
		} catch (error) {
			res.status(500).json(error);
		}
	}
	async insMany( req: Request, res: Response){
		console.log(req.body)
	}
	async put( req: Request, res: Response) {
		try {
			const filter = { _id: req.params.id };
			const rpta = await provArt.findOneAndUpdate ( filter, { $set :  req.body  });
			return res.status(200).json( rpta );
		} catch (error) {
			return res.status(500).json( error );
		}
	}
	async delete( req: Request, res: Response ){
		try {
			const { id } = req.params;
			console.log("delete ",id);
			const rpta = await provArt.findByIdAndDelete(new ObjectID(id));
			res.status(200).json(rpta);
		} catch (error) {
			console.log(error);
			res.status(500).json(error);
		}
	}
}
export const ProveedoresArticulosCtrl = new ProveedoresArticulosControler();