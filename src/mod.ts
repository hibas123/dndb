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

    async find (query: IQuery<T>, projection: any = {}, cb?: (x: T[]) => void) {
        if (cb && typeof cb == 'function') return cb(await _find(this.filename, query, projection));
        return _find(this.filename, query, projection)
    }

    // Find first matching document

    async findOne(query: IQuery<T>, projection: any = {}, cb?: (x: T) => void) {
        projection = projection || {};
        if (cb && typeof cb == 'function') return cb(await _findOne(this.filename, query, projection));
        return _findOne(this.filename, query, projection)
    }

    // Inserts a document

    async insert (data: T, cb?: (x: any) => void) {
        if (cb && typeof cb == 'function') return cb(await _insert(this.filename, data));
        return _insert(this.filename, data)
    }

    // Updates matching documents

    async update (query: IQuery<T>, operators: any, projection: any = {}, cb?: (x: any) => void) {
        if (cb && typeof cb == "function") return cb(await _update(this.filename, query, operators, projection));
        return _update(this.filename, query, operators, projection)
    }

    // Removes matching document

    async remove(query: IQuery<T>, cb?: (x: any) => void) {
        if (cb && typeof cb == "function") return cb(await _remove(this.filename, query));
        return _remove(this.filename, query)
    }

} 

export { Datastore }

