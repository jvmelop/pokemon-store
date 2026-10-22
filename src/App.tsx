import brand from "./asserts/images/ball-pixel-big.png";
import FilterMenu from "./components/filterMenu/filterMenu";
import PokeList from "./components/pokeList/pokeList";
import SideCart from "./components/sideCart/sideCart";

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-[#ff0080] font-sans text-zinc-950">
      <header className="z-10 flex h-18 shrink-0 items-center justify-between bg-[#181818] px-4 text-white shadow-md">
        <a className="flex items-center gap-3 text-lg font-normal" href="/">
          <img src={brand} alt="PokéMart" className="size-9 object-contain" />
          <span>Master PokéMart</span>
        </a>
        <a
          className="text-md text-zinc-400 transition-colors hover:text-white"
          href="https://www.linkedin.com/in/joaovitormp/"
          target="_blank"
          rel="noreferrer"
        >
          Developer
        </a>
      </header>

      <main className="flex flex-1 flex-col lg:flex-row">
        <FilterMenu />
        <PokeList />
        <SideCart />
      </main>

      <footer className="flex flex-col items-center gap-1 bg-[#2d045c] px-4 py-4 text-center text-sm text-white">
        <span>João Vítor de Melo @ 2020</span>
        <a
          className="underline decoration-white/60 underline-offset-2 hover:text-fuchsia-200"
          href="https://about.me/jvmelop"
          target="_blank"
          rel="noreferrer"
        >
          About me &amp; Contact
        </a>
        <span>Hiring Coders | Gama Academy</span>
      </footer>
    </div>
  );
}

export default App;
