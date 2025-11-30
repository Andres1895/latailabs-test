"use client";
import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { User } from "../types/user";
import { useFavorites } from "../contexts/FavoritesContext";

export default function UserTable({
  initialUsers,
  currentPage,
}: {
  initialUsers: User[];
  currentPage: number;
}) {
  const router = useRouter();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [query, setQuery] = useState("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [userDetails, setUserDetails] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return initialUsers;
    return initialUsers.filter((u: User) => {
      return `${u?.name?.first ?? ""}`.toLowerCase().includes(q);
    });
  }, [initialUsers, query]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) =>
      `${a.name.first} ${a.name.last}`.localeCompare(
        `${b.name.first} ${b.name.last}`
      )
    );
    if (sortDir === "desc") arr.reverse();
    return arr;
  }, [filtered, sortDir]);

  const toggleExpand = useCallback((userId: string) => {
    setUserDetails((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  }, []);

  const handlePagination = (newPage: number) => {
    router.push({
      query: {
        page: newPage,
      },
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center p-4">
        <input
          type="text"
          aria-label="Buscar"
          name="search"
          className=" w-1/2 border-2 border-gray-300 rounded-md p-2"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busca por nombre o apellido"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
        >
          Sort {sortDir}
        </button>
      </div>

      <table className="w-full border-collapse border border-gray-300 rounded-md mb-10">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">⭐</th>
            <th className="border border-gray-300 p-2">Nombre</th>
            <th className="border border-gray-300 p-2">Correo electrónico</th>
            <th className="border border-gray-300 p-2">Telefono</th>
            <th className="border border-gray-300 p-2">Empresa</th>
            <th className="border border-gray-300 p-2">Detalles</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((user: User) => (
            <>
              <tr>
                <td className="border border-gray-300 p-2 text-center">
                  <button
                    //TO-DO EVITAR EL HYDRATATION ERROR CON ESTE COMPONENTE :(
                    aria-label={
                      isFavorite(user.login.uuid)
                        ? "Quitar de favoritos"
                        : "Agregar a favoritos"
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(user.login.uuid);
                    }}
                  >
                    {isFavorite(user.login.uuid) ? "⭐" : "☆"}
                  </button>
                </td>
                <td className="border border-gray-300 p-2 text-blue-600 hover:text-blue-800 ">
                  <Link href={`/users/${user.login.uuid}?page=${currentPage}`}>
                    {user.name.first} {user.name.last}
                  </Link>
                </td>
                <td className="border border-gray-300 p-2">{user.email}</td>
                <td className="border border-gray-300 p-2">{user.phone}</td>
                <td className="border border-gray-300 p-2">
                  {user.company || "Sin empresa"}
                </td>
                <td className="border border-gray-300 p-2">
                  <button
                    aria-expanded={userDetails.has(user.login.uuid)}
                    onClick={() => toggleExpand(user.login.uuid)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {userDetails.has(user.login.uuid) ? "Ocultar" : "Mostrar"}{" "}
                    detalles
                  </button>
                </td>
              </tr>
              {userDetails.has(user.login.uuid) && (
                <tr>
                  <td
                    colSpan={6}
                    className="border border-gray-300 p-4 bg-gray-50"
                  >
                    <div className="space-y-2">
                      {user.location && (
                        <div>
                          <p className="font-medium">Dirección:</p>
                          <p className="text-gray-700">
                            {user.location.street.number}{" "}
                            {user.location.street.name}, {user.location.city},{" "}
                            {user.location.state} {user.location.postcode}
                          </p>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={() => handlePagination(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-blue-500 text-white px-6 py-2 rounded-md disabled:bg-gray-300 hover:bg-blue-600"
        >
          Anterior
        </button>
        <button
          onClick={() => handlePagination(currentPage + 1)}
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
