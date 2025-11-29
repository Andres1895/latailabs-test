import UserTable from '../../components/UsersTable'
import { User } from '../../types/user'

const UserPage = ({ users }: { users: User[] }) => {
    console.log(users);

  return (
    <div>
        <UserTable initialUsers={users} />
    </div>
  )
}

export async function getServerSideProps() {
  const response = await fetch(`https://randomuser.me/api/?results=20`);
  const data = await response.json();
  return {
    props: { users: data.results },
  }
}

export default UserPage