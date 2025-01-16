import { ActionTypes, CartType, SavedProductType } from "@/types/types"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { toast, useToast } from "@/hooks/use-toast"

const INITIAL_STATE = {
    products: [],
    totalItems: 0,
    totalPrice: 0,
    savedProducts:[],
    totalSavedItem:0
}

export const userCartStore = create(
    persist<CartType & ActionTypes>(
        (set, get) => ({
            products: INITIAL_STATE.products,
            totalItems: INITIAL_STATE.totalItems,
            totalPrice: INITIAL_STATE.totalPrice,
            savedProducts: INITIAL_STATE.savedProducts,
            totalSavedItem: INITIAL_STATE.totalSavedItem,
            addToCart(item) {
                const products = get().products || []
                const productInState = products.find(product => product._id === item._id)

                if (productInState) {
                    const updateProduct = products.map(product => product._id === productInState._id ? {
                        ...item,
                        quantity: item.quantity + product.quantity,
                        price: item.price + product.price
                    }
                        : item
                    );
                    set((state) => ({
                        products: updateProduct,
                        totalItems: state.totalItems + item.quantity,
                        totalPrice: state.totalPrice + item.price
                    }))
                } else {
                    set((state) => ({
                        products: [...state.products, item],
                        totalItems: state.totalItems + item.quantity,
                        totalPrice: state.totalPrice + item.price
                    }));
                    toast({
                        title: `${item.title} (${item.quantity}) added to cart`,
                        variant:"default",
                        className:"bg-[#741102] text-white "
                    })
                }

            },
            removeFromCart(item) {
                set((state) => ({
                    products: state.products.filter((product) => product._id !== item._id),
                    totalItems: state.totalItems - item.quantity,
                    totalPrice: state.totalPrice - item.price
                }))
                toast({
                    title: `${item.title} (${item.quantity}) removed from cart`,
                    variant:"default",
                    className:"bg-[#741102] text-white "
                })
            },
            clearCart: () => set({ 
                products: INITIAL_STATE.products,
                totalItems: INITIAL_STATE.totalItems,
                totalPrice: INITIAL_STATE.totalPrice 
            }),
            saveProduct(item) {
                const savedProducts = get().savedProducts || []
                const productInState = savedProducts.find(product => product._id === item._id)

                if (productInState) {
                    const updateProduct = savedProducts.map(product => product._id === productInState._id ? {
                        ...item,
                        quantity: item.quantity + product.quantity,
                        price: item.price + product.price
                    }
                        : item
                    );
                    set((state) => ({
                        savedProducts: updateProduct,
                        totalSavedItem: state.totalSavedItem + item.quantity,
                    }))
                } else {
                    set((state) => ({
                        savedProducts: [...state.savedProducts, item],
                        totalSavedItem: state.totalSavedItem + item.quantity,
                        totalPrice: state.totalPrice + item.price
                    }));
                    toast({
                        title: `${item.title}  saved`,
                        variant:"default",
                        className:"bg-[#741102] text-white "
                    })
                }
            },
            removeSavedProduct(item) {
                set((state) => ({
                    savedProducts: state.savedProducts.filter((product) => product._id !== item._id),
                    totalSavedItem: state.totalSavedItem - item.quantity
                }));
                toast({
                    title: `${item.title} removed from saved`,
                    variant:"default",
                    className:"bg-[#741102] text-white "
                })
            },
            clearSavedProduct() {
                set({ 
                    savedProducts: INITIAL_STATE.savedProducts,
                    totalSavedItem: INITIAL_STATE.totalSavedItem
                });
                toast({
                    title: `All products removed from saved`,
                    variant:"default",
                    className:"bg-[#741102] text-white "
                })
            },
        }),
        {
            name: "cart-storage", // unique name
        }
    )
);
