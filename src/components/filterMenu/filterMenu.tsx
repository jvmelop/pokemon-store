import { useEffect, useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getTypesList } from "@/back-end/getAPI";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import resetIcon from "@/asserts/images/reset-14414.svg";

const regions = ["Kanto", "Johto", "Hoenn", "Sinnoh", "Unova", "Kalos", "Alola"];
const types = getTypesList();

function FilterMenu() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filters);
  const [searchName, setSearchName] = useState(filters.searchName ?? "");

  useEffect(() => {
    setSearchName(filters.searchName ?? "");
  }, [filters.searchName]);

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = searchName.trim();
    dispatch({
      type: "SET_SEARCH_NAME",
      searchName: value === "" || value === "-" ? null : value,
    });
  };

  const resetSearch = () => {
    setSearchName("");
    dispatch({ type: "RESET_SEARCH_NAME" });
  };

  const resetTypes = () => dispatch({ type: "RESET_TYPE_FILTER" });
  const resetRegion = () => dispatch({ type: "RESET_REGION_FILTER" });

  return (
    <aside className="w-full shrink-0 bg-[#5007a3] px-3 pb-5 text-white shadow-xl lg:w-[16.75%] lg:min-w-64 lg:px-4">
      <h2 className="panel-text-shadow border-b-2 border-white/40 py-3 text-center text-base font-normal">
        Search Filters
      </h2>

      <section className="border-b border-white/20 py-3">
        <h3 className="panel-text-shadow mb-3 text-center text-sm font-medium">Name</h3>
        <form className="flex items-stretch" onSubmit={submitSearch}>
          <Input
            aria-label="Search Pokémon by name"
            className="h-8 min-w-0 flex-1 rounded-r-none border-0 bg-white text-xs text-zinc-900 placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-fuchsia-300"
            placeholder="Type here"
            value={searchName}
            onChange={(event) => setSearchName(event.target.value)}
          />
          <Button
            aria-label="Search Pokémon"
            className="h-8 w-12 shrink-0 rounded-none bg-[#31075d] text-white hover:bg-[#250449] border-none"
            type="submit"
          >
            <Search aria-hidden="true" />
          </Button>
          <Button
            aria-label="Reset name filter"
            className="h-8 w-8 ml-0.5 shrink-0 rounded-l-none bg-[#31075d] p-1 text-white hover:bg-[#250449] hover:text-white border-none"
            onClick={resetSearch}
            type="button"
            variant="ghost"
          >
            <img aria-hidden="true" className="size-4" src={resetIcon} alt="" />
          </Button>
        </form>
      </section>

      <section className="border-b border-white/20 py-3">
        <h3 className="panel-text-shadow mb-3 text-center text-sm font-medium">By Types</h3>
        <div className="flex items-center gap-2">
          <Select
            value={filters.type_1 ?? "none"}
            onValueChange={(value) =>
              dispatch({ type: "SET_TYPE_1_FILTER", type_1: value === "none" ? null : value })
            }
          >
            <SelectTrigger aria-label="First Pokémon type" className="h-8 min-w-0 flex-1 bg-white text-xs text-zinc-900">
              <SelectValue placeholder="None" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {types.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select
            value={filters.type_2 ?? "none"}
            onValueChange={(value) =>
              dispatch({ type: "SET_TYPE_2_FILTER", type_2: value === "none" ? null : value })
            }
          >
            <SelectTrigger aria-label="Second Pokémon type" className="h-8 min-w-0 flex-1 bg-white text-xs text-zinc-900">
              <SelectValue placeholder="None" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {types.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}
            </SelectContent>
          </Select>

          <Button
            aria-label="Reset type filters"
            className="size-6 text-white hover:bg-white/10 hover:text-white"
            onClick={resetTypes}
            size="icon-xs"
            type="button"
            variant="ghost"
          >
            <img aria-hidden="true" className="size-4" src={resetIcon} alt="" />
          </Button>
        </div>
      </section>

      <section className="py-3">
        <h3 className="panel-text-shadow mb-3 text-center text-sm font-medium">By Region</h3>
        <div className="flex items-center gap-2">
          <Select
            value={filters.region ?? "none"}
            onValueChange={(value) =>
              dispatch({ type: "SET_REGION_FILTER", region: value === "none" ? null : value })
            }
          >
            <SelectTrigger aria-label="Pokémon region" className="h-8 min-w-0 flex-1 bg-white text-xs text-zinc-900">
              <SelectValue placeholder="None" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {regions.map((region) => <SelectItem key={region} value={region}>{region}</SelectItem>)}
            </SelectContent>
          </Select>

          <Button
            aria-label="Reset region filter"
            className="size-6 text-white hover:bg-white/10 hover:text-white"
            onClick={resetRegion}
            size="icon-xs"
            type="button"
            variant="ghost"
          >
            <img aria-hidden="true" className="size-4" src={resetIcon} alt="" />
          </Button>
        </div>
      </section>
    </aside>
  );
}

export default FilterMenu;
