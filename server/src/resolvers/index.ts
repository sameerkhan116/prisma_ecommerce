import { Query } from './Query'
import { auth } from './Mutation/auth'
import { post } from './Mutation/post'
import { product } from './Mutation/product'
import { AuthPayload } from './AuthPayload'
import { Context } from '../utils';

export default {
  Query,
  Mutation: {
    ...auth,
    ...post,
    ...product,
  },
  Subscription: {
    product: {
      subscribe: async(parent, args, ctx: Context, info) =>
        ctx.db.subscription.product({}, info)
    }
  },
  AuthPayload,
}
