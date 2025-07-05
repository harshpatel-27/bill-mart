import { ProductForm } from "@/components/forms/product/product-form";

const EditProductPage = async ({ params }: { params: any }) => {
  const { productId } = await params;
  return <ProductForm type="update" productId={productId} />;
};

export default EditProductPage;
