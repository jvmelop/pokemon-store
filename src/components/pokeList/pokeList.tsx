import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getFilteredPokeList, getTypesIcon } from "@/back-end/getAPI";
import { useAppSelector } from "@/redux/hooks";
import loading from "@/asserts/images/big-loading.gif";
import notFound from "@/asserts/images/not-found.png";
import PokeCard from "@/components/pokeCard/pokeCard";

const pokeTypesIcons = getTypesIcon();
const pageLimit = 24;

function PokeList() {
  const filters = useAppSelector((state) => state.filters);
  const [pokeNameList, setPokeNameList] = useState<string[] | undefined>();
  const [curPage, setCurPage] = useState(1);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isCurrent = true;
    const hasFilters = Object.values(filters).some(
      (value) => value !== null && value.trim() !== "",
    );

    setCurPage(1);
    setPokeNameList(undefined);
    setHasError(false);

    const timeout = window.setTimeout(async () => {
      try {
        const list = await getFilteredPokeList(hasFilters ? filters : null);
        if (isCurrent) setPokeNameList(list);
      } catch {
        if (isCurrent) {
          setPokeNameList([]);
          setHasError(true);
        }
      }
    }, 350);

    return () => {
      isCurrent = false;
      window.clearTimeout(timeout);
    };
  }, [filters]);

  const pageCount = pokeNameList ? Math.ceil(pokeNameList.length / pageLimit) : 0;
  const currentPageNames = pokeNameList?.slice(pageLimit * (curPage - 1), pageLimit * curPage) ?? [];

  const renderPageButtons = () => {
    if (pageCount <= 1) return null;

    return (
      <nav aria-label="Catalog pages" className="flex flex-wrap items-center justify-center gap-1.5">
        {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
          <Button
            aria-label={`Page ${page}`}
            aria-current={page === curPage ? "page" : undefined}
            className="pagination-button hover:bg-transparent hover:text-white"
            key={page}
            onClick={() => setCurPage(page)}
            type="button"
            variant="ghost"
            size="lg"
          >
            {page}
          </Button>
        ))}
      </nav>
    );
  };

  return (
    <section className="min-w-0 flex-1 bg-[#ff0080] px-3 pb-7 lg:px-4">
      <h1 className="catalog-title mt-3 pb-[10px] text-center text-4xl font-medium leading-none tracking-tight text-black lg:text-[3.5vw]">
        PokéCatalog
      </h1>

      <div className="min-h-[calc(100vh-8rem)] rounded-2xl bg-[#380572] px-4 py-6 shadow-[0_0_14px_rgba(255,255,255,.25)] sm:px-5 lg:px-6">
        {pokeNameList === undefined ? (
          <div className="flex min-h-[60vh] items-center justify-center" role="status">
            <img className="size-20 object-contain" src={loading} alt="Loading Pokémon" />
          </div>
        ) : pokeNameList.length === 0 ? (
          <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center text-white">
            <img className="max-h-56 max-w-full object-contain" src={notFound} alt="" />
            <p role="status">
              {hasError ? "The catalog could not be loaded. Please try again." : "No results were found :("}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {renderPageButtons()}
            <div className="flex flex-wrap items-stretch gap-5">
              {currentPageNames.map((name) => (
                <div
                  className="w-full sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.833rem)] 2xl:w-[calc(25%-0.9375rem)]"
                  key={name}
                >
                  <PokeCard pokeName={name} pokeTypesIcons={pokeTypesIcons} />
                </div>
              ))}
            </div>
            {renderPageButtons()}
          </div>
        )}
      </div>
    </section>
  );
}

export default PokeList;
