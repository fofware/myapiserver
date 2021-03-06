import { Schema, model, Document } from "mongoose";
import { IComprobanteItems } from "./comprobanteitem";

export interface IComprobante extends Document {
  ca_pago: {};
  cae: {};
  operador: {};
//  emisor: {};  
  fecha: Date;
  sucursal: string;
  numero: number;
  operacion: string;
  persona: {};
  tipo: string;

  items: any[];
  bultos: number;
  sumaCompra: number;
  sumaReposicion: number;
  sumaNeto: number;
  pagoTipo: number;
  sumaAjustes: number;

  sumaBruto: number;

  sumaivas: [];
  sumaIva: number;
  percepsiones: [];
  sumaPercepciones: number;
  retenciones: [];
  sumaRetenciones: number;

  sumaTotal: number;
}

const ComprobanteSchema = new Schema({
  operador: { type: Schema.Types.ObjectId,
              ref: 'users'
            },
  ca_pago: {type: Object, default: {}},
  cae: {type: Object, defult: {} },
//  emisor: {type: Object, default: {} },
  fecha: {type: Date },
  sucursal: { type: String, default: "0002" },
  numero: {type: Number, default: 0},
  operacion: {type: String, defult: "" },
  persona: {type: Object, default: {}},
  tipo: {type: String, defult: "" },

  items: { type: Array, default: [] },
  bultos: { type: Number, default: 0 },
  sumaCompra: {type: Number, default: 0},
  sumaReposicion: {type: Number, default: 0},
  sumaNeto: {type: Number, default: 0},
  pagoTipo: {type: Number, default: 0},
  sumaAjustes: {type: Number, default: 0},

  sumaBruto: {type: Number, default: 0},

  sumaivas: { type: Array, default: [] },
  sumaIva: {type: Number, default: 0},
  percepsiones: { type: Array, default: [] },
  sumaPercepciones: {type: Number, default: 0},
  retenciones: { type: Array, default: [] },
  sumaRetenciones: {type: Number, default: 0},

  sumaTotal: {type: Number, default: 0}
});

export default model<IComprobante>('comprobantes', ComprobanteSchema);
