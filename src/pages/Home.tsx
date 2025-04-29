import '../assets/css/home.css';
import home from '../assets/img/home.jpg';

function Home() {
    return (
        <div className="home">
            <h1>Welcome to Fitness Center</h1>
            <img src={home} alt="Fitness Center" />
        </div>
    )
}

export default Home