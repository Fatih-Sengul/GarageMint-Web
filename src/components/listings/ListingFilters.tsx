"use client";

import { useEffect, useState } from "react";
import type { ListingsSearchParams } from "@/lib/queries/listings";

export type Filters = Pick<
  ListingsSearchParams,
  "type" | "priceMin" | "priceMax" | "sortBy" | "sortDir" | "size"
>;

interface ListingFiltersProps {
  value: Filters;
  /** Next 15: function prop adı ...Action olmalı */
  onChangeAction: (f: Filters) => void;
}

export default function ListingFilters({
  value,
  onChangeAction,
}: ListingFiltersProps) {
  const [local, setLocal] = useState<Filters>(value);
  useEffect(() => setLocal(value), [value]);

  return (
    <div className="grid gap-3 rounded-xl border border-white/10 bg-neutral-900 p-3 sm:grid-cols-3 lg:grid-cols-6">
      <select
        value={local.type ?? ""}
        onChange={(e) =>
          setLocal({
            ...local,
            type: (e.target.value || undefined) as Filters["type"],
          })
        }
        className="input"
      >
        <option value="">Tür: Hepsi</option>
        <option value="SALE">Satış</option>
        <option value="TRADE">Takas</option>
      </select>

      <input
        type="number"
        min={0}
        placeholder="Fiyat min"
        value={local.priceMin ?? ""}
        onChange={(e) =>
          setLocal({
            ...local,
            priceMin: e.target.value ? Number(e.target.value) : undefined,
          })
        }
        className="input"
      />
      <input
        type="number"
        min={0}
        placeholder="Fiyat max"
        value={local.priceMax ?? ""}
        onChange={(e) =>
          setLocal({
            ...local,
            priceMax: e.target.value ? Number(e.target.value) : undefined,
          })
        }
        className="input"
      />

      <select
        value={local.sortBy ?? "createdAt"}
        onChange={(e) =>
          setLocal({ ...local, sortBy: e.target.value as Filters["sortBy"] })
        }
        className="input"
      >
        <option value="createdAt">Sırala: Yeni</option>
        <option value="price">Fiyat</option>
        <option value="modelYear">Model Yılı</option>
      </select>

      <select
        value={local.sortDir ?? "DESC"}
        onChange={(e) =>
          setLocal({ ...local, sortDir: e.target.value as Filters["sortDir"] })
        }
        className="input"
      >
        <option value="DESC">Azalan</option>
        <option value="ASC">Artan</option>
      </select>

      <select
        value={local.size ?? 24}
        onChange={(e) => setLocal({ ...local, size: Number(e.target.value) })}
        className="input"
      >
        <option value="12">12 / sayfa</option>
        <option value="24">24 / sayfa</option>
        <option value="48">48 / sayfa</option>
      </select>

      <div className="sm:col-span-3 lg:col-span-6 flex gap-2">
        <button
          onClick={() => onChangeAction(local)}
          className="rounded-lg bg-gradient-to-r from-sky-400 to-blue-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Filtreleri Uygula
        </button>
        <button
          onClick={() => {
            const reset: Filters = {
              type: undefined,
              priceMin: undefined,
              priceMax: undefined,
              sortBy: "createdAt",
              sortDir: "DESC",
              size: 24,
            };
            setLocal(reset);
            onChangeAction(reset);
          }}
          className="rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold"
        >
          Sıfırla
        </button>
      </div>
    </div>
  );
}
