import { CategoryForm } from "@/components/forms/categories/category-form";

const EditCategoryPage = async ({ params }: { params: any }) => {
  const { categoryId } = await params;
  return <CategoryForm type="update" categoryId={categoryId} />;
};

export default EditCategoryPage;
