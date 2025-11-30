import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import UserTable from '../../components/UsersTable'
import { User } from '../../types/user'

const UserPage = ({ 
  users,
  currentPage
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div className="p-6 max-h-screen">
      <UserTable initialUsers={users} currentPage={currentPage} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<{
    users: User[];
    currentPage: number;
  }> = async ({ query }) => {
    const page = parseInt(query.page as string) || 1;
    
    try {
      const response = await fetch(
        `https://randomuser.me/api/?results=20&page=${page}&seed=demo`
      );
      
      const data = await response.json();
      
      return {
        props: {
          users: data.results,
          currentPage: page,
        },
      };
    } catch (error) {
      console.error("Error fetching users:", error);
      return {
        props: {
          users: [],
          currentPage: 1,
        },
      };
    }
  };

export default UserPage