const categories = [
    { name: "Burgers" },
    { name: "Smoothies" },
    { name: "Breakfast" },
    { name: "Sandwich" },
    { name: "Drinks" },
    { name: "Pizza" },
  ];
  
  function Categories() {
    return (
      <div className="flex overflow-x-auto space-x-4 p-4 bg-white">
        {categories.map((cat, index) => (
          <button
            key={index}
            className="px-6 py-2 bg-orange-100 text-orange-700 font-semibold rounded-full whitespace-nowrap hover:bg-orange-200 transition duration-300"
          >
            {cat.name}
          </button>
        ))}
      </div>
    );
  }
  
  export default Categories;
  