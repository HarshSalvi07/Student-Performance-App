import { Link } from "react-router-dom"

function Home() {
    return (
        <div>
            <h1>This is home page</h1>
            <h3><Link to={'/register'}>Register</Link></h3>
        </div>
    )
}

export default Home