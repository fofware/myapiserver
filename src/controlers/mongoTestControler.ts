import { Request, Response, Router } from 'express';
import { ObjectID } from 'bson'
import articulo, { IArticulo } from '../models/articulos';
import producto, { IProducto } from '../models/producto';
import provArt from '../models/proveedoresArticulos';

const readProductos = async function (qry: any) {
  if (!qry.Articulo) qry.Articulo = {};
  if (!qry.Producto) qry.Producto = {};
  if (!qry.Proveedor) qry.Proveedor = {};
  //  qry.Proveedor = { proveedor: new ObjectID("5f0e1d0201a3417b65776289")};
  //  qry.Articulo['$and'] = [ {name: { '$regex': 'coss', mod: 'i' } }, {name: { '$regex': 'cat', mod: 'i' } }];
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
  try {
    let retData: any = { productos: <any>[], articulos: <any>[] };
    const artList = await articulo.find(qry.Articulo)
    for (let index = 0; index < artList.length; index++) {
      artList[index] = artList[index]._id;
    }
    retData.productos = await provArt.find(qry.Proveedor)
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
      , {
        $unwind: "$articulo"
      }
      , {
        $project:
        {
          "_id": 1
          , "articulo": "$articulo.name"
          , "name": 1
          , "contiene": 1
          , "unidad": 1
          , "precio": 1
          , "stock": 1
          , "image": 1
          , "artimage": "$articulo.image"
          , "productos": 1
        }
      }
      , {
        $sort: { 'articulo': 1, 'name': 1, 'contiene': 1 }
      }
    ])
    return retData;  
  } catch (error) {
    return error;
  }
}
const readProductos1 = function (qry: any): PromiseLike<any[]> {
  if (!qry.Articulo) qry.Articulo = {};
  if (!qry.Producto) qry.Producto = {};
  if (!qry.Proveedor) qry.Proveedor = { proveedor: new ObjectID("5f0e1d0201a3417b65776289") };
  /*
    qry.Producto["$and"]=[]
    qry.Producto["$and"].push({'pesable':  { $ne: true }});
    qry.Producto["$and"].push({_id: { $not: []}});
  */
  let noList: any = [];
  provArt.find(qry.Proveedor).then(ret => {
    noList = ret;
    for (let i = 0; i < ret.length; i++) {
      const e: any = ret[i];
      noList[i] = new ObjectID(e.producto);
    }
  })
  qry.Producto['pesable'] = { $ne: true };
  qry.Producto['_id'] = { $not: { $in: noList } }
  //  qry.Producto['_id'] = {$in: ["5f2ef5338fa2e3381c64f2b6","5f2ef4d78fa2e3381c64f2b0","5f2ef5e38fa2e3381c64f2bd"]}
  console.log(noList);
  console.log(qry.Producto);
  return articulo.aggregate([
    { $match: qry.Producto }
    , {
      $graphLookup:
      {
        from: "productos"
        , startWith: "$_id"
        , connectFromField: "parent"
        , connectToField: "articulo"
        , as: "productos"
        , restrictSearchWithMatch: qry.Producto
      }
    }
    /*
        ,{
          $project:
          {
            "name": 1
            ,"image": 1
            ,"productos": { $not: [ { $eq: [ "$result.contiene", 1 ] }]}
          }
        }
    */
    /*
        ,{
          $not:[ { $eq: [ "$result.contiene", 1 ] }]
        }
      */
  ]).sort({ name: 1 })
}

class MongoTestControler {

  public router: Router = Router();
  constructor() {
    this.config();
  }

  config() {
    this.router.get('/mongo/test', this.list);
  }

  public index(req: Request, res: Response) {
    res.send('MongoTestControler');
  }

  async list(req: Request, res: Response) {
    try {
      const qry = (req.body ? req.body : { Articulo: {}, Producto: {} });
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
      for (const key in qry.Producto) {
        if (Object.prototype.hasOwnProperty.call(qry.Producto, key)) {
          const element = qry.Producto[key];
          if (element['$regex']) {
            qry.Producto[key]['$regex'] = new RegExp(qry.Producto[key]['$regex'], 'i')
          }
        }
      }
      console.log(qry)
      const rpta: any = await readProductos(qry);
      res.status(200).json(rpta);
    } catch (error) {
      res.status(404).json(error);
    }

  }
}
export const mongoCtrl = new MongoTestControler();
