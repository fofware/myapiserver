import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt"

export interface IRetencion {
  nombre: string;
  porcentaje: number;
  base: number;
}

export interface IPersona extends Document {
  email: string;
  apellido: string;
  nombre: string;
  cuit: string;
  fijo: string;
  celular: string;
  direccion: string;
  localidad: string;
  provincia: string;
  zipcode: string;
  pais: string;
  coeficiente: string;
  categoria: [];
  retiene:[]

//  comparePassword: (password: string) => Promise<boolean>

}
const personaSchema = new Schema({
  email:{ type: String, lowercase: true, trim: true }
  , apellido: { type: String, trim: true }
  , nombre: { type: String, trim: true }
  , cuit:{ type: String, trim: true }
  , fijo: { type: String, trim: true }
  , celular: { type: String, trim: true }
  , direccion: { type: String, trim: true }
  , localidad: { type: String, trim: true }
  , provincia: { type: String, trim: true }
  , zipcode: { type: String, trim: true }
  , pais: { type: String, trim: true }
  , coeficiente: { type: Number, default: 1 }
  , categoria: { type: Array }
})
/*
userSchema.pre<IPersona>('save', async function(next) {
  const user = this;
  if(!user.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
  next();
});

userSchema.methods.comparePassword = async function ( password: string ): Promise<boolean> {
  return await bcrypt.compare(password, this.password );
};
*/
export default model<IPersona>( 'Persona', personaSchema);