import { Schema, model, Document, Model } from "mongoose";
import bcrypt from "bcrypt"

export interface IUser extends Document {
  email: string;
  password: string;
  apellido: string;
  nombre: string;
  fijo: string;
  celular: string;
  direccion: string;
  localidad: string;
  provincia: string;
  zipcode: string;
  pais: string;
  roles: [];

  comparePassword: ( password: string ) => Promise<boolean>;
}
const userSchema = new Schema({
  email:{ type: String, unique: true, required: true, lowercase: true, trim: true }
  , password:{ type: String, required: true }
  , apellido: { type: String, trim: true }
  , nombre: { type: String, trim: true }
  , fijo: { type: String, trim: true }
  , celular: { type: String, trim: true }
  , direccion: { type: String, trim: true }
  , localidad: { type: String, trim: true }
  , provincia: { type: String, trim: true }
  , zipcode: { type: String, trim: true }
  , pais: { type: String, trim: true }
  , roles: [{
    ref: "roles",
    type: Schema.Types.ObjectId,
    default: []
  }]
  
},{
  timestamps: true,
  versionKey: false
})
userSchema.pre<IUser>('save', async function(next) {
  const user = this;
  if(!user.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
  next();
});

userSchema.methods.comparePassword = async function( password: string ): Promise<boolean>  {
  const user:any = this;
  return await bcrypt.compare(password, user.password );
};

export default model<IUser>( 'User', userSchema);