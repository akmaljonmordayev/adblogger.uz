import React from "react";

const bloggers = [
  {
    name: "Sardor Raximov",
    username: "sardortech",
    category: "Tech",
    followers: "450K",
    engagement: "8.4%",
    price: "2,500,000",
    gradient: "from-blue-500 to-blue-700",
  },
  {
    name: "Sherzod Qodirov",
    username: "sherzod_sport",
    category: "Sport",
    followers: "380K",
    engagement: "7.8%",
    price: "2,100,000",
    gradient: "from-green-500 to-green-700",
  },
  {
    name: "Nilufar Hasanova",
    username: "nilufarlife",
    category: "Lifestyle",
    followers: "320K",
    engagement: "6.2%",
    price: "1,800,000",
    gradient: "from-pink-500 to-pink-700",
  },
  {
    name: "Jasur Ergashev",
    username: "jasur_tech",
    category: "Tech",
    followers: "310K",
    engagement: "7.2%",
    price: "1,900,000",
    gradient: "from-blue-400 to-blue-600",
  },
   {
    name: "Jasur Ergashev",
    username: "jasur_tech",
    category: "Tech",
    followers: "310K",
    engagement: "7.2%",
    price: "1,900,000",
    gradient: "from-blue-400 to-blue-600",
  },
   {
    name: "Jasur Ergashev",
    username: "jasur_tech",
    category: "Tech",
    followers: "310K",
    engagement: "7.2%",
    price: "1,900,000",
    gradient: "from-blue-400 to-blue-600",
  },
   {
    name: "Jasur Ergashev",
    username: "jasur_tech",
    category: "Tech",
    followers: "310K",
    engagement: "7.2%",
    price: "1,900,000",
    gradient: "from-blue-400 to-blue-600",
  },
   {
    name: "Jasur Ergashev",
    username: "jasur_tech",
    category: "Tech",
    followers: "310K",
    engagement: "7.2%",
    price: "1,900,000",
    gradient: "from-blue-400 to-blue-600",
  },
   {
    name: "Jasur Ergashev",
    username: "jasur_tech",
    category: "Tech",
    followers: "310K",
    engagement: "7.2%",
    price: "1,900,000",
    gradient: "from-blue-400 to-blue-600",
  },
   {
    name: "Jasur Ergashev",
    username: "jasur_tech",
    category: "Tech",
    followers: "310K",
    engagement: "7.2%",
    price: "1,900,000",
    gradient: "from-blue-400 to-blue-600",
  },
   {
    name: "Jasur Ergashev",
    username: "jasur_tech",
    category: "Tech",
    followers: "310K",
    engagement: "7.2%",
    price: "1,900,000",
    gradient: "from-blue-400 to-blue-600",
  },
   {
    name: "Jasur Ergashev",
    username: "jasur_tech",
    category: "Tech",
    followers: "310K",
    engagement: "7.2%",
    price: "1,900,000",
    gradient: "from-blue-400 to-blue-600",
  },
   {
    name: "Jasur Ergashev",
    username: "jasur_tech",
    category: "Tech",
    followers: "310K",
    engagement: "7.2%",
    price: "1,900,000",
    gradient: "from-blue-400 to-blue-600",
  },
   {
    name: "Jasur Ergashev",
    username: "jasur_tech",
    category: "Tech",
    followers: "310K",
    engagement: "7.2%",
    price: "1,900,000",
    gradient: "from-blue-400 to-blue-600",
  },
   {
    name: "Jasur Ergashev",
    username: "jasur_tech",
    category: "Tech",
    followers: "310K",
    engagement: "7.2%",
    price: "1,900,000",
    gradient: "from-blue-400 to-blue-600",
  },
   {
    name: "Jasur Ergashev",
    username: "jasur_tech",
    category: "Tech",
    followers: "310K",
    engagement: "7.2%",
    price: "1,900,000",
    gradient: "from-blue-400 to-blue-600",
  },
  ];

