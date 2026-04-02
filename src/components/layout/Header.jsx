import React, { PureComponent } from 'react'

function Header() {
    return (
    <div className="wrapper">
      <div className="bg-red-600 text-white text-sm px-6 py-2 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span>Toshkent, O'zbekiston</span>
          <span>|</span>
          <span>🔥 500+ tasdiqlangan bloger</span>
        </div>

        <div className="flex items-center gap-4">
          <button className="hover:underline">Ro'yxatdan o'tish</button>
          <button className="hover:underline">Kirish</button>
          <button className="bg-yellow-400 text-black px-4 py-1 rounded-lg font-medium hover:bg-yellow-300">
            Bloger bo'lish
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between px-8 py-4 border-b">
        <h1 className="text-2xl font-bold">
          <span className="text-red-600">add</span>
          <span className="text-yellow-500">Bloger</span>
        </h1>

        <div className="flex items-center w-[400px] border rounded-full overflow-hidden">
          <input
            type="text"
            placeholder="Bloger ismi, kategoriya yoki platforma..."
            className="w-full px-4 py-2 outline-none"
          />
          <button className="bg-red-600 p-3 text-white">
            <Search size={18} />
          </button>
        </div>

        <div className="flex items-center gap-6 font-medium text-gray-700">
          <button className="hover:text-red-600">Bosh sahifa</button>
          <button className="hover:text-red-600">Blogerlar</button>
          <button className="hover:text-red-600">Kategoriyalar</button>
          <button className="hover:text-red-600">Narxlar</button>
          <button className="hover:text-red-600">Bog'lanish</button>

          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500">
            + E'lon berish
          </button>
        </div>
      </div>
    </div>
    )
}

export default Header