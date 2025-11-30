import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from "next";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { User } from "../../types/user";
import { useFavorites } from "../../contexts/FavoritesContext";

export default function UserDetailPage({
  user,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  const { toggleFavorite, isFavorite } = useFavorites();
  const page = router.query.page as string;
  const backUrl = page ? `/users?page=${page}` : "/users";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href={backUrl}
          className="inline-flex items-center p-2 rounded-lg w-20 text-white mb-6 justify-center bg-blue-500"
        >
          Volver
        </Link>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gray-400 p-6 text-white flex justify-center items-center flex-col">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold">
                {user.name.title} {user.name.first} {user.name.last}
              </h1>
              <button
                // TO-DO EVITAR EL HYDRATATION ERROR CON ESTE COMPONENTE :(
                onClick={() => toggleFavorite(user.login.uuid)}
                className="text-4xl hover:scale-110 transition-transform"
                aria-label={isFavorite(user.login.uuid) ? "Quitar de favoritos" : "Agregar a favoritos"}
              >
                {isFavorite(user.login.uuid) ? "⭐" : "☆"}
              </button>
            </div>
            <div className="flex justify-center items-center">
              <Image
                className="rounded-full"
                src={user.picture.large}
                alt="Description of the image"
                width={200}
                height={200}
              />
            </div>
          </div>

          <div className="flex flex-col space-around p-8">
            <div className="flex justify-around">
              <div className="flex-1">
                <div className="flex flex-col gap-2">
                  <div>
                    <p className="text-sm text-gray-500">Correo electrónico</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Teléfono</p>
                    <p className="font-medium">{user?.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Celular</p>
                    <p className="font-medium">{user?.cell}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Edad</p>
                    <p className="font-medium">{user?.dob.age} años</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fecha de Nacimiento</p>
                    <p className="font-medium">
                      {new Date(user?.dob.date).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                </div>
              </div>
              <div></div>
              <div className="flex-1">
                <div className="flex-col gap-2">
                  <p className="text-sm text-gray-500">Genero</p>
                  <p className="font-medium">
                    {user?.gender === "male" ? "Masculino" : "Femenino"}
                  </p>
                </div>
                <h2 className="text-sm font-semibold mt-2 text-gray-500">
                  Dirección
                </h2>
                <div>
                  <p className="font-medium">
                    {user?.location?.street.number}{" "}
                    {user?.location?.street.name}
                  </p>
                  <p className="font-medium">
                    {user?.location?.city}, {user?.location?.state}
                  </p>
                  <p className="font-medium">{user?.location?.postcode}</p>
                  <p className="font-medium">{user?.location?.country}</p>
                </div>
              </div>
              {user?.company && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h2 className="text-xl font-semibold mb-2 text-gray-800">
                    Empresa
                  </h2>
                  <p className="font-medium">{user.company}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const MAX_PAGES = 5;
  const paths: { params: { id: string } }[] = [];

  for (let page = 1; page <= MAX_PAGES; page++) {
    try {
      const response = await fetch(
        `https://randomuser.me/api/?results=20&page=${page}&seed=demo`
      );
      const data = await response.json();
      data.results.forEach((user: User) => {
        if (user.login?.uuid) {
          paths.push({
            params: { id: user.login.uuid },
          });
        }
      });
    } catch (error) {
      console.error(error);
    }
  }
  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<{ user: User }> = async ({
  params,
}) => {
  const id = params?.id as string;

  try {
    const MAX_PAGES = 100; 
    for (let page = 1; page <= MAX_PAGES; page++) {
      const response = await fetch(
        `https://randomuser.me/api/?results=20&page=${page}&seed=demo`
      );

      const data = await response.json();
      const user = data.results.find((u: User) => u.login.uuid === id);

      if (user) {
        return {
          props: { user },
        };
      }
    }
    return {
        notFound: true,
      };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
};
