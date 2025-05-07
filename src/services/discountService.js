/*
  discountService.js
  A pure JavaScript module ported from PHP DiscountService,
  exposing functions to compute product and coupon discounts
  for use in a Vue.js frontend.
*/

/**
 * Calculate discounted unit price of a product based on its discount_price.
 * @param {{ price: number, discount_price?: number }} product
 * @returns {number}
 */
export function calculateProductDiscountedPrice(product) {
    const discount = product.discount_price || 0;
    return discount > 0 ? product.price - discount : product.price;
  }
  
  /**
   * Determine if a coupon is valid for a given product.
   * Assumes coupon.couponables is an array of { type, id, is_accepted } or empty for global.
   * @param {{ couponables: Array, reward_type: string, discount_amount: number }} coupon
   * @param {{ id: number, categoryId?: number, subCategoryId?: number, ownerId?: number }} product
   * @returns {boolean}
   */
  export function isCouponValidForItem(coupon, product) {
    // no restrictions => valid for all
    if (!coupon.couponables || coupon.couponables.length === 0) {
      return true;
    }
  
    const matches = [
      { type: 'Product', id: product.id },
      { type: 'Category', id: product.categoryId },
      { type: 'SubCategory', id: product.subCategoryId },
      { type: 'User', id: product.ownerId }
    ];
  
    for (const m of matches) {
      if (m.id == null) continue;
      const match = coupon.couponables.find(c => c.type === m.type && c.id === m.id);
      if (match) {
        return match.is_accepted;
      }
    }
  
    return false;
  }
  
  /**
   * Calculate total coupon discount for one line item.
   * @param {{ reward_type: string, discount_amount: number }} coupon
   * @param {number} unitPriceAfterProductDiscount
   * @param {number} quantity
   * @returns {number}
   */
  export function calculateItemCouponDiscount(coupon, unitPriceAfterProductDiscount, quantity) {
    if (coupon.reward_type === 'percentage') {
      return unitPriceAfterProductDiscount * (coupon.discount_amount / 100) * quantity;
    }
    // fixed amount per item, but capped by unitPrice
    return Math.min(coupon.discount_amount, unitPriceAfterProductDiscount) * quantity;
  }
  
  /**
   * Process a list of cart items and an optional coupon to compute totals and line details.
   * @param {Array} cartItems - each item: { id, product: {...}, quantity, attribute?... }
   * @param {Object|null} coupon - { code, reward_type, discount_amount, couponables }
   * @returns {{ success: boolean, items: Array, itemsCount: number, originalTotal: number, productDiscounts: number, couponDiscount: number, finalTotal: number, validItems: Array, invalidItems: Array, couponCode: string|null }}
   */
  export function calculateDiscounts(cartItems, coupon = null) {
    let original = 0;
    let productDiscounts = 0;
    let couponDiscount = 0;
    const items = [];
    const validItems = [];
    const invalidItems = [];
  
    for (const item of cartItems) {
      const { product, quantity } = item;
      if (!product) continue;
  
      const unitPrice = product.price;
      const unitAfterProd = calculateProductDiscountedPrice(product);
  
      original += unitPrice * quantity;
      productDiscounts += (unitPrice - unitAfterProd) * quantity;
  
      const line = {
        id: item.id,
        productId: product.id,
        name: product.name || product.product_name,
        originalPrice: unitPrice,
        productDiscount: product.discount_price || 0,
        finalUnitPrice: unitAfterProd,
        quantity,
        totalPrice: unitAfterProd * quantity,
      };
  
      if (coupon) {
        if (isCouponValidForItem(coupon, product)) {
          const lineCoupon = calculateItemCouponDiscount(coupon, unitAfterProd, quantity);
          couponDiscount += lineCoupon;
          validItems.push({ ...line, couponDiscount: lineCoupon / quantity, finalUnitPrice: unitAfterProd - (lineCoupon / quantity) });
        } else {
          invalidItems.push(line);
        }
      } else {
        invalidItems.push(line);
      }
  
      items.push(line);
    }
  
    const finalTotal = original - productDiscounts - couponDiscount;
    return {
      success: true,
      items,
      itemsCount: items.length,
      originalTotal: original,
      productDiscounts,
      couponDiscount,
      finalTotal,
      validItems,
      invalidItems,
      couponCode: coupon ? coupon.code : null
    };
  }
  