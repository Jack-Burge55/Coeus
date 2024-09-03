import { useNavigate } from "react-router-dom"

const Home = ({setCoeusUser}) => {
  const navigate = useNavigate()

  const signOut = () => {
    setCoeusUser("")
    navigate("/login")
  }

  return (
    <>
      <h1>Home</h1>
      <button onClick={() => signOut()}>Sign Out</button>
    </>
  )
}

export default Home