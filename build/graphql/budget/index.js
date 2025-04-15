"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.budget = void 0;
const mutations_1 = require("./mutations");
const resolver_1 = require("./resolver");
const typedef_1 = require("./typedef");
const queries_1 = require("./queries");
exports.budget = { mutations: mutations_1.mutations, resolvers: resolver_1.resolvers, typedefs: typedef_1.typedefs, queries: queries_1.queries };
