import { useEffect, useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getPokeData, type PokemonData } from "@/back-end/getAPI";
import { useAppDispatch } from "@/redux/hooks";
import addCart from "@/asserts/images/add-to-cart.png";
import loading from "@/asserts/images/mini-loading.gif";
import missingSprite from "@/asserts/images/missing-sprite.png";

interface PokeCardProps {
  pokeName: string;
  pokeTypesIcons: Record<string, string>;
}

function formatMoney(value: number): string {
  const [whole, decimal = "00"] = value.toFixed(2).split(".");
  const groupedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${groupedWhole},${decimal}`;
}

function PokeCard({ pokeName, pokeTypesIcons }: PokeCardProps) {
  const dispatch = useAppDispatch();
  const [pokeData, setPokeData] = useState<PokemonData>();
  const [hasError, setHasError] = useState(false);
  const [shiny, setShiny] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    let isCurrent = true;

    getPokeData(pokeName)
      .then((data) => {
        if (isCurrent) setPokeData(data);
      })
      .catch(() => {
        if (isCurrent) setHasError(true);
      });

    return () => {
      isCurrent = false;
    };
  }, [pokeName]);

  const unitPrice = Number(shiny ? pokeData?.price_shiny : pokeData?.price_default);
  const priceNum = unitPrice * quantity;
  const priceStr = formatMoney(Number.isFinite(priceNum) ? priceNum : 0);
  const sprite = shiny
    ? pokeData?.sprites.front_shiny ?? missingSprite
    : pokeData?.sprites.front_default ?? missingSprite;

  const handleQuantityChange = (event: ChangeEvent<HTMLInputElement>) => {
    const parsed = Number.parseInt(event.target.value, 10);
    setQuantity(Math.min(100, Math.max(1, Number.isNaN(parsed) ? 1 : parsed)));
  };

  const addToCart = () => {
    if (!pokeData) return;

    dispatch({
      type: "ADD_ITEM",
      newItem: {
        name: pokeData.name,
        quantity,
        shiny,
        priceNum,
        priceStr,
        types: pokeData.types.map(({ type }) => type.name),
      },
    });
  };

  return (
    <Card className="relative flex h-[245px] min-h-[245px] flex-col items-center gap-0 rounded-lg bg-[#f8f8f8] px-3 py-2 text-center text-zinc-950 shadow-md transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_22px_rgba(249,80,255,.35)]">
      {!pokeData ? (
        <div className="flex min-h-[210px] w-full flex-col items-center justify-center gap-3" role="status">
          {hasError ? (
            <span className="text-xs text-red-700">Could not load Pokémon.</span>
          ) : (
            <img className="size-12 object-contain" src={loading} alt="" />
          )}
        </div>
      ) : (
        <>
          <img
            className="h-24 w-auto max-w-full shrink-0 object-contain"
            src={sprite}
            alt={`${pokeData.name}${shiny ? " shiny" : ""}`}
          />
          <div className="flex flex-col items-center">
            <h2 className="max-w-full truncate text-sm font-medium leading-5">{pokeData.name}</h2>
            <div className="flex h-5 items-center justify-center gap-1">
              {pokeData.types.map(({ type }) => (
                <img
                  className="size-5 object-contain"
                  src={pokeTypesIcons[type.name]}
                  key={type.name}
                  alt={`${type.name} type`}
                />
              ))}
            </div>
            <p className="mt-1 text-base font-bold leading-5 text-[#08ce00]">$ {priceStr}</p>
          </div>

          <div className="mt-auto flex w-full items-end justify-between pt-2 text-left text-xs">
            <div className="flex flex-col gap-1.5">
              <Label className="flex cursor-pointer items-center gap-2 font-normal" htmlFor={`shiny-${pokeName}`}>
                <span className="w-10">Shiny</span>
                <Checkbox
                  checked={shiny}
                  id={`shiny-${pokeName}`}
                  onCheckedChange={(checked) => setShiny(checked === true)}
                />
              </Label>
              <Label className="flex items-center gap-2 font-normal" htmlFor={`quantity-${pokeName}`}>
                <span className="w-10">Qtd.</span>
                <Input
                  className="h-[25px] w-[50px] rounded-sm px-2 text-xs"
                  id={`quantity-${pokeName}`}
                  max={100}
                  min={1}
                  onChange={handleQuantityChange}
                  type="number"
                  value={quantity}
                />
              </Label>
            </div>
            <Button
              aria-label={`Add ${pokeData.name} to cart`}
              className="absolute right-2 bottom-2 size-9 rounded-xl bg-[#08d600] p-1 text-white shadow-md hover:bg-[#08ec00]"
              onClick={addToCart}
              type="button"
            >
              <img className="size-full object-contain" src={addCart} alt="" />
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}

export default PokeCard;
