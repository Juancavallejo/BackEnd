import { ObjectId } from "../../../depts.ts"

export interface Products {
    _id:ObjectId,
    title:string,
    codigo:Number,
    thumbnail: string,
    stock: Number,
    price:number,
}