import React, { useState } from "react";

const cards = [/* o‘zgarmaydi */];
const jobs = [/* o‘zgarmaydi */];

const defaultForm = {
  ism: "",
  familiya: "",
  ishJoyi: "",
  oldingiIshJoyI: "",
  tajriba: "",
  telefon: "",
  nomer: "",
  email: "",
};

export default function App() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);

  const openCard = (card) => setSelectedCard(card);
  const closeCard = () => setSelectedCard(null);

  const openModal = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
    setForm(defaultForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ job: selectedJob?.title, ...form });
    closeModal();
  };

  return (
    <div className="max-w-[900px] mx-auto px-5 py-10 bg-slate-50 text-slate-900 min-h-screen">

      <h1 className="text-3xl md:text-4xl font-extrabold mb-6">
        Nima taklif etamiz?
      </h1>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-12">
        {cards.map((card, i) => (
          <div
            key={i}
            onClick={() => openCard(card)}
            className="bg-white border rounded-2xl p-6 cursor-pointer shadow hover:shadow-xl hover:-translate-y-1 transition"
          >
            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-blue-100 mb-4 text-2xl">
              {card.icon}
            </div>

            <h3 className="font-bold text-lg mb-2">{card.title}</h3>
            <p className="text-slate-500 text-sm">{card.short}</p>

            <span className="text-blue-600 text-sm font-semibold mt-4 inline-block">
              Batafsil
            </span>
          </div>
        ))}
      </div>

      {/* CARD MODAL */}
      {selectedCard && (
        <div
          onClick={closeCard}
          className="fixed inset-0 bg-black/60 backdrop-blur flex items-center justify-center p-4 z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <button onClick={closeCard} className="text-xl float-right">×</button>

            <div className="flex gap-4 mb-4">
              <div className="text-3xl">{selectedCard.icon}</div>
              <div>
                <h2 className="text-2xl font-bold">{selectedCard.title}</h2>
                <p className="text-slate-500">{selectedCard.short}</p>
              </div>
            </div>

            <p className="mb-4 text-slate-700">{selectedCard.detail}</p>

            <div className="flex flex-wrap gap-2">
              {selectedCard.points.map((p, i) => (
                <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* JOBS */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-2xl font-bold">Ochiq lavozimlar</h1>
          <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold">
            {jobs.length}
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {jobs.map((job, i) => (
            <div
              key={i}
              className="bg-white border rounded-2xl p-5 flex flex-col md:flex-row justify-between gap-4 shadow"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="font-bold text-lg">{job.title}</h2>
                  {job.badge && (
                    <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                      {job.badge}
                    </span>
                  )}
                </div>

                <p className="text-slate-500 text-sm mb-2">
                  {job.description}
                </p>

                <div className="flex flex-wrap gap-2 text-xs">
                  {job.meta.map((m, i) => (
                    <span key={i} className="bg-slate-100 px-2 py-1 rounded-full">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => openModal(job)}
                className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Ariza →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* FORM MODAL */}
      {isModalOpen && (
        <div
          onClick={closeModal}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 w-full max-w-2xl"
          >
            <div className="flex justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold">Ariza yuborish</h2>
                <p className="text-slate-500">{selectedJob?.title}</p>
              </div>
              <button onClick={closeModal}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(form).map((key) => (
                <input
                  key={key}
                  name={key}
                  value={form[key]}
                  onChange={handleChange}
                  placeholder={key}
                  required
                  className="border rounded-lg px-4 py-3 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              ))}

              <div className="col-span-1 md:col-span-2 flex justify-end gap-2">
                <button type="button" onClick={closeModal} className="bg-slate-200 px-4 py-2 rounded-lg">
                  Bekor qilish
                </button>
                <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded-lg">
                  Yuborish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}