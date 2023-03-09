import Mongoose, { SchemaTypes } from 'mongoose';

export const userSchema = new Mongoose.Schema({
  code_tag: { type: String },
  record_time: [{ type: SchemaTypes.ObjectId, ref: 'record' }],
  username: { type: String },
});

export const record = new Mongoose.Schema({
  record_time: { type: String },
  username: { type: String },
});

export interface User {
  code_tag: string;
  record_time: Array<object>;
  username: string;
}

export type UserParam = {
  code_tag: string;
  record_time: Array<object>;
  username: string;
};

export class UserDto {
  code_tag: string;
  record_time: Array<object>;
  username: string;
}

//

export interface Record {
  record_time: string;
  username: string;
}
export type RecordParam = {
  record_time: string;
  username: string;
};
export class RecordDto {
  record_time: string;
  username: string;
}
