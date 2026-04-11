import React from "react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800 overflow-x-hidden">
      {/* HERO */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="bg-red-600 text-white py-24 text-center px-6"
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-6">Adbloger</h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl">
          Biz — Adbloger jamoasi, zamonaviy web saytlar va digital platformalar yaratamiz 🚀
        </p>
      </motion.div>

      {/* ABOUT */}
      <div className="max-w-6xl mx-auto py-16 px-6 grid md:grid-cols-2 gap-12 items-center">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show">
          <h2 className="text-3xl font-bold text-red-600 mb-4">Biz kimmiz?</h2>
          <p className="mb-4">
            Adbloger — kreativ developerlar jamoasi. Biz kuchli va chiroyli web mahsulotlar yaratamiz.
          </p>
          <p>
            Har bir loyiha ustida sifat va tezlik bilan ishlaymiz.
          </p>
        </motion.div>

        <motion.img
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          src="https://images.unsplash.com/photo-1551434678-e076c223a692"
          className="rounded-2xl shadow-xl"
        />
      </div>

      {/* SERVICES */}
      <div className="bg-red-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            className="text-3xl font-bold text-center text-red-600 mb-10"
          >
            Xizmatlarimiz
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {["Web Development","Reklama Platforma","UI/UX Dizayn"].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                whileHover={{ scale: 1.05 }}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition"
              >
                <h3 className="text-xl font-bold mb-2">{item}</h3>
                <p>Professional xizmat va zamonaviy yechimlar.</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* PROJECTS */}
      <div className="max-w-6xl mx-auto py-16 px-6">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          className="text-3xl font-bold text-center text-red-600 mb-10"
        >
          Loyihalarimiz
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[1,2,3].map((i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              whileHover={{ scale: 1.05 }}
              className="rounded-2xl overflow-hidden shadow-lg"
            >
              <img
                src={`https://picsum.photos/400/300?random=${i}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 bg-white">
                <h3 className="font-bold">Project {i}</h3>
                <p className="text-sm text-gray-500">Zamonaviy loyiha</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* TEAM */}
      <div className="bg-red-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            className="text-3xl font-bold text-center text-red-600 mb-10"
          >
            Jamoamiz
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[1,2,3].map((i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                whileHover={{ scale: 1.05 }}
                className="bg-white p-6 rounded-2xl text-center shadow"
              >
                <img
                  src={`https://randomuser.me/api/portraits/men/${i+20}.jpg`}
                  className="w-24 h-24 mx-auto rounded-full mb-4"
                />
                <h3 className="font-bold">Developer {i}</h3>
                <p className="text-gray-500">Frontend Developer</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        className="text-center py-16 px-6"
      >
        <h2 className="text-3xl font-bold mb-4">Biz bilan ishlashni boshlang 🚀</h2>
        <p className="text-gray-600 mb-6">Adbloger bilan biznesingizni yangi bosqichga olib chiqing</p>
        <button className="bg-red-600 text-white px-10 py-4 rounded-xl hover:bg-red-700 transition">
          Bog'lanish
        </button>
      </motion.div>
    </div>
  );
}
