import Sidebar from "../components/Sidebar";
import RestaurantList from "../components/RestaurantList";

export default function Restaurants() {
  return (
    <div className="flex min-h-screen bg-orange-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <RestaurantList />
      </main>
    </div>
  );
}
