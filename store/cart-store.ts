import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createClient } from '@/lib/supabase/client'

export type CartItem = {
  id: string // composite: productId or productId-variantId
  productId: string
  variantId?: string | null
  name: string
  color?: string | null
  size?: string | null
  price: number
  salePrice?: number | null
  image: string
  quantity: number
}

interface CartState {
  items: CartItem[]
  isSynced: boolean
  addItem: (item: CartItem) => Promise<void>
  removeItem: (id: string) => Promise<void>
  updateQuantity: (id: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  getTotal: () => number
  getSubtotal: () => number
  syncCart: () => Promise<void>
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isSynced: false,
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      
      addItem: async (newItem) => {
        const { items } = get()
        // Find existing item matching both productId and variantId
        const existingItem = items.find(
          (item) => item.productId === newItem.productId && item.variantId === newItem.variantId
        )

        let updatedItems
        if (existingItem) {
          updatedItems = items.map((item) =>
            item.productId === newItem.productId && item.variantId === newItem.variantId
              ? { ...item, quantity: item.quantity + newItem.quantity }
              : item
          )
        } else {
          updatedItems = [...items, newItem]
        }

        set({ items: updatedItems })

        // Sync to Supabase if authenticated
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          // Since onConflict with NULLs in Postgres can be tricky, we'll try to find if the row exists first
          const query = supabase
            .from('cart_items')
            .select('id, quantity')
            .eq('user_id', session.user.id)
            .eq('product_id', newItem.productId)
            
          if (newItem.variantId) {
            query.eq('variant_id', newItem.variantId)
          } else {
            query.is('variant_id', null)
          }

          const { data: existingDb } = await query.maybeSingle()

          if (existingDb) {
            await supabase.from('cart_items').update({
              quantity: existingDb.quantity + newItem.quantity
            }).eq('id', existingDb.id)
          } else {
            await supabase.from('cart_items').insert({
              user_id: session.user.id,
              product_id: newItem.productId,
              variant_id: newItem.variantId || null,
              quantity: newItem.quantity,
            })
          }
        }
      },
      
      removeItem: async (id) => {
        const itemToRemove = get().items.find(item => item.id === id)
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))

        // Sync to Supabase if authenticated
        if (itemToRemove) {
          const supabase = createClient()
          const { data: { session } } = await supabase.auth.getSession()
          if (session) {
            const query = supabase.from('cart_items').delete().eq('user_id', session.user.id).eq('product_id', itemToRemove.productId)
            if (itemToRemove.variantId) {
              query.eq('variant_id', itemToRemove.variantId)
            } else {
              query.is('variant_id', null)
            }
            await query
          }
        }
      },
      
      updateQuantity: async (id, quantity) => {
        const itemToUpdate = get().items.find(item => item.id === id)
        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, quantity } : item)),
        }))

        // Sync to Supabase if authenticated
        if (itemToUpdate) {
          const supabase = createClient()
          const { data: { session } } = await supabase.auth.getSession()
          if (session) {
            const query = supabase.from('cart_items').update({ quantity }).eq('user_id', session.user.id).eq('product_id', itemToUpdate.productId)
            if (itemToUpdate.variantId) {
              query.eq('variant_id', itemToUpdate.variantId)
            } else {
              query.is('variant_id', null)
            }
            await query
          }
        }
      },
      
      clearCart: async () => {
        set({ items: [] })
        
        // Sync to Supabase if authenticated
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          await supabase.from('cart_items').delete().eq('user_id', session.user.id)
        }
      },
      
      getSubtotal: () => {
        return get().items.reduce((total, item) => {
          const price = item.salePrice ? item.salePrice : item.price
          return total + price * item.quantity
        }, 0)
      },
      
      getTotal: () => {
        return get().getSubtotal()
      },
      
      syncCart: async () => {
        // Fetch from Supabase and merge with local
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
           set({ isSynced: true })
           return
        }

        const { data: dbItems, error } = await supabase
          .from('cart_items')
          .select('*, products(*, product_images(url, is_primary)), product_variants(*)')
          .eq('user_id', session.user.id)

        if (error || !dbItems) {
          console.error('Failed to sync cart:', error)
          return
        }

        const localItems = get().items
        
        // Push local items to DB if they don't exist in DB
        for (const localItem of localItems) {
          const existsInDb = dbItems.find(dbI => dbI.product_id === localItem.productId && dbI.variant_id === (localItem.variantId || null))
          if (!existsInDb) {
            await supabase.from('cart_items').insert({
              user_id: session.user.id,
              product_id: localItem.productId,
              variant_id: localItem.variantId || null,
              quantity: localItem.quantity,
            })
          }
        }

        // Refetch after merge
        const { data: finalDbItems } = await supabase
          .from('cart_items')
          .select('*, products(*, product_images(url, is_primary)), product_variants(*)')
          .eq('user_id', session.user.id)

        if (finalDbItems) {
          const mergedItems: CartItem[] = finalDbItems.map((dbItem: any) => {
            const product = dbItem.products
            const variant = dbItem.product_variants
            const image = product.product_images?.find((img: any) => img.is_primary)?.url || product.product_images?.[0]?.url || '/placeholder.png'

            return {
              id: variant ? `${product.id}-${variant.id}` : product.id,
              productId: product.id,
              variantId: variant?.id || null,
              name: product.name,
              color: variant?.color || null,
              size: variant?.size || null,
              price: variant?.price_override || product.price,
              salePrice: product.sale_price, // Wait, variant.sale_price_override? In DB it's not present or null, let's just stick to product.sale_price unless variant has override
              image: image,
              quantity: dbItem.quantity
            }
          })

          set({ items: mergedItems, isSynced: true })
        }
      }
    }),
    {
      name: 'boutique-cart-storage',
    }
  )
)
