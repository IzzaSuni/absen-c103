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

export const secret = new Mongoose.Schema({
  secret: { type: String },
});

export const chatId = new Mongoose.Schema({
  id: { type: Number },
  first_name: { type: String },
});

export interface Chat {
  id: number;
  first_name: string;
}
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

export interface Secret {
  secret: string;
}
export type SecretParam = {
  secret: string;
};
export class SecretDto {
  secret: string;
}
