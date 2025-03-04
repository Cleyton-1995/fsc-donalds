import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useContext, useState } from "react";
import { CartContext } from "../contexts/cart";
import CartProductItem from "./cartIProducttem";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormatCurrency } from "@/helpers/formatCurrency";
import FinishOrderDialog from "./finishOrderDialog";

export default function CartSheet() {
  const [finishOrderDialogIsOpen, setFinishOrderDialogIsOpen] = useState(false);
  const { total, isOpen, toggleCart, products } = useContext(CartContext);

  return (
    <Sheet open={isOpen} onOpenChange={toggleCart}>
      <SheetContent className="w-[80%]">
        <SheetHeader>
          <SheetTitle className="text-left">Sacola</SheetTitle>
        </SheetHeader>

        <div className="py-5 h-full flex-col flex">
          <div className="flex-auto">
            {products.map((product) => (
              <CartProductItem key={product.id} product={product} />
            ))}
          </div>

          <Card className="mb-6">
            <CardContent className="p-5">
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-sm font-semibold">{FormatCurrency(total)}</p>
              </div>
            </CardContent>
          </Card>

          <Button
            className="w-full rounded-full"
            onClick={() => setFinishOrderDialogIsOpen(true)}
          >
            Finalizar pedido
          </Button>

          <FinishOrderDialog
            open={finishOrderDialogIsOpen}
            onOpenChange={setFinishOrderDialogIsOpen}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
