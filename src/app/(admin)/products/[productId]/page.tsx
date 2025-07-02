import SingleProductTableWrapper from "@/components/tables/single-product-table/single-product-table-wrapper";

const SingleProductDetailPage = async ({ params }: { params: any }) => {
  const { productId } = await params;
  return <SingleProductTableWrapper productId={productId} />;
};

export default SingleProductDetailPage;
