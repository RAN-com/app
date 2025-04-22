
import RetailIncome from "./RetailIncome";

function RetailIncomeGallery() {
  const images = [
    {
      photoUrl: "https://example.com/photo1.jpg", // Replace with actual image URL
      photoName: "Product 1",
      description: "This is a description of Product 1.",
    },
    {
      photoUrl: "https://example.com/photo2.jpg", // Replace with actual image URL
      photoName: "Product 2",
      description: "This is a description of Product 2.",
    },
    {
      photoUrl: "https://example.com/photo3.jpg", // Replace with actual image URL
      photoName: "Product 3",
      description: "This is a description of Product 3.",
    },
  ];

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Retail Income Gallery</h2>
      
      {/* Grid layout for photos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {images.map((image, index) => (
          <RetailIncome
            key={index}
            photoUrl={image.photoUrl}
            photoName={image.photoName}
            description={image.description}
          />
        ))}
      </div>
    </div>
  );
}

export default RetailIncomeGallery;
