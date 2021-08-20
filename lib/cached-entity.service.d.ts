import { EntityService, HttpOptions } from './entity.service';
import { Entity } from './entity';
import { Observable } from 'rxjs';
/**
 * The CachedEntityService provides wraps the EntityService and provides a cache that stores
 * previously fetched entity objects from the server. Objects within the cache are updated when
 * new values are fetched from the server.
 */
export declare abstract class CachedEntityService<T extends Entity> extends EntityService<T> {
    private globalCache;
    private cache;
    /**
     * This allows you to specify the source of a cache, which may change from a global source to
     * a cache contained within another entity (for example, a cache of comments in a task).
     *
     * @param source  the new source to be used for the cache. The global cache will be used if
     *                this is null or undefined.
     */
    set cacheSource(source: Map<string, T>);
    /**
     * This function is used to map the path ids to a unique key to locate the associated entity
     * within the cache.
     *
     * @param pathIds the pathIds used to determine the key
     * @returns       a unique key to identify the associated entity
     */
    private keyFromPathIds;
    /**
     * Make an update request to the endpoint, using the supplied object to identify which id to update.
     * If updated, the cache is updated ot set with the entity.
     *
     * @param pathIds An object with keys which match the placeholders within the endpointFormat string.
     * @param options Optional http options
     */
    update(pathIds: object | T, obj?: T, options?: HttpOptions): Observable<T>;
    /**
     * Make a query request (get all) to the end point, using the supplied parameters to determine path.
     * Caches all returned entities
     *
     * @param pathIds An object with keys which match the placeholders within the endpointFormat string.
     * @param other   Any other data that is needed to be passed to the creation of entities
     *                resulting from this get request.
     * @param options Optional http options
     * @returns {Observable} a new cold observable
     */
    query(pathIds?: object, other?: object, options?: HttpOptions): Observable<T[]>;
    /**
     * First, tries to retrieve from cache, the object with the id, or id field from the pathIds.
     * If found, return the item from cache, otherwise make a get request to the end point,
     * using the supplied parameters to determine path. Caches the returned object
     *
     * @param pathIds Either the id, if a number and maps simple to ':id', otherwise an object
     *                with keys the match the placeholders within the endpointFormat string.
     * @param other   Any other data that is needed to be passed to the creation of entities
     *                resulting from this get request.
     * @param options Optional http options
     */
    fetch(pathIds: number | string | Entity | object, other?: any, options?: HttpOptions): Observable<T>;
    /**
     * Checks if an entity exists for a given key within the current cache.
     *
     * @param key Key of entity to check for.
     * @returns true if the entity with key is in the cache
     */
    hasEntityInCache(key: string): boolean;
    /**
     * Store an entity in the cache - this will automatically be called on
     * query and get, but can be called directly in special cases.
     *
     * @param key key of the entity to store
     * @param entity the entity object to store in the cache
     */
    addEntityToCache(key: string, entity: T): void;
    /**
     * Read a given entity from the cache without interaction with the server.
     *
     * @param key key of entity to read from cache
     */
    getFromCache(key: string): T;
    /**
     * First, tries to retrieve from cache, the object with the id, or id field from the pathIds.
     * If found, return the item from cache, otherwise make a get request to the end point,
     * using the supplied parameters to determine path. Caches the returned object
     *
     * @param pathIds Either the id, if a number and maps simple to ':id', otherwise an object
     *                with keys the match the placeholders within the endpointFormat string.
     * @param other   Any other data that is needed to be passed to the creation of entities
     *                resulting from this get request.
     * @param options Optional http options
     */
    get(pathIds: number | string | object, other?: any, options?: HttpOptions): Observable<T>;
    /**
     * Make a create request to the endpoint, using the supplied parameters to determine the path.
     * The results of the request are cached using the key of the entity.
     *
     * @param pathIds An object with keys which match the placeholders within the endpointFormat string.
     * @param data    A FormData or object with the values to pass up in the body of the update/put request.
     * @param other   Any other data needed to be passed to the entity on creation
     * @param options Optional http options
     * @returns {Observable} a new cold observable with the newly created @type {T}
     */
    create(pathIds?: object, data?: FormData | object, other?: any, options?: HttpOptions): Observable<T>;
    /**
     * Make a delete request to the end point, using the supplied parameters to determine path.
     * If deleted, the object is removed from the cache.
     *
     * @param pathIds Either the id, if a number and maps simple to ':id', otherwise an object
     *                with keys the match the placeholders within the endpointFormat string.
     * @param options Optional http options
     */
    delete(pathIds: number | object, options?: HttpOptions): Observable<object>;
}
