import { mutations} from './mutations';
import {queries} from './query';
import {resolvers} from './resolver';
import { typedefs}  from './typedef';


export const transaction = { mutations, resolvers, typedefs, queries }; 