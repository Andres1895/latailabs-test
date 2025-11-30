import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Bienvenido Equipo de Latai Labs   
        </h1>
        <Link
          href="/users"
          className="inline-block bg-blue-500 text-white px-8 py-4 rounded-md hover:bg-blue-600 transition-colors text-lg font-semibold"
        >
          Ver Usuarios
        </Link>
      </div>
    </div>
  );
}