function Card({ item }) {
  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden aspect-square flex flex-col hover:scale-105 transition duration-300">

      {/* Header */}
      <div className={`bg-gradient-to-r ${item.gradient} h-1/3 relative`}>
        <span className="absolute top-2 right-2 bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
          ✓ Tasdiqlangan
        </span>

        {/* Avatar */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-16 h-16 bg-white rounded-full shadow flex items-center justify-center text-xl">
            👤
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-between pt-10 pb-4 px-4">

        {/* Name */}
        <div className="text-center">
          <h3 className="font-semibold text-lg">{item.name}</h3>
          <p className="text-gray-400 text-sm">@{item.username}</p>

          <span className="inline-block mt-1 text-xs bg-red-100 text-red-500 px-2 py-0.5 rounded">
            {item.category}
          </span>
        </div>

        {/* Stats */}
        <div className="flex gap-2 w-full mt-3">
          <div className="flex-1 bg-gray-100 rounded-lg p-2 text-center">
            <p className="text-red-500 font-semibold">{item.followers}</p>
            <p className="text-xs text-gray-500">Followers</p>
          </div>
          <div className="flex-1 bg-gray-100 rounded-lg p-2 text-center">
            <p className="text-green-500 font-semibold">{item.engagement}</p>
            <p className="text-xs text-gray-500">Engagement</p>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between w-full mt-3">
          <p className="text-red-500 font-semibold">
            {item.price} so‘m
          </p>
          <button className="bg-red-500 text-white px-3 py-1 rounded-lg">
            Bron
          </button>
        </div>
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <div className="w-72 bg-white rounded-2xl shadow p-4 space-y-6">

      {/* Header */}
      <div className="bg-red-500 text-white px-4 py-3 rounded-xl font-semibold">
        🔻 Filtr
      </div>

      {/* Kategoriya */}
      <div>
        <p className="text-gray-400 text-sm mb-2 font-semibold">
          KATEGORIYA
        </p>

        {[
          ["Texnologiya", 87],
          ["Lifestyle", 120],
          ["Go'zallik", 64],
          ["Ovqat", 45],
          ["Sport", 52],
          ["Sayohat", 38],
        ].map(([name, count]) => (
          <label key={name} className="flex justify-between py-1 items-center">
            <div className="flex gap-2 items-center">
              <input type="checkbox" className="accent-red-500" />
              <span>{name}</span>
            </div>
            <span className="text-gray-400 text-sm">{count}</span>
          </label>
        ))}
      </div>

      {/* Platform */}
      <div>
        <p className="text-gray-400 text-sm mb-2 font-semibold">
          PLATFORMA
        </p>

        {["YouTube", "Instagram", "Telegram", "TikTok"].map((p) => (
          <label key={p} className="flex gap-2 py-1">
            <input type="checkbox" className="accent-red-500" />
            {p}
          </label>
        ))}
      </div>

      {/* Obunachilar */}
      <div>
        <p className="text-gray-400 text-sm mb-2 font-semibold">
          OBUNACHILAR
        </p>

        {["10K - 50K", "50K - 200K", "200K - 500K", "500K+"].map((o) => (
          <label key={o} className="flex gap-2 py-1">
            <input type="checkbox" className="accent-red-500" />
            {o}
          </label>
        ))}
      </div>

      {/* Narx */}
      <div>
        <p className="text-gray-400 text-sm mb-2 font-semibold">
          NARX (SO'M)
        </p>

        <div className="flex gap-2">
          <input
            type="number"
            placeholder="50000"
            className="w-full border rounded-lg px-2 py-1"
          />
          <input
            type="number"
            placeholder="Max"
            className="w-full border rounded-lg px-2 py-1"
          />
        </div>
      </div>

      {/* Holat */}
      <div>
        <p className="text-gray-400 text-sm mb-2 font-semibold">
          HOLAT
        </p>

        <label className="flex gap-2 py-1">
          <input type="checkbox" className="accent-red-500" />
          Tasdiqlangan
        </label>

        <label className="flex gap-2 py-1">
          <input type="checkbox" />
          Barchasi
        </label>
      </div>

      {/* Button */}
      <button className="w-full bg-red-500 text-white py-2 rounded-xl font-semibold">
        Filtrlash
      </button>

      {/* Reklama */}
      <div className="bg-red-500 text-white p-4 rounded-xl">
        <p className="font-semibold mb-2">📢 Reklama ber</p>
        <p className="text-sm mb-3">
          Eng mos blogerga bir zumda so‘rov yuboring
        </p>
        <button className="bg-white text-red-500 w-full py-2 rounded-lg font-semibold">
          So‘rov yuborish
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="bg-gray-100 min-h-screen p-6 flex gap-6">

      {/* Sidebar */}
      <Sidebar />

      {/* Right */}
      <div className="flex-1">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">
            Barcha blogerlar
          </h1>

          <select className="border rounded-lg px-3 py-1">
            <option>Eng mashhur</option>
          </select>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bloggers.map((item, i) => (
            <Card key={i} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}