import { useState } from "react";
import { ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import type { CartItem } from "@/redux/reducers/cartItems";
import cartIcon from "@/asserts/images/cart-ball.png";

function formatMoney(value: number): string {
  const [whole, decimal = "00"] = value.toFixed(2).split(".");
  const groupedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${groupedWhole},${decimal}`;
}

interface CartLineProps {
  item: CartItem;
  canDelete?: boolean;
  onRemove?: (code: number) => void;
}

function CartLine({ item, canDelete = false, onRemove }: CartLineProps) {
  return (
    <div className="flex min-w-0 items-center gap-2 border-b border-zinc-200 px-2 py-2 text-xs text-zinc-800 last:border-b-0">
      <span className="shrink-0 font-medium">{item.quantity}×</span>
      <span className="min-w-0 flex-1 truncate text-left">{item.name}</span>
      <span className="shrink-0 text-amber-500" aria-label={item.shiny ? "Shiny" : undefined}>
        {item.shiny ? "★" : ""}
      </span>
      <span className="shrink-0 font-medium">$ {item.priceStr}</span>
      {canDelete && onRemove && (
        <Button
          aria-label={`Remove ${item.name} from cart`}
          className="size-7 shrink-0"
          onClick={() => onRemove(item.code)}
          size="icon-sm"
          type="button"
          variant="destructive"
        >
          <Trash2 aria-hidden="true" />
        </Button>
      )}
    </div>
  );
}

function SideCart() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cartItems);
  const [canDelete, setCanDelete] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const totalPrice = items.reduce((total, item) => total + item.priceNum, 0);

  const removeItem = (code: number) => dispatch({ type: "DELETE_ITEM", code });

  const handleDialogChange = (open: boolean) => {
    setShowModal(open);
    if (!open) dispatch({ type: "CLEAR_LIST" });
  };

  return (
    <aside className="flex w-full shrink-0 flex-col bg-[#5007a3] px-3 pb-5 text-white shadow-xl lg:w-[16.75%] lg:min-w-64 lg:px-4">
      <div className="flex items-center justify-center gap-3 border-b-2 border-white/40 py-3">
        <h2 className="panel-text-shadow text-base font-normal">Cart</h2>
        <img className="size-9 object-contain" src={cartIcon} alt="" />
      </div>

      <div className="panel-text-shadow mt-2 flex min-h-8 items-center justify-between gap-3 px-1 text-sm font-semibold">
        <span>Total</span>
        <span className="text-[#ff385c]">$ {formatMoney(totalPrice)}</span>
      </div>

      {items.length > 0 ? (
        <>
          <div className="mt-1 flex min-h-8 items-center justify-end">
            <Button
              aria-pressed={canDelete}
              className={`h-7 gap-1.5 px-2 text-xs ${canDelete ? "bg-red-600 text-white hover:bg-red-700" : "text-white hover:bg-white/10 hover:text-white"}`}
              onClick={() => setCanDelete((value) => !value)}
              type="button"
              variant={canDelete ? "default" : "ghost"}
            >
              <Trash2 aria-hidden="true" className="size-3.5" />
              {canDelete ? "Done" : "Remove items"}
            </Button>
          </div>
          <div className="mt-1 flex max-h-[calc(100vh-14rem)] flex-col overflow-y-auto rounded-md border-y border-white/25 bg-white">
            {items.map((item) => (
              <CartLine canDelete={canDelete} item={item} key={item.code} onRemove={removeItem} />
            ))}
          </div>

          <Button
            className="mt-auto w-full bg-[#ff0080] text-white shadow-md hover:bg-[#ff3b9d]"
            onClick={() => setShowModal(true)}
            type="button"
          >
            <ShoppingCart aria-hidden="true" />
            Buy
          </Button>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 py-8 text-center text-sm text-white/75">
          <ShoppingCart aria-hidden="true" className="size-8" />
          <p>Your cart is empty</p>
        </div>
      )}

      <Dialog open={showModal} onOpenChange={handleDialogChange}>
        <DialogContent className="max-h-[85vh] overflow-y-auto border-0 p-0 sm:max-w-lg">
          <DialogHeader className="items-center px-6 pt-6 text-center">
            <img
              className="h-24 w-24 object-contain"
              src="https://25.media.tumblr.com/tumblr_lh013m9gyV1qgjv7io1_500.gif"
              alt=""
            />
            <DialogTitle className="text-xl">Thanks, trainer!</DialogTitle>
            <DialogDescription>
              Your Pokémon have been successfully purchased :)
            </DialogDescription>
          </DialogHeader>
          <div className="mx-6 overflow-hidden rounded-md border border-zinc-200">
            {items.map((item) => <CartLine item={item} key={item.code} />)}
          </div>
          <div className="mx-6 flex items-center justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-[#ff385c]">$ {formatMoney(totalPrice)}</span>
          </div>
          <DialogFooter>
            <Button className="bg-[#ff0080] text-white hover:bg-[#ff3b9d]" onClick={() => handleDialogChange(false)}>
              Buy More
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
}

export default SideCart;
