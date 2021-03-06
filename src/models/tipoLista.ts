import { Schema, model, Document, Model } from "mongoose";

export interface ITipoLista extends Document {
  name: string;
  basePrecio: string; 
  value: number;
  margen: boolean;
}
const tipoListaSchema = new Schema({
  name:{ type: String, 
    unique: true, 
    required: true, 
    trim: true 
  }
  , basePrecio: {
    type: String,
    enum: ['costo', 'reposicion', 'promedio', 'precio'],
    default: 'reposiciom'
  }
  , value: {
    type: Number,
    default: 1
  }
  , margen: {
    type: Boolean,
    default: true
  }
},{
  timestamps: true,
  versionKey: false
})

export default model<ITipoLista>( 'tipoLista', tipoListaSchema);
