import { resolve } from 'https://deno.land/std/path/mod.ts';
import { _find, _insert, _findOne, _update, _remove } from './methods/mod.js';
import { init } from './storage.js';
import DataStoreOptions from './types/ds.options.ts'

type IQuery<T = any> = {
    [key in keyof T]: any;
} | any;

class Datastore<T = any> {
    public filename: string;
    constructor({ filename, autoload, timeStamp, onLoad = () => {} }: DataStoreOptions) {
        this.filename = filename ? resolve(Deno.cwd(), filename) : resolve(Deno.cwd(), "./database.json");
        if (autoload) this.loadDatabase().then(() => {
            onLoad()
        })
    };

    /*
    * Loads the database on first load and ensures that path exists.
    *
    */
    async loadDatabase () {
        return init(this.filename)
    }

    // Find a document

    async find (query: IQuery<T>, projection: any = {}, cb?: (x: T[]) => void): Promise<T[]> {
        const res = await _find(this.filename, query, projection);
        if (cb && typeof cb == 'function') cb(res);
        return res;
    }

    // Find first matching document

    async findOne(query: IQuery<T>, projection: any = {}, cb?: (x: T) => void): Promise<T | null> {
        projection = projection || {};
        const res = await _findOne(this.filename, query, projection);
        if (cb && typeof cb == 'function')  cb(res);
        return res;
    }

    // Inserts a document

    async insert (data: T, cb?: (x: any) => void): Promise<void> {
        const res = await _insert(this.filename, data)
        if (cb && typeof cb == 'function') cb(res);
        return res;
    }

    // Updates matching documents

    async update (query: IQuery<T>, operators: any, projection: any = {}, cb?: (x: any) => void): Promise<any> {
        const res = await _update(this.filename, query, operators, projection)
        if (cb && typeof cb == "function") cb(res);
        return res;
    }

    // Removes matching document

    async remove(query: IQuery<T>, cb?: (x: any) => void): Promise<any> {
        const res = await _remove(this.filename, query)
        if (cb && typeof cb == "function") cb(res);
        return res;
    }

} 

export { Datastore }

