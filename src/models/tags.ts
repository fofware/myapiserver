import { Schema, model, Document, Model } from "mongoose";

export interface ITag extends Document {
  name: string;
}
const tagSchema = new Schema({
  name:{ type: String, unique: true, required: true, lowercase: true, trim: true }
},{
  versionKey: false
})

export default model<ITag>( 'tags', tagSchema);
