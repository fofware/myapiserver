import { Request, Response, Router } from 'express';
import articulo, { IArticulo } from '../models/articulos';
import { ObjectID } from 'bson'
import producto, { IProducto } from '../models/producto';
import { readParent, qryProductosProcess } from '../common/productosCommon';
import tmpvta, {ITmpVta} from '../models/caja';
import comprobante, { IComprobante } from '../models/comprobante';
import { round } from '../common/utils';

const readData4 = async function (qry: any) {
  qry = qryProductosProcess(qry);
  console.log(qry);
  try {
    qry = qryProductosProcess(qry);
    console.log(qry);

    const retData: any[] = await articulo.aggregate([
      {
        $addFields: {
          id: { $toString: "$_id" }
        }
      },
      {
        $lookup:
        {
          from: "productos",
          let: { 'articulos_id': { $toString: "$id" } },
          pipeline: [
            {
              $match:
              {
                $expr:
                {
                  $and:
                    [
                      { $eq: ["$productos_articulo", "$articulos_id"] }
                    ]
                }
              }
            }
          ],
          as: "stockData"
        }
      },
    ])
    return retData;
  } catch (error) {
    return error;
  }
}
const readData = async function (qry: any) {
  qry = qryProductosProcess(qry);
  console.log(qry);
  try {
    const artList = await articulo.find(qry.Articulo)
    for (let index = 0; index < artList.length; index++) {
      artList[index] = artList[index]._id;
    }
    console.log("articulos", artList.length)
    qry.Producto['articulo'] = { $in: artList }
    console.log("-------------------------------------------------")
    console.log(qry)
    console.log("-------------------------------------------------")
    console.log(qry.Producto)
    console.log("-------------------------------------------------")
    const retData: any[] = await producto.aggregate([
      { $match: qry.Producto },
      {
        $graphLookup:
        {
          from: "productos"
          , startWith: "$parent"
          , connectFromField: "parent"
          , connectToField: "_id"
          , as: "productos"
          //          ,restrictSearchWithMatch: qry.Producto
        }
      }
      /*
            ,
            {
              $lookup:
              {
                from: "articulos",
                localField: "articulo",
                foreignField: "_id",
                as: "articulo"
              }
            }
            ,
            {
              $unwind: "$articulo"
            }
            ,
            {
              $project:
              {
                "_id": 1
                , "art_id": "$articulo._id"
                , "art_name": "$articulo.name"
                , "art_image": "$articulo.image"
                , "name": 1
                , "contiene": 1
                , "unidad": 1
                , "precio": 1
                , "stock": 1
                , "image": 1
                , "parent": 1
                , "productos": 1
                , "pesable": 1
              }
            }
            ,
            {
              $sort: { 'art_name': 1, 'name': 1, 'contiene': 1, 'pesable': -1 }
            }
      */
    ])
    return retData;
  } catch (error) {
    return error;
  }
}

