"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transaction = void 0;
const mutations_1 = require("./mutations");
const query_1 = require("./query");
const resolver_1 = require("./resolver");
const typedef_1 = require("./typedef");
exports.transaction = { mutations: mutations_1.mutations, resolvers: resolver_1.resolvers, typedefs: typedef_1.typedefs, queries: query_1.queries };
