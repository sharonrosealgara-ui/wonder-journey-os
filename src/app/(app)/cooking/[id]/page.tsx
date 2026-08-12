import { recipes } from "@/config/recipes";
import { RecipeView } from "./recipe-view";

export function generateStaticParams() {
  return recipes.map((r) => ({ id: r.id }));
}

export default async function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RecipeView id={id} />;
}
