import { gql } from 'apollo-server-express';

export const cartTypeDefs = gql`
  type Product {
    id: ID!
    name: String!
    description: String
    price: Float!
    image: String
    stock: Int!
  }

  type CartItem {
    id: ID!
    productId: ID!
    product: Product!
    quantity: Int!
    price: Float!
  }

  type Cart {
    id: ID!
    userId: ID!
    items: [CartItem!]!
    total: Float!
    selectedItems: [ID!]!
    createdAt: String!
    updatedAt: String!
  }

  type CartResponse {
    success: Boolean!
    message: String!
    data: Cart
    error: String
  }

  type CheckoutResponse {
    success: Boolean!
    message: String!
    orderId: ID
    total: Float
    items: [CartItem!]
    error: String
  }

  input AddItemInput {
    productId: ID!
    quantity: Int!
  }

  input UpdateItemInput {
    itemId: ID!
    quantity: Int!
  }

  input SelectItemsInput {
    itemIds: [ID!]!
  }

  type Query {
    getCart(userId: ID!): CartResponse!
    getCartItem(userId: ID!, itemId: ID!): CartItem
    getSelectedItems(userId: ID!): [CartItem!]!
    getCartTotal(userId: ID!): Float!
    getSelectedTotal(userId: ID!): Float!
  }

  type Mutation {
    addItemToCart(userId: ID!, input: AddItemInput!): CartResponse!
    updateCartItem(userId: ID!, input: UpdateItemInput!): CartResponse!
    removeFromCart(userId: ID!, itemId: ID!): CartResponse!
    clearCart(userId: ID!): CartResponse!
    selectItems(userId: ID!, input: SelectItemsInput!): CartResponse!
    selectAllItems(userId: ID!): CartResponse!
    clearSelectedItems(userId: ID!): CartResponse!
    checkout(userId: ID!): CheckoutResponse!
  }
`;
