"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const mutations_1 = require("./mutations");
const resolver_1 = require("./resolver");
const typedef_1 = require("./typedef");
exports.auth = { mutations: mutations_1.mutations, resolvers: resolver_1.resolvers, typedefs: typedef_1.typedefs };
