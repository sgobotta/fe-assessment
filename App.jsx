import React, { useState, useEffect } from "react";
import PRODUCTS from "./products.json";

// Simulated API. Variable latency makes the async race observable.
function fakeApi(query) {
  const delay = 300 + Math.random() * 900;
  return new Promise((resolve) => {
    setTimeout(() => {
      const q = query.trim().toLowerCase();
      resolve(PRODUCTS.filter((p) => p.name.toLowerCase().includes(q)));
    }, delay);
  });
}

// Deliberately expensive so per-render recomputation is measurable.
function scoreProduct(p) {
  let x = 0;
  for (let i = 0; i < 250000; i++) {
    x += Math.sqrt((p.price + i) * p.rating) % 7;
  }
  return p.rating * 1000 - p.price + (x % 1);
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [visible, setVisible] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fakeApi(query).then((results) => {
      setProducts(results);
      setLoading(false);
    });
  }, [query]);

  useEffect(() => {
    setVisible(category === "all" ? products : products.filter((p) => p.category === category));
  }, [products, category]);

  useEffect(() => {
    document.title = `${favorites.length} favorites`;
  }, []);

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((f) => f !== id));
    } else {
      favorites.push(id);
      setFavorites(favorites);
    }
  };

  const ranked = visible.map((p) => ({ ...p, score: scoreProduct(p) }));
  if (sortBy === "relevance") ranked.sort((a, b) => b.score - a.score);
  else if (sortBy === "priceAsc") ranked.sort((a, b) => a.price - b.price);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-8">
        <h1 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-4xl font-black tracking-tight text-transparent">
          Gadget Catalog
        </h1>
        <p className="mt-2 text-gray-dark">Find your next favorite thing.</p>
      </header>
      <Toolbar
        query={query} onQuery={setQuery}
        category={category} onCategory={setCategory}
        sortBy={sortBy} onSort={setSortBy}
      />
      {loading ? (
        <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          <span className="size-2 animate-ping rounded-full bg-primary" />
          Loading…
        </p>
      ) : null}
      <ProductList
        products={ranked}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
}

const field =
  "rounded-xl border border-black/10 bg-white px-4 py-2.5 text-black shadow-sm outline-none " +
  "transition focus:border-primary focus:ring-2 focus:ring-primary/20";

function Toolbar({ query, onQuery, category, onCategory, sortBy, onSort }) {
  return (
    <div className="mb-6 flex flex-wrap gap-3">
      <input className={`${field} min-w-60 flex-1 placeholder:text-gray-dark`}
             placeholder="Search…" value={query}
             onChange={(e) => onQuery(e.target.value)} />
      <select className={field} value={category} onChange={(e) => onCategory(e.target.value)}>
        <option value="all">All</option>
        <option value="audio">Audio</option>
        <option value="wearables">Wearables</option>
        <option value="home">Home</option>
      </select>
      <select className={field} value={sortBy} onChange={(e) => onSort(e.target.value)}>
        <option value="relevance">Relevance</option>
        <option value="priceAsc">Price ↑</option>
      </select>
    </div>
  );
}

const CATEGORY_STYLES = {
  audio:     { icon: "🎧", tile: "from-primary to-primary/60" },
  wearables: { icon: "⌚", tile: "from-secondary to-secondary/60" },
  home:      { icon: "🏠", tile: "from-primary to-secondary" },
};

function ProductList({ products, favorites, onToggleFavorite }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p, index) => (
        <ProductRow
          key={index}
          product={p}
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </ul>
  );
}

const ProductRow = React.memo(function ProductRow({ product, favorites, onToggleFavorite }) {
  const style = CATEGORY_STYLES[product.category];
  return (
    <li className="group relative overflow-hidden rounded-2xl border border-black/5 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
      <div className={`mb-4 flex h-28 items-center justify-center rounded-xl bg-gradient-to-br text-5xl ${style.tile}`}>
        <span className="transition group-hover:scale-110">{style.icon}</span>
      </div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold leading-tight">{product.name}</h2>
          <p className="mt-1 text-xs uppercase tracking-wider text-gray-dark">{product.category}</p>
        </div>
        <FavoriteButton id={product.id} favorites={favorites} onToggleFavorite={onToggleFavorite} />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xl font-bold text-primary">${product.price}</span>
        <span className="rounded-full bg-white-brighter px-2 py-0.5 text-sm text-black">★ {product.rating}</span>
      </div>
    </li>
  );
});

function FavoriteButton({ id, favorites, onToggleFavorite }) {
  const active = favorites.includes(id);
  return (
    <button
      className={`grid size-9 shrink-0 place-items-center rounded-full text-lg transition active:scale-90 ${
        active ? "bg-secondary text-white" : "bg-white-brighter text-gray-dark hover:bg-secondary/10 hover:text-secondary"
      }`}
      onClick={() => onToggleFavorite(id)}
    >
      {active ? "★" : "☆"}
    </button>
  );
}
