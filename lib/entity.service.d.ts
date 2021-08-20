import { Entity } from './entity';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface HttpOptions {
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };
    observe?: 'body';
    params?: HttpParams | {
        [param: string]: string | string[];
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
    /**
     * Use the alternate end point format to override the end point used.
     */
    alternateEndpointFormat?: string;
}
/**
 * ResourceService, responsible for the CRUD actions for all resources which inherit form it.
 * This is used to interact with the server, and create Entity objects that are returned for
 * use within the application.
 */
export declare abstract class EntityService<T extends Entity> {
    private httpClient;
    /**
     * Provide a string template for the endpoint URLs in the format
     * 'path/to/:id1:/other/:id2:' where ':id1:' and ':id2:' are placeholders for id values
     * passed into the CRUD methods.
     *
     * Use :id for simple cases eg: 'users/:id:'. This can then be shortcut to provide just the
     * value without needing to indicate the key to replace. eg UserService.get(1) instead of
     * UserService.get({id: 1}])
     * @returns {string} The endpoint string format
     */
    protected abstract readonly endpointFormat: string;
    abstract entityName: string;
    get serverKey(): string;
    constructor(httpClient: HttpClient);
    /**
     * Helper function to convert end point format strings to final path
     *
     * @param path the end point format string with id placeholders
     * @param object the object to get id values from for the placeholder.
     * @returns {string} The endpoint.
     */
    private buildEndpoint;
    /**
     * Convert accepted data to @class Entity object
     *
     * @param json The json data to convert to T
     */
    protected abstract createInstanceFrom(json: any, other?: any): T;
    /**
     * Make a get request to the end point, using the supplied parameters to determine path.
     *
     * @param pathIds Either the id, if a number and maps simple to ':id', otherwise an object
     *                with keys the match the placeholders within the endpointFormat string.
     * @param other   Any other data that is needed to be passed to the creation of entities
     *                resulting from this get request.
     * @param options Optional http options
     */
    get(pathIds: number | object, other?: any, options?: HttpOptions): Observable<T>;
    /**
     * Make a query request (get all) to the end point, using the supplied parameters to determine path.
     *
     * @param pathIds An object with keys which match the placeholders within the endpointFormat string.
     * @param other   Any other data that is needed to be passed to the creation of entities
     *                resulting from this get request.
     * @param options Optional http options
     * @returns {Observable} a new cold observable
     */
    query(pathIds?: object, other?: object, options?: HttpOptions): Observable<T[]>;
    /**
     * Make an update request to the endpoint, using the supplied object to identify which id to update.
     *
     * @param obj An object with keys which match the placeholders within the endpointFormat string.
     * @param options Optional http options
     */
    update(pathIds: object | T, obj?: T, options?: HttpOptions): Observable<T>;
    /**
     * Make an put request to the endpoint, indicating the type of data to be returned from the endpoint.
     * The supplied object identifies the endpoint url and data.
     *
     * @typeparam S The type of the data to be returned
     * @param pathIds An object with keys which match the placeholders within the endpointFormat string.
     * @param data    A FormData or object with the values to pass up in the body of the update/put request.
     * @param options Optional http options
     */
    put<S>(pathIds: object, data?: FormData | object, options?: HttpOptions): Observable<S>;
    /**
     * Make a create request to the endpoint, using the supplied parameters to determine the path.
     *
     * @param pathIds An object with keys which match the placeholders within the endpointFormat string.
     * @param data    A FormData or object with the values to pass up in the body of the create request.
     * @param other   Any other data needed to be passed to the entity on creation
     * @param options Optional http options
     * @returns {Observable} a new cold observable with the newly created @type {T}
     */
    create(pathIds?: object, data?: FormData | object, other?: any, options?: HttpOptions): Observable<T>;
    /**
     * Make a delete request to the end point, using the supplied parameters to determine path.
     *
     * @param pathIds Either the id, if a number and maps simple to ':id', otherwise an object
     *                with keys the match the placeholders within the endpointFormat string.
     * @param options Optional http options
     */
    delete(pathIds: number | object, options?: HttpOptions): Observable<object>;
    /**
     * Instantiates an array of elements as objects from the JSON returned
     * from the server.
     * @returns {T[]} The array of Objects
     */
    private convertCollection;
    /**
     * Gets the unique key for an entity of type @class Entity.
     * This is used to identify the object within a cache.
     *
     * @param json The json object to get the key from
     * @returns string containing the unique key value
     */
    abstract keyForJson(json: any): string;
}