const readData1 = async function (qry: any) {
  qry = qryProductosProcess(qry);
  console.log(qry);
  try {
    const artList: any[] = await articulo.find(qry.Articulo)
    for (let index = 0; index < artList.length; index++) {
      artList[index] = new ObjectID(artList[index]._id);
    }
    qry.Producto['articulo'] = { $in: artList }
    console.log("-------------------------------------------------")
    console.log('qry', qry)
    console.log("-------------------------------------------------")
    console.log('qry.Producto', qry.Producto)
    /*
        console.log('qry.Producto.$or.stock',qry.Producto['$or'][0])
        
        console.log("-------------------------------------------------")
    */
    const retData: any[] = await producto.aggregate([
      { $match: qry.Producto },
      {
        $graphLookup:
        {
          from: "productos"
          , startWith: "$parent"
          , connectFromField: "parent"
          , connectToField: "_id"
          , as: "productos"
          //          ,restrictSearchWithMatch: qry.Producto
        }
      },
      /*
            {
              $lookup:
              {
                from: "productos",
                localField: "articulo",
                foreignField: "articulo",
                $project: { 'suma': 1, suma: { name: "$name" } } },
                  { $project: { suma: 1, suma: { name: "$name" } } },
                  { $replaceRoot: { newRoot: "$suma" } }
                ],
                as: "sumStock"
              }
            },
      */
      {
        $lookup:
        {
          from: "articulos",
          localField: "articulo",
          foreignField: "_id",
          as: "art_dat"
        }
      },
      {
        $unwind: "$art_dat"
      },
      {
        $project:
        {
          "_id": 1
          , "art_id": "$art_dat._id"
          , "art_name": "$art_dat.name"
          , "art_image": "$art_dat.image"
          //          , "name": {"$concat": [ "$art_dat.name", "$name"] }
          , "name": 1
          , 'articulo': 1
          , "contiene": 1
          , "unidad": 1
          , "precio": 1
          , "stock": 1
          , "image": 1
          , "parent": 1
          , "productos": 1
          , "pesable": 1
          , 'stockTotal': { "$sum": "$stock" }
        }
      },
      {
        $sort: { 'art_name': 1, 'name': 1, 'contiene': 1, 'pesable': -1 }
      }
    ])
    return retData;
  } catch (error) {
    return error;
  }
}
const readData3 = async function (qry: any) {
  try {
    let myMatch:any;
    let artList:any[] = [];
    console.log('Articulo',qry.Articulo)
    console.log("qry.Articulo['$and']", qry.Articulo['$and'])
//    console.log("qry.Articulo['$and'].length",qry.Articulo['$and'].length)

    if(qry.Articulo['$and'] && qry.Articulo['$and'].length == 1){
      myMatch = { '$or': [
        {'codigo': qry.Articulo['$and'][0]['name']['$regex']}
        ,{'plu': {'$eq': qry.Articulo['$and'][0]['name']['$regex']}}
      ]}
      console.log('myMatch', myMatch)
      artList = await producto.find(myMatch);
      console.log('artList',artList)
    }
    qry = qryProductosProcess(qry);
    if(myMatch == undefined || artList.length == 0){
      artList = await articulo.find(qry.Articulo)
      for (let index = 0; index < artList.length; index++) {
        artList[index] = new ObjectID(artList[index]._id);
      }
      myMatch = {'articulo':{'$in': artList } }
    }
    //    qry.Producto['articulo'] = { $in: artList }
    console.log("-------------------------------------------------")
    console.log('qry', qry)
    console.log("-------------------------------------------------")
    console.log('artList',artList)
    console.log('myMatch', myMatch)
    console.log("-------------------------------------------------")
    console.log('qry.Producto', qry.Producto)
    console.log("-------------------------------------------------")
    /*
        console.log('qry.Producto.$or.stock',qry.Producto['$or'][0])
        
        console.log("-------------------------------------------------")
    */
    const retData = await producto.aggregate([
      {
        $match: myMatch
      }
      ,{
        $addFields:
        {
          total: { $multiply: ["$stock", "$contiene"] }
        }
      },
      {
        $group:
        {
          _id: "$articulo",
          product: { $push: "$$ROOT" },
        }
      },
      {
        $addFields:
        {
          totalStock: { $sum: '$total' }
        }
      }
      , {
        $project: {
          'product': 1
          , '_id': 1
          , 'sumaTotal': { $sum: '$product.total' }
        }
      }
      , {
        $lookup:
        {
          from: "articulos",
          localField: "_id",
          foreignField: "_id",
          as: "art_dat"
        }
      }
      ,{
        $unwind: "$art_dat"
      }
      ,{
        $project:{
          '_id':0
          ,'art_name':'$art_dat.name'
          ,"art_image": '$art_dat.image'
          ,'art_url': '$art_dat.url'
          ,'image': '$art_dat.image'
          ,'sumaTotal':1
          ,'tproduct': '$product'
        }
      }
      ,{
        $unwind: "$tproduct"
      }
      ,{
        $project:{
          'art_name': 1
          ,'art_image': 1
          ,'sumaTotal':1
          ,'url': '$art_url'
          ,'id': '$tproduct._id'
          ,'articulo': '$tproduct.articulo'
          ,'parent': '$tproduct.parent'
          ,'name': '$tproduct.name'
          ,'contiene': '$tproduct.contiene'
          ,'unidad': '$tproduct.unidad'
          ,'precio': '$tproduct.precio'
          ,'pesable': '$tproduct.pesable'
          ,'codigo': '$tproduct.codigo'
          ,'plu': '$tproduct.plu'
          ,'image': '$tproduct.image'
          ,'stock': '$tproduct.stock'
          ,'total': '$tproduct.stock'
        }
      }
      ,{
        $match: qry.Producto
      }
      ,{
        $sort:{
          'art_name': 1, 'name': 1, 'contiene': 1, 'pesable': -1
        }
      }
    ])
    return retData;
  } catch (error) {
    return error;
  }
}

