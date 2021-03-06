import { Schema, model, Document } from "mongoose";

export interface ITmpVta extends Document {
  cliente: object;
  fecha: string;
  hora: number;
  itemsCount: number;
  subTotal: 0;
  pagoTipo: number;
  pagoRecargo: 0;
  kartList: [];
}

const tmpVtaSchema = new Schema({
  cliente: { type: Object }
  ,fecha: {type: String}
  ,hora: {type: Number}
  ,itemsCount: {type: Number}
  ,subTotal: {type: Number}
  ,pagoTipo: {type: Number}
  ,pagoRecargo: {type: Number}
  ,kartList: {type: Array}
})

export default model<ITmpVta>('tmpvtas', tmpVtaSchema);

