import React from 'react'
import { IoClose } from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux';
import * as api from "@/api/apiRoutes"
import { addtoGuestCart, clearCartPromo, setCartProducts, setCartPromo, setCartSubTotal, setGuestCartTotal } from '@/redux/slices/cartSlice';
import { toast } from 'react-toastify';
import ImageWithPlaceholder from '../image-with-placeholder/ImageWithPlaceholder';
import { t } from '@/utils/translation';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { getVariantColorData } from '@/lib/utils';


const CartDrawerProductsCard = ({ product, cartProductsData, setCartProductsData }) => {
    const dispatch = useDispatch();
    const setting = useSelector(state => state.Setting.setting)
    const cart = useSelector(state => state.Cart)
    const coupon = useSelector(state => state.Cart.promo_code)


    const handleRemoveFromCart = async () => {
        try {
            const response = await api.removeFromCart({ product_id: product?.product_id, product_variant_id: product?.product_variant_id })
            if (response?.status == 1) {
                const remainItems = cart?.cartProducts?.filter((cartProduct) => (cartProduct?.product_variant_id !== product?.product_variant_id))
                const updatedProducts = cartProductsData?.filter((cartProduct) => (cartProduct?.product_variant_id !== product?.product_variant_id))
                setCartProductsData(updatedProducts)
                dispatch(setCartProducts({ data: remainItems }))
                dispatch(setCartSubTotal({ data: response?.sub_total }))
                if (updatedProducts?.length <= 0) {
                    dispatch(clearCartPromo())
                }
                await handleApplyCoupon()
                // toast.success(response.message)
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    const handleCalculateTotal = (products) => {
        const total = products?.reduce((prev, curr) => {
            prev += (curr?.productPrice * curr.qty)
            return prev
        }, 0)
        if (cart?.isGuest) {
            dispatch(setGuestCartTotal({ data: total }))
        } else {
            dispatch(setCartSubTotal({ data: total }))
        }
    }

    const handleGuestCartRemove = () => {
        const remainItems = cart?.guestCart?.filter((cartProduct) => (cartProduct?.product_variant_id !== product?.product_variant_id))
        const updatedProducts = cartProductsData?.filter((cartProduct) => (cartProduct?.product_variant_id !== product?.product_variant_id))
        setCartProductsData(updatedProducts)
        dispatch(addtoGuestCart({ data: remainItems }))
        handleCalculateTotal(remainItems)
    }

    const handleRemoveItem = async () => {
        if (cart.isGuest) {
            handleGuestCartRemove()
        } else {
            await handleRemoveFromCart()
        }
    }

    const getProductQuantities = (products) => {
        return Object.entries(products?.reduce((quantities, product) => {
            const existingQty = quantities[product.product_id] || 0;
            return { ...quantities, [product.product_id]: existingQty + product.qty };
        }, {})).map(([productId, qty]) => ({
            product_id: parseInt(productId),
            qty
        }));
    }



    const handleQuantityIncrease = async () => {
        try {
            let productQuantity = cart?.isGuest ? getProductQuantities(cart?.guestCart) : getProductQuantities(cart?.cartProducts)
            const productQty = productQuantity?.find(prdct => prdct?.product_id == product?.product_id)?.qty;
            const cartProductQty = cart.cartProducts.find(prdct => prdct?.product_id == product?.product_id && prdct?.product_variant_id == product?.product_variant_id)
            if (product?.is_unlimited_stock !== 0) {
                if (productQty >= Number(product?.total_allowed_quantity)) {
                    toast.error(t("max_cart_limit_error"));
                } else {
                    if (cart.isGuest) {
                        let updatedProducts = cart?.guestCart?.map((cartProduct) => {
                            if (cartProduct?.product_id == product?.product_id && cartProduct?.product_variant_id == product?.product_variant_id) {
                                return { ...cartProduct, qty: Number(cartProduct?.qty + 1) };
                            } else {
                                return cartProduct;
                            }
                        });


                        handleCalculateTotal(updatedProducts)
                        dispatch(addtoGuestCart({ data: updatedProducts }))
                    } else {
                        try {
                            const response = await api.addToCart({ product_id: product?.product_id, product_variant_id: product?.product_variant_id, qty: Number(cartProductQty.qty + 1) })
                            if (response.status == 1) {
                                let updatedProducts = cart?.cartProducts?.map((cartProduct) => {
                                    if (cartProduct?.product_id == product?.product_id && cartProduct?.product_variant_id == product?.product_variant_id) {
                                        return { ...cartProduct, qty: cartProductQty?.qty + 1 };
                                    } else {
                                        return cartProduct;
                                    }
                                });
                                dispatch(setCartSubTotal({ data: response.sub_total }))
                                dispatch(setCartProducts({ data: updatedProducts }))
                                await handleApplyCoupon(response.sub_total)
                            }
                        } catch (error) {
                            console.log("Error", error)
                        }
                    }

                }
            }
            else {
                if (productQty >= Number(product?.stock)) {
                    toast.error(t("out_of_stock_message"));
                }
                else if (productQty >= Number(product?.total_allowed_quantity)) {
                    toast.error(t("max_cart_limit_error"));
                }
                else {
                    if (cart.isGuest) {
                        let updatedProducts = cart?.guestCart?.map((cartProduct) => {
                            if (cartProduct?.product_id == product?.product_id && cartProduct?.product_variant_id == product?.product_variant_id) {
                                return { ...cartProduct, qty: Number(cartProduct?.qty + 1) };
                            } else {
                                return cartProduct;
                            }
                        });
                        handleCalculateTotal(updatedProducts)
                        dispatch(addtoGuestCart({ data: updatedProducts }))
                    } else {
                        try {
                            const response = await api.addToCart({ product_id: product?.product_id, product_variant_id: product?.product_variant_id, qty: Number(cartProductQty.qty + 1) })
                            if (response.status == 1) {
                                let updatedProducts = cart?.cartProducts?.map((cartProduct) => {
                                    if (cartProduct?.product_id == product?.product_id && cartProduct?.product_variant_id == product?.product_variant_id) {
                                        return { ...cartProduct, qty: cartProductQty?.qty + 1 };
                                    } else {
                                        return cartProduct;
                                    }
                                });
                                dispatch(setCartSubTotal({ data: response.sub_total }))
                                dispatch(setCartProducts({ data: updatedProducts }))
                                await handleApplyCoupon(response.sub_total)
                            }
                        } catch (error) {
                            console.log("Error", error)
                        }
                    }
                }
            }

        } catch (error) {
            console.log("Error", error)
        }
    }

    // Calling this function on every increament decreament so total adjust with coupon card
    const handleApplyCoupon = async (total) => {
        try {
            const response = await api.setPromoCode({ promoCodeName: coupon?.promo_code, amount: total })
            if (response.status == 1) {
                dispatch(setCartPromo({ data: response.data }))
            } else {
                await handleRemoveCoupon()
            }
        } catch (error) {
            console.log("Error", error)
        }
    }


    const handleRemoveCoupon = async () => {
        dispatch(clearCartPromo())
    }

    const handleQuantityDecrease = async () => {
        try {
            let productQuantity;
            if (cart?.isGuest) {
                productQuantity = getProductQuantities(cart?.guestCart)
            } else {
                productQuantity = getProductQuantities(cart?.cartProducts)
            }
            const productQty = productQuantity?.find(prdct => prdct?.product_id == product?.product_id)?.qty;
            const variantQty = cart?.guestCart?.find(prdct => prdct?.product_id == product?.product_id && prdct?.product_variant_id == product?.product_variant_id)?.qty;
            const cartProductQty = cart.cartProducts.find(prdct => prdct?.product_id == product?.product_id && prdct?.product_variant_id == product?.product_variant_id)
            if (cart.isGuest) {
                if (variantQty <= 1) {
                    return;
                }
                let updatedProducts = cart?.guestCart?.map((cartProduct) => {
                    if (cartProduct?.product_id == product?.product_id && cartProduct?.product_variant_id == product?.product_variant_id) {
                        return { ...cartProduct, qty: Number(cartProduct?.qty - 1) };
                    } else {
                        return cartProduct
                    }
                });
                handleCalculateTotal(updatedProducts)
                dispatch(addtoGuestCart({ data: updatedProducts }))
            } else {
                if (cartProductQty.qty <= 1) {
                    return;
                }
                try {
                    const response = await api.addToCart({ product_id: product?.product_id, product_variant_id: product?.product_variant_id, qty: Number(cartProductQty.qty - 1) })
                    if (response.status == 1) {
                        let updatedProducts = cart?.cartProducts?.map((cartProduct) => {
                            if (cartProduct?.product_id == product?.product_id && cartProduct?.product_variant_id == product?.product_variant_id) {
                                return { ...cartProduct, qty: cartProductQty?.qty - 1 };
                            } else {
                                return cartProduct;
                            }
                        });
                        dispatch(setCartSubTotal({ data: response.sub_total }))
                        dispatch(setCartProducts({ data: updatedProducts }))
                        await handleApplyCoupon(response.sub_total)
                    }
                } catch (error) {
                    console.log("Error", error)
                }
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    const addedQuantity = cart.isGuest === false ?
        cart?.cartProducts?.find(prdct => prdct?.product_variant_id == product?.product_variant_id)?.qty
        : cart?.guestCart?.find(prdct => prdct?.product_variant_id == product?.product_variant_id)?.qty



    const colorData = getVariantColorData(product) || getVariantColorData(product?.product_variant) || getVariantColorData(product?.variant);

    return (
        <div className="bg-white border border-slate-100 hover:border-slate-200/80 shadow-subtle hover:shadow-card transition-all p-3 rounded-2xl flex gap-3.5 relative group">
            {/* Thumbnail */}
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0 relative">
                <ImageWithPlaceholder
                    src={product?.image_url}
                    alt={product?.product?.translations?.name || 'Product'}
                    fill
                    sizes="(max-width: 640px) 80px, 80px"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
            </div>

            {/* Details */}
            <div className="flex-1 flex flex-col justify-between min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-semibold text-slate-900 truncate">
                        {product?.product?.translations?.name || product?.name}
                    </h4>
                    <button
                        type="button"
                        aria-label="Remove item"
                        onClick={handleRemoveItem}
                        className="w-6 h-6 rounded-full hover:bg-rose-50 text-slate-400 hover:text-rose-500 flex items-center justify-center transition-colors shrink-0 -mt-0.5 -mr-1"
                    >
                        <IoClose size={16} />
                    </button>
                </div>

                <div className="my-1 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-medium text-slate-500 bg-slate-100/80 px-2 py-0.5 rounded-full inline-flex items-center">
                        {product?.measurement} {product?.unit?.translations?.short_code || product?.unit_code || ""}
                    </span>
                    {colorData?.name && (
                        <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1 border border-slate-200/60">
                            {colorData.hex && (
                                <span
                                    className="w-2.5 h-2.5 rounded-full border border-slate-300 shadow-2xs shrink-0 inline-block"
                                    style={{ backgroundColor: colorData.hex }}
                                />
                            )}
                            <span>{colorData.name}</span>
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-50">
                    {/* Stepper */}
                    <div className="flex items-center border border-slate-200 rounded-full bg-slate-50/80 px-1 py-0.5 text-xs text-slate-700 shadow-inner">
                        <button
                            type="button"
                            aria-label="Decrease quantity"
                            className="w-6 h-6 rounded-full hover:bg-white text-slate-600 hover:text-slate-900 flex items-center justify-center transition-all disabled:opacity-40"
                            onClick={handleQuantityDecrease}
                        >
                            <FiMinus size={13} />
                        </button>
                        <span className="w-7 text-center font-semibold text-xs text-slate-800">
                            {addedQuantity}
                        </span>
                        <button
                            type="button"
                            aria-label="Increase quantity"
                            className="w-6 h-6 rounded-full hover:bg-white text-slate-600 hover:text-slate-900 flex items-center justify-center transition-all"
                            onClick={() => handleQuantityIncrease()}
                        >
                            <FiPlus size={13} />
                        </button>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-1.5 shrink-0">
                        {product?.discounted_price != 0 && product?.discounted_price !== product?.price ? (
                            <>
                                <span className="text-xs font-bold text-slate-900 whitespace-nowrap">
                                    {setting?.currency}{product?.discounted_price}
                                </span>
                                <span className="text-[11px] font-normal line-through text-slate-400 whitespace-nowrap">
                                    {setting?.currency}{product?.price}
                                </span>
                            </>
                        ) : (
                            <span className="text-xs font-bold text-slate-900 whitespace-nowrap">
                                {setting?.currency}{product?.price}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartDrawerProductsCard