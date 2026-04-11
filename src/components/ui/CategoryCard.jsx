import React from 'react'
import Categories from '../../pages/Categories'
function CategoryCard() {
  return (
    <>
    
    
      <div className="p-4">
      <div className="flex items-center justify-between mb-3 px-4">
        <div className="flex items-center gap-2">
          <span className="block w-1 h-4 bg-red-600 rounded-sm"></span>
          <i className="fa-solid fa-folder-open text-black text-lg"></i>
          <span className="font-nunito font-extrabold text-lg text-black">
            Kategoriyalar
          </span>
        </div>

        <span className="font-rubik font-semibold text-sm text-red-600 cursor-pointer">
          Barchasini ko‘rish →
        </span>
      </div>
      </div>

<div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
  <Categories 
  nomi={"Texnologiya"} 
  icon={"fa-laptop-code"} 
  soni={87} />
  <Categories 
  nomi={"Lifestyle"}  
  icon={"fa-magic"}       
  soni={120} />
  <Categories 
  nomi={"Go'zallik"}   
  icon={"fa-face-smile"}  
  soni={64} />
  <Categories 
  nomi={"Ovqat"}       
  icon={"fa-utensils"}    
  soni={45} />
  <Categories
  nomi={"Sport"}
  icon={"fa-solid fa-futbol"}
  soni={52}/>
  <Categories
  nomi={"Sayohat"}
  icon={"fa-solid fa-plane"}
  soni={38}/>
  <Categories
  nomi={"Biznes"}
  icon={"fa-solid fa-briefcase"}
  soni={71}/>
  <Categories
  nomi={"Gaming"}
  icon={"fa-solid fa-gamepad"}
  soni={33}/>
   <Categories
  nomi={"Ta'lim"}
  icon={"fa-solid fa-book"}
  soni={58}/>
   <Categories
  nomi={"Musiqa"}
  icon={"fa-solid fa-music"}
  soni={29}/>
</div>
</>
  )
}

export default CategoryCard