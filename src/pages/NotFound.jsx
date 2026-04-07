import { Link } from "react-router-dom";
import notFoundImg from "../assets/404.png";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
      <img src={notFoundImg} alt="" />
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-600 mb-6">Sahifa topilmadi</h2>
      <p className="text-gray-500 mb-8 max-w-md">Kechirasiz, siz qidirayotgan sahifa mavjud emas yoki o'chirilgan bo'lishi mumkin.</p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Bosh sahifaga qaytish
      </Link>
    </div>
  );
};

export default NotFound;
