import { Schema, model, Document } from "mongoose";

export interface IArticulo extends Document {
  fabricante: string;
  marca: string;
  rubro: string;
  linea: string;
  especie: string;
  edad: string;
  raza: string;
  name: string;
  d_fabricante: boolean;
  d_marca: boolean;
  d_rubro: boolean;
  d_linea: boolean;
  d_especie: boolean;
  d_edad: boolean;
  d_raza: boolean;
  private_web: boolean;
  image: string;
  url: string;
  iva: number;
  margen: number;
  tags: string;
};

const articuloSchema = new Schema({
  fabricante: { type: String, trim: true, default: ''}, // Nestle
  marca: { type: String, trim: true, default: ''},      // Purina Dog Chow / Purina Cat Chow
  rubro: { type: String, trim: true, default: ''},      // Alimento Seco / Alimento Húmedo
  linea: { type: String, trim: true, default: ''},      // ???????
  name: { type: String, trim: true, default: '' },      // Gatitos Carne y Leche
  especie: { type: String, trim: true, default: '' },   // Gato
  edad: { type: String, trim: true, default: '' },      // Gatito Cachorro
  raza: { type: String, trim: true, default: '' },      // 
  d_fabricante: {type: Boolean, default: false },
  d_marca: {type: Boolean, default: true },
  d_rubro: {type: Boolean, default: false },
  d_linea: {type: Boolean, default: false },
  d_especie: {type: Boolean, default: false},
  d_edad: {type: Boolean, default: false},
  d_raza: {type: Boolean, default: false},
  private_web: {type: Boolean, default: false },
  image: { type: String, trim: true, required: false },
  url: { type: String, trim: true, required: false, default:'' },
  iva: {type:Number, default: 0},
  margen: { type: Number, default: 35},
  tags: { type: String, trim: true, default: '' }
});

export default model<IArticulo>('Articulo', articuloSchema);

