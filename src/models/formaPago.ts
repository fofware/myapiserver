import { Schema, model, Document, Model } from "mongoose";

export interface IFormaPago extends Document {
  name: string;
  value: number;
}
const formaPagoSchema = new Schema({
  name:{ type: String, 
    unique: true, 
    required: true, 
    trim: true 
  }
  , value: {
    type: Number,
    default: 1
  }
},{
  timestamps: true,
  versionKey: false
})

export default model<IFormaPago>( 'formaPago', formaPagoSchema);
