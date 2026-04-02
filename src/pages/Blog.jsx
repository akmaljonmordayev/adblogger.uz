const Blog = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold animate-fade-in">AdBloger Blog</h2>
      <div className="flex flex-col gap-8">
        {[1, 2, 3].map((id) => (
          <article key={id} className="bg-white/70 p-8 rounded-3xl shadow-sm border border-white hover:shadow-lg transition-all duration-300">
            <div className="text-blue-600 text-sm font-semibold mb-2 uppercase tracking-wider">Maqola</div>
            <h3 className="text-2xl font-bold mb-4">Maqola sarlavhasi #{id}</h3>
            <p className="text-gray-600 leading-relaxed mb-6">Blog postining birinchi qismi. Bu yerda maqola haqida qiziqarli narsalar yozilgan bo'ladi...</p>
            <button className="text-blue-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">O'qishda davom etish &rarr;</button>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Blog;
