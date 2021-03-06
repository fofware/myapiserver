import { Schema, model, Document, Model } from "mongoose";

export interface IRole extends Document {
  name: string;
}
const roleSchema = new Schema({
  name:{ type: String, unique: true, required: true, lowercase: true, trim: true }
},{
  versionKey: false
})

export default model<IRole>( 'roles', roleSchema);
