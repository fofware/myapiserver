import { Schema, model, Document } from "mongoose";

export interface IProveedoresArticulos extends Document {
  proveedor: object;
  articulo: object;
  producto: object;
  name: string;
  codigo: string;
  stockMinimo: number;
  precioUltimaCpra: number;
  precioReposicion:number;
  ofertas: [];
  image: string;
}
const ProveedoresArticulosSchema = new Schema({
  proveedor: {
    type: Schema.Types.ObjectId
    ,ref: "personas"
    ,$id: '_id'
  }
  ,articulo: {
    type: Schema.Types.ObjectId
    ,ref: "articulos"
    ,$id: '_id'
  }
  ,producto: {
    type: Schema.Types.ObjectId
    ,ref: "productos"
    ,$id: "_id"
  }
  , name: { type: String, trim: true, requierd: false }
  , codigo: { type: String, trim: true }
  , precioUltimaCpra: { type: Number }
  , precioReposicion: { type: Number }
  , stockMinimo:{ type: Number }
  , ofertas: { type: Array, required: false}
  , image: { type: String }
})
export default model<IProveedoresArticulos>('ProveedoresArticulos', ProveedoresArticulosSchema);