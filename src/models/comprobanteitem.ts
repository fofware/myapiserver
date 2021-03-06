import { Schema, model, Document } from "mongoose";

export interface IComprobanteItems extends Document {
  _id: object;
  articuloId: object;
  productoId: object;
  name: string;
  precio: number;
  compra: number;
  reposicion: number;
  a_pago: number;
  a_persona: number;
  rPrecio: number;
  cantidad: number;
  sumaCompra: number;
  sumaReposicion: number;
  sumaAjuste: number;
  sumaNeto: number;
  sumaPrecio: number;
  descuento: number
  iva: []
  sumaIva: number;
  percepciones: []
  sumaPercepciones: number;
  retenciones: []
  sumaRetenciones: number;
  sumaBruto: number;
  sumaTotal: number;
}

const ComprobanteItemsSchema = new Schema({
  _id: { type: Schema.Types.ObjectId },
  articuloId: { type: Schema.Types.ObjectId },
  productoId: { type: Schema.Types.ObjectId },
  name: {type: String, default: ""},
  precio: { type: Number, default: 0 },
  compra: { type: Number, default: 0},
  reposicion: { type: Number, default: 0},
  a_pago: { type: Number, default: 0 },
  a_persona: { type: Number, default: 0 },
  rPrecio: { type: Number, default: 0 },
  cantidad: { type: Number, default: 0 },
  sumaCompra: { type: Number, default: 0 },
  sumaReposicion: { type: Number, default: 0 },
  sumaAjuste: { type: Number, default: 0 },
  sumaNeto: { type: Number, default: 0 },
  sumaPrecio: { type: Number, default: 0 },
  descuento: { type: Number, default: 0 },
  iva: [],
  sumaIva: { type: Number, default: 0 },
  percepciones: [],
  sumaPercepciones: { type: Number, default: 0 },
  retenciones: [],
  sumaRetenciones: { type: Number, default: 0 },
  sumaBruto: { type: Number, default: 0 },
  sumaTotal: { type: Number, default: 0 }
});

export default model<IComprobanteItems>('comprobanteitems', ComprobanteItemsSchema);
