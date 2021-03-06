import { Schema, model, Document } from "mongoose";

export interface IProducto extends Document {
  articulo: object;
  parent: object;
  name: string;
  contiene: number;
  unidad: string;
  precio: number;
  compra: number;
  reposicion: number;
  pesable: boolean;
  servicio: boolean;
  pVenta: boolean;
  pCompra: boolean;
  codigo: string;
  plu: number;
  image: string;
  stock: number;
  stockMin: number;
  iva: number;
  margen: number;

//  getFullName: () => Promise<string>
}

const productoSchema = new Schema({
  articulo: {
    type: Schema.Types.ObjectId
    ,ref: "articulos"
  }
  , parent: {
    type: Schema.Types.ObjectId
    ,ref: "productos"
    ,default: null
  }
  , name: { type: String, trim: true, default: "" }
  , contiene: { type: Number, default: 0 }
  , unidad: { type: String, trim: true, default: "" }
  , precio: { type: Number, default: 0 }
  , compra: { type: Number, default:0 }
  , reposicion: { type: Number, default:0 }
  , pesable: { type: Boolean, default: false }
  , servicio: { type: Boolean, default: false }
  , pVenta: { type: Boolean, default: true }
  , pCompra: { type: Boolean, default: true }
  , codigo: { type: String, trim: true, default: '' }
  , plu: { type: String, default: "" }
  , image: { type: String, trim: true, default: "" }
  , stock: { type: Number, default: 0 }
  , stockMin: { type: Number, default: 0 }
  , iva: { type:Number, default: 0 }
  , margen: { type: Number, default: 35 }
  , tags: { ref: "tags", type: Schema.Types.ObjectId}
})


/*
productoSchema.methods.getFullName = async function (): Promise<string> {
  let descr = "";
  let prod = this;
  if (prod.contiene && prod.contiene > 1) descr += `${prod.name} ${prod.contiene} ${prod.unidad}`
  else if (prod.unidad) descr += `${prod.name} ${prod.unidad}`
  else descr += `${prod.name}`

//
//if(prod.parent){
//  const p = await this.findById(prod.parent);
//  descr += p.getFullName();
//}
//
  return descr;
}
*/
export default model<IProducto>('Producto', productoSchema);
/*

[
   { parent: null, name: 'paquete', contiene: 1, precio: 10.50 }
  ,{ parent: 'paquete', name:'Pack Familiar 3', contiene: 3, precio: 30 }
  ,{ parent: 'Pack Familiar 3', name: 'Caja', contiene: 20, precio: 600 }
  ,{ parent: 'paquete', name:'Pack Familiar 5', contiene: 5, precio: 50 }
  ,{ parent: 'Pack Familiar 5', name: 'Caja', contiene: 20, precio: 1000}
]

db.testing.aggregate( [
  {
     $graphLookup: {
        from: "testing"
        ,startWith: "$parent"
        ,connectFromField: "parent"
        ,connectToField: "name"
        ,as: "reportingHierarchy"
        ,depthField: "nivel"
     }
  }
] ).pretty()


db.testing.aggregate( [
  { $match: { "name": "Caja" } },
  { $graphLookup: {
      from: "testing",
      startWith: "$parent",
      connectFromField: "parent",
      connectToField: "name",
      as: "result"
    }
  },
  { $project: {
      "name": 1,
      "connections who play golf": "$result.name"
    }
  }
] )

db.testing.aggregate( [
  { $match: { "_id": ObjectId("5f10252bff2a855720b98681") } },
  { $graphLookup: {
      from: "testing"
      ,startWith: "$parent"
      ,connectFromField: "parent"
      ,connectToField: "name"
      ,depthField: "nivel"
      ,as: "result"
    }
  }
  ,{ $project: {
    "name": 1
    , "contiene" : 1
    , "precio" : 1
    , "lista": "$result"
  }
}
] ).pretty()
*/