import { __decorate, __extends } from "tslib";
import { EntityService } from './entity.service';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
/**
 * The CachedEntityService provides wraps the EntityService and provides a cache that stores
 * previously fetched entity objects from the server. Objects within the cache are updated when
 * new values are fetched from the server.
 */
var CachedEntityService = /** @class */ (function (_super) {
    __extends(CachedEntityService, _super);
    function CachedEntityService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.globalCache = new Map();
        _this.cache = _this.globalCache;
        return _this;
    }
    Object.defineProperty(CachedEntityService.prototype, "cacheSource", {
        /**
         * This allows you to specify the source of a cache, which may change from a global source to
         * a cache contained within another entity (for example, a cache of comments in a task).
         *
         * @param source  the new source to be used for the cache. The global cache will be used if
         *                this is null or undefined.
         */
        set: function (source) {
            if (source) {
                this.cache = source;
            }
            else {
                this.cache = this.globalCache;
            }
        },
        enumerable: false,
        configurable: true
    });
    /**
     * This function is used to map the path ids to a unique key to locate the associated entity
     * within the cache.
     *
     * @param pathIds the pathIds used to determine the key
     * @returns       a unique key to identify the associated entity
     */
    CachedEntityService.prototype.keyFromPathIds = function (pathIds) {
        if (pathIds.key) {
            return pathIds.key;
        }
        else if (typeof pathIds === 'object') {
            return pathIds['id'].toString();
        }
        else if (typeof pathIds === 'number') {
            return pathIds.toString();
        }
        else {
            return pathIds;
        }
    };
    CachedEntityService.prototype.update = function (pathIds, obj, options) {
        var _this = this;
        return _super.prototype.update.call(this, pathIds, obj, options)
            .pipe(tap(function (updatedEntity) { return _this.addEntityToCache(updatedEntity.key, updatedEntity); }));
    };
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
    CachedEntityService.prototype.query = function (pathIds, other, options) {
        var _this = this;
        return _super.prototype.query.call(this, pathIds, other, options).pipe(tap(function (entityList) {
            entityList.forEach(function (entity) {
                _this.addEntityToCache(entity.key, entity);
            });
        }));
    };
    CachedEntityService.prototype.fetch = function (pathIds, other, options) {
        var _this = this;
        var key = this.keyFromPathIds(pathIds);
        return _super.prototype.get.call(this, pathIds, other, options).pipe(map(function (entity) {
            if (_this.hasEntityInCache(key)) {
                var cachedEntity = _this.cache.get(key);
                Object.assign(cachedEntity, entity);
                return cachedEntity;
            }
            else {
                _this.addEntityToCache(key, entity);
                return entity;
            }
        }));
    };
    /**
     * Checks if an entity exists for a given key within the current cache.
     *
     * @param key Key of entity to check for.
     * @returns true if the entity with key is in the cache
     */
    CachedEntityService.prototype.hasEntityInCache = function (key) {
        return this.cache.has(key);
    };
    /**
     * Store an entity in the cache - this will automatically be called on
     * query and get, but can be called directly in special cases.
     *
     * @param key key of the entity to store
     * @param entity the entity object to store in the cache
     */
    CachedEntityService.prototype.addEntityToCache = function (key, entity) {
        this.cache.set(key, entity);
    };
    /**
     * Read a given entity from the cache without interaction with the server.
     *
     * @param key key of entity to read from cache
     */
    CachedEntityService.prototype.getFromCache = function (key) {
        return this.cache.get(key);
    };
    CachedEntityService.prototype.get = function (pathIds, other, options) {
        var _this = this;
        var key = this.keyFromPathIds(pathIds);
        if (this.cache.has(key)) {
            return new Observable(function (observer) { return observer.next(_this.getFromCache(key)); });
        }
        else {
            return _super.prototype.get.call(this, pathIds, other, options).pipe(tap(function (entity) { return _this.addEntityToCache(entity.key, entity); }));
        }
    };
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
    CachedEntityService.prototype.create = function (pathIds, data, other, options) {
        var _this = this;
        return _super.prototype.create.call(this, pathIds, data, other, options).pipe(tap(function (entity) { return _this.addEntityToCache(entity.key, entity); }));
    };
    CachedEntityService.prototype.delete = function (pathIds, options) {
        var key = this.keyFromPathIds(pathIds);
        var cache = this.cache;
        return _super.prototype.delete.call(this, pathIds, options).pipe(
        // Tap performs a side effect on Observable, but return it identical to the source.
        tap(function (response) {
            if (cache.has(key)) {
                cache.delete(key);
            }
        }));
    };
    CachedEntityService = __decorate([
        Injectable()
    ], CachedEntityService);
    return CachedEntityService;
}(EntityService));
export { CachedEntityService };
//# sourceMappingURL=cached-entity.service.js.map