"use client";

type Category = "all" | "images" | "news" | "videos";

interface Props {
  categories: { id: Category; label: string }[];
  activeCategory: Category;
  setActiveCategory: (c: Category) => void;
}

export default function CategoryTabs({
  categories,
  activeCategory,
  setActiveCategory,
}: Props) {
  return (
    <div className="flex gap-4 sm:gap-6 lg:gap-8 overflow-x-auto scrollbar-hide -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => setActiveCategory(category.id)}
          className={`py-2.5 sm:py-3 px-1 text-xs sm:text-sm font-medium transition-all duration-300 relative whitespace-nowrap ${
            activeCategory === category.id
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
          aria-current={activeCategory === category.id ? "page" : undefined}
        >
          {category.label}
          {activeCategory === category.id && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
          )}
        </button>
      ))}
    </div>
  );
}