const readData2 = async function (qry: any) {
  qry = qryProductosProcess(qry);
  console.log(qry);
  try {
    const artList: any[] = await articulo.find(qry.Articulo)
    for (let index = 0; index < artList.length; index++) {
      artList[index] = new ObjectID(artList[index]._id);
    }
    //    qry.Producto['articulo'] = { $in: artList }
    console.log("-------------------------------------------------")
    console.log('qry', qry)
    console.log("-------------------------------------------------")
    console.log('qry.Producto', qry.Producto)
    /*
        console.log('qry.Producto.$or.stock',qry.Producto['$or'][0])
        
        console.log("-------------------------------------------------")
    */

  } catch (error) {
    return error;
  }
}

const loadData = async function (qry: any) {
  qry = qryProductosProcess(qry);
  console.log(qry);
  try {
    const retData: any[] = await articulo.aggregate([
      { $match: qry.Articulo }
      , {
        $graphLookup:
        {
          from: "productos"
          , startWith: "$_id"
          , connectFromField: "_id"
          , connectToField: "articulo"
          , as: "productos"
          , restrictSearchWithMatch: qry.Producto
        }
      }
      ,
      {
        $unwind: "$productos"
      }
      /*
          ,
          {
            $project:
            {
              "_id": 1
              , "name": 1
              , "image": 1
              , "contiene": 1
              , "unidad": 1
              , "precio": 1
              , "stock": 1
              , "image": 1
              , "parent": 1
              , "productos": 1
              , "pesable": 1
            }
          }
      */
      ,
      {
        $sort: { 'name': 1, 'productos.name': 1, 'productos.pesable': 1 }
      }
    ])
    return retData;
  } catch (error) {
    return error;
  }
}

class CajaControler {

  public router: Router = Router();
  constructor() {
    this.config();
  }

  config() {
    this.router.get('/caja', this.index)
    this.router.get('/caja/list', this.list);
    this.router.post('/api/caja/buscaProductos', this.buscaProductos)
    this.router.post('/api/caja/add', this.add)
    this.router.get('/api/caja/tmpvta',this.tmpvta);
    this.router.post('/api/caja/tmpvta',this.tmpvta);
    this.router.get('/api/caja/productos',this.productovta);
    this.router.post('/api/caja/productos',this.productovta);
    this.router.get('/api/caja/fecha',this.fechavta);
    this.router.post('/api/caja/fecha',this.fechavta);
    this.router.get('/api/caja/modifica',this.modifica);
  }

  public index(req: Request, res: Response) {
    res.send('Caja');
  }

