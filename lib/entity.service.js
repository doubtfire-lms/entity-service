import { __assign, __decorate, __metadata } from "tslib";
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
/**
 * ResourceService, responsible for the CRUD actions for all resources which inherit form it.
 * This is used to interact with the server, and create Entity objects that are returned for
 * use within the application.
 */
var EntityService = /** @class */ (function () {
    function EntityService(httpClient, apiUrl) {
        this.httpClient = httpClient;
        this.apiUrl = apiUrl;
    }
    Object.defineProperty(EntityService.prototype, "serverKey", {
        get: function () {
            return this.entityName
                .replace(/(.)([A-Z][a-z]+)/, '$1_$2')
                .replace(/([a-z0-9])([A-Z])/, '$1_$2')
                .toLowerCase();
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Helper function to convert end point format strings to final path
     *
     * @param path the end point format string with id placeholders
     * @param object the object to get id values from for the placeholder.
     * @returns {string} The endpoint.
     */
    EntityService.prototype.buildEndpoint = function (path, object) {
        // Replace any keys with provided values
        if (object) {
            for (var key in object) {
                if (object.hasOwnProperty(key)) {
                    // If the key is undefined, just replace with an empty string.
                    path = path.replace(":" + key + ":", object[key] ? object[key] : '');
                }
            }
        }
        // Strip any missed keys
        path = path.replace(/:[\w-]*?:/, '');
        return this.apiUrl + "/" + path;
    };
    EntityService.prototype.get = function (pathIds, other, options) {
        var _this = this;
        var object = __assign({}, pathIds);
        if (typeof pathIds === 'number') {
            object['id'] = pathIds;
        }
        var path = this.buildEndpoint((options === null || options === void 0 ? void 0 : options.alternateEndpointFormat) || this.endpointFormat, object);
        return this.httpClient.get(path, options).pipe(map(function (rawData) { return _this.createInstanceFrom(rawData, other); })); // Turn the raw JSON returned into the object T
    };
    /**
     * Make a query request (get all) to the end point, using the supplied parameters to determine path.
     *
     * @param pathIds An object with keys which match the placeholders within the endpointFormat string.
     * @param other   Any other data that is needed to be passed to the creation of entities
     *                resulting from this get request.
     * @param options Optional http options
     * @returns {Observable} a new cold observable
     */
    EntityService.prototype.query = function (pathIds, other, options) {
        var _this = this;
        var path = this.buildEndpoint((options === null || options === void 0 ? void 0 : options.alternateEndpointFormat) || this.endpointFormat, pathIds);
        return this.httpClient
            .get(path, options)
            .pipe(map(function (rawData) { return _this.convertCollection(rawData instanceof Array ? rawData : [rawData], other); }));
    };
    EntityService.prototype.update = function (pathIds, obj, options) {
        var entity;
        if (obj === undefined)
            entity = pathIds;
        else
            entity = obj;
        // need to pass object through as path id and form data
        return this.put(pathIds, entity.toJson(), options).pipe(map(function (rawData) {
            entity.updateFromJson(rawData);
            return entity;
        }));
    };
    EntityService.prototype.put = function (pathIds, data, options) {
        var object = __assign({}, pathIds);
        var json = data ? data : typeof pathIds.toJson === 'function' ? pathIds.toJson() : pathIds;
        var path = this.buildEndpoint((options === null || options === void 0 ? void 0 : options.alternateEndpointFormat) || this.endpointFormat, object);
        return this.httpClient.put(path, json, options);
    };
    EntityService.prototype.create = function (pathIds, data, other, options) {
        var _this = this;
        var object = __assign({}, pathIds);
        var json = data ? data : typeof pathIds.toJson === 'function' ? pathIds.toJson() : pathIds;
        var path = this.buildEndpoint((options === null || options === void 0 ? void 0 : options.alternateEndpointFormat) || this.endpointFormat, object);
        return this.httpClient.post(path, json, options).pipe(map(function (rawData) { return _this.createInstanceFrom(rawData, other); }));
    };
    EntityService.prototype.delete = function (pathIds, options) {
        var object = __assign({}, pathIds);
        if (typeof pathIds === 'number') {
            object['id'] = pathIds;
        }
        var path = this.buildEndpoint((options === null || options === void 0 ? void 0 : options.alternateEndpointFormat) || this.endpointFormat, object);
        return this.httpClient.delete(path, options);
    };
    /**
     * Instantiates an array of elements as objects from the JSON returned
     * from the server.
     * @returns {T[]} The array of Objects
     */
    EntityService.prototype.convertCollection = function (collection, other) {
        var _this = this;
        return collection.map(function (data) { return _this.createInstanceFrom(data, other); });
    };
    EntityService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient, String])
    ], EntityService);
    return EntityService;
}());
export { EntityService };
//# sourceMappingURL=entity.service.js.map