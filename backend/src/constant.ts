import { join } from 'path';

export const PRODUCT_JSON_PATH = join(__dirname, '..', 'data', 'product.json');

export const ERROR_MESSAGES = {
  PRODUCT: {
    NOT_FOUND_ERROR: `This product doesn't exists!`,
  },
};

export const SUCCESS_MESSAGE = {
  PRODUCT: {
    CREATE: 'Product Created Successfully!',
    DELETE: 'Product Deleted Successfully',
  },
};