  async list(req: Request, res: Response) {
    try {
      const rpta = await articulo.find().sort({ name: 1 });
      res.status(200).json(rpta);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async add(req: Request, res: Response){
    try {
      const newReg = new tmpvta(req.body);
      await newReg.save();
      res.status(200).json(newReg);
        
    } catch (error) {
      res.status(500).json(error);
    }

  }
  format_Data3(data: any) {
    console.log(data);
    console.log('data.length', data.length)
    let fmtData: any[] = [];
    for (let i = 0; i < data.length; i++) {
      const e = data[i];
      console.log(e);
      //      fmtData.push(e);
    }
    return fmtData;
  }
  async buscaProductos(req: Request, res: Response) {
    try {
      const data: any[] = await readData3(req.body);
      let fmtData: any[] = [];
      for (let i = 0; i < data.length; i++) {
        const e:any = data[i];
        e.image = e.image ? e.image : e.art_image;
        e.name = `${e.art_name} ${e.name} ${e.contiene} ${e.unidad}`;
        if(e.pesable == true){
          if(!e.stock || e.stock == null || e.stock == 0){
            e.stock = e.sumaTotal;
          }
        }
        fmtData.push(e); 
      }
      res.status(200).json(fmtData);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async buscarPersonas(req: Request, res: Response) {
    try {
      const { search } = req.params;
      const qry = { Articulo: { "name": { $regex: new RegExp(search, 'i') } }, Producto: {} }
      const rpta = await readData(qry);
      res.status(200).json(rpta);
    } catch (error) {
      res.status(404).json(error);
    }
  }

  async productosList(req: Request, res: Response) {
    try {
      const qry = (req.body ? req.body : { Articulo: {}, Producto: {} });
      console.log(qry);
      for (const key in qry.Articulo) {
        if (Object.prototype.hasOwnProperty.call(qry.Articulo, key)) {
          const element = qry.Articulo[key];
          if (element['$regex']) {
            qry.Articulo[key]['$regex'] = new RegExp(qry.Articulo[key]['$regex'], 'i')
          }
        }
      }
      for (const key in qry.Producto) {
        if (Object.prototype.hasOwnProperty.call(qry.Producto, key)) {
          const element = qry.Producto[key];
          if (element['$regex']) {
            qry.Producto[key]['$regex'] = new RegExp(qry.Producto[key]['$regex'], 'i')
          }
        }
      }
      const rpta = await readData(qry);
      res.status(200).json(rpta);
    } catch (error) {
      res.status(404).json(error);
    }
  }
  async modifica(req: Request, res: Response){
    try {
      const qry = req.body;
      const array: any[] = await tmpvta.aggregate([
        {$match: qry}
        ,{
          $sort: { 'fecha': 1, 'hora': 1 }
        }
      ]);
      let newData:any[]  = [];
      for (let i = 0; i < array.length; i++) {
        const e:any = array[i];
        const items:any = e.kartList;
        let sumaAjustes = 0;
        let sumaTotal = 0;
        let sumaNeto = 0;
        let sumaBruto = 0;
        let sumaCompra = 0;
        let sumaReposicion = 0;

        for (let n = 0; n < items.length; n++) {
          const it = items[n];
          it.articuloId = it.producto.articulo;
          if(`${it.producto.id}` == '5f20244a72c54e0596b974f4')
            it.productoId = new ObjectID("5f867a79b611bd2d1d797c8a")
          else
            it.productoId = it.producto.id;
          it.barcode = it.producto.barcode || "";
          it.name = it.producto.name;
          it.precio = it.producto.precio;
          it.rPrecio = it.valores.precio;
          it.compra = round((it.producto.precio / 1.3),2);
          it.reposicion = round((it.producto.precio / 1.3),2);
          it.sumaAjuste = round((it.valores.precio - it.producto.precio)*it.cantidad,2);
          it.sumaPrecio =  round(it.valores.precio*it.cantidad,2);
          it.sumaNeto =  round(it.valores.precio*it.cantidad,2);
          it.sumaBruto =  round(it.valores.precio*it.cantidad,2);
          it.sumaCompra = round(it.compra*it.cantidad,2);
          it.sumaReposicion = round(it.reposicion*it.cantidad,2);
          it.iva = [];
          it.sumaIva = 0;
          it.percepciones = [];
          it.sumaPercepciones = 0;
          it.retenciones = [];
          it.sumaRetenciones = 0;
          it.sumaTotal = it.sumaBruto;
          delete it.importe;
          delete it.valores;
          delete it.producto;
          sumaAjustes += it.sumaAjuste;
          sumaNeto += it.sumaNeto;
          sumaBruto += it.sumaBruto;
          sumaTotal += it.sumaTotal;
          sumaCompra += it.sumaCompra;
          sumaReposicion += it.sumaReposicion;
        }
        
        const cmp = {
          _id : e._id
          ,fecha: new Date(e.fecha)
          ,tipo: "venta"
          ,sumaivas: []
          ,numero: 0
          ,pagoTipo: 0
          ,percepsiones: []
          ,retenciones: []
          ,sucursal: "0002"
          ,sumaAjustes: sumaAjustes
          ,sumaIva: 0
          ,sumaBruto: sumaBruto
          ,sumaNeto: sumaNeto
          ,sumaTotal: sumaTotal
          ,sumaCompra: sumaCompra
          ,sumaReposicion: sumaReposicion
          ,persona: e.cliente
          ,items: e.kartList
        }  
        newData.push(cmp);
/*
        try {
          const c = await comprobante.findById(cmp._id);
          if ( c )
            await comprobante.updateOne({_id: cmp._id}, { $set: {cmp} })
          else 
            await comprobante.insertMany(cmp);
       } catch (e) {
          console.log(e);
       }
*/
      } 
      res.status(200).json(newData)
    } catch (error) {
      console.log(error)
      res.status(500).json(error)
    }
  }
  async tmpvta(req: Request, res: Response){
    try {
      const qry = req.body;
      const data: any[] = await tmpvta.aggregate([
        {$match: qry}
/*
        ,
        {
          $unwind: "$kartList"
        }
*/
/*
        ,{
          $addFields:
          {
            cantidadTotal: { $multiply: ["$kartList.cantidad", "$kartList.producto.contiene"] }
          }
        }
*/
/*
        ,
        {
          $project:
          {
            'fecha':1
            ,'hora': 1
            ,'art_id': '$kartList.producto.id'
            ,"name": '$kartList.producto.name'
            ,'precio':'$kartList.valores.precio'
            ,'cantidad': "$cantidadTotal"
            ,'subTotal': '$kartList.valores.total'
            ,'image': '$kartList.producto.image'
          }
        }
//        ,{ $group: { _id: "$name", cantidad: { $sum: "$cantidad" }, totalVta: {$sum: '$subTotal'} } }
        ,{ $group: { _id: "$fecha", cantidad: { $sum: "$cantidad" }, totalVta: {$sum: '$subTotal'} } }
*/
        ,
        {
          $sort: { 'fecha': 1, 'hora': 1 }
        }
      ]);
      res.status(200).json(data)
    } catch (error) {
      res.status(500).json(error)
    }

  }
  async productovta(req: Request, res: Response){
    try {
      const qry = req.body;

//      const qry = { $and: [ {fecha: {$gt: '2020-08-30'}}, {fecha: {$lt: '2020-11-01' } }] }
      const data: any[] = await tmpvta.aggregate([
        {$match: qry},
        {
          $unwind: "$kartList"
        },
        {
          $addFields:
          {
            cantidadTotal: { $multiply: ["$kartList.cantidad", "$kartList.producto.contiene"] }
          }
        },
        {
          $project:
          {
            'fecha':1
            ,'hora': 1
            ,'art_id': '$kartList.producto.articulo'
            ,'art_name': '$kartList.producto.art_name'
            ,'id': '$kartList.producto.id'
            ,"name": '$kartList.producto.name'
            ,'precio':'$kartList.valores.precio'
            ,'cantidad': "$cantidadTotal"
            ,'unidades': '$kartList.cantidad'
            ,'subTotal': '$kartList.valores.total'
            ,'image': '$kartList.producto.image'
          }
        },
        {
          $sort: { 'art_id': 1, 'name': 1 }
        },
        { 
          $group: { 
            _id: { name: "$name", Art_id: "$art_id" }, 
            cantidad: { $sum: "$cantidad" },
            unidades: { $sum: '$unidades'}, 
            totalVta: {$sum: '$subTotal'}
          } 
        },
        {
          $sort: { 'totalVta': -1 }
        },
        {
          $group: { 
            _id: '$_id.Art_id',
            data: { $push: "$$ROOT" },
            total: {$sum: '$totalVta'}
          }
        },
        {
          $sort: { 'total': -1 }
        },

        {
          $group: { 
            _id: '',
            data: { $push: "$$ROOT" },
            totalGral: {$sum: '$total'}
          }
        },
      ]);
      res.status(200).json(data)
    } catch (error) {
      res.status(500).json(error)
    }
  }

  async fechavta(req: Request, res: Response){
    try {
      const qry = req.body;
      const data: any[] = await tmpvta.aggregate([
        {$match: qry}
        ,

        {
          $unwind: "$kartList"
        }
        ,{
          $addFields:
          {
            cantidadTotal: { $multiply: ["$kartList.cantidad", "$kartList.producto.contiene"] }
            , count: {$sum: 1}
          }
        }
        ,
        {
          $project:
          {
            'fecha':1
            ,'hora': 1
            ,'art_id': '$kartList.producto.id'
            ,"name": '$kartList.producto.name'
            ,'precio':'$kartList.valores.precio'
            ,'cantidad': "$cantidadTotal"
            ,'count': '$count'
            ,'subTotal': '$kartList.valores.total'
            ,'image': '$kartList.producto.image'
          }
        }
        ,{ $group: { _id: "$fecha", articulos: { $sum: '$count' }, totalVta: {$sum: '$subTotal'} } }
        ,
        {
          $sort: { '_id': 1}
        }
      ]);
      res.status(200).json(data)
    } catch (error) {
      res.status(500).json(error)
    }

  }

}

export const cajaCtrl = new CajaControler();