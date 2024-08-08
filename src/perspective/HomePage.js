import TopNavigationBarComponent from "../component/home/TopNavigationBarComponent"
import MainComponent from "../component/home/MainComponent"

function HomePage() {
    return (
        <div className="homepage">
            <TopNavigationBarComponent />
            <MainComponent />
        </div>
    )
}

export default HomePage