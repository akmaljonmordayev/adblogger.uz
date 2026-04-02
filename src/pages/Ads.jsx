import { Link } from "react-router-dom";

const Ads = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">E'lonlar bo'limi</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((id) => (
          <div key={id} className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100/50 backdrop-blur-md">
            <h3 className="text-xl font-bold mb-2">E'lon #{id}</h3>
            <p className="text-gray-500 mb-4">Bu e'lon haqida qisqacha ma'lumot...</p>
            <Link to={`/ads/${id}`} className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"> Batafsil </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ads;
