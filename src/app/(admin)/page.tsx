import { CommonHeader } from "@/components/common-header";
import ProductsTableWrapper from "@/components/tables/product/product-table-wrapper";

const Page = async () => {
  return (
    <div className="pb-12">
      <CommonHeader
        title="All Products"
        btnText="Add new Product"
        href="/products/add"
      />
      <ProductsTableWrapper />
    </div>
  );
};

export default Page;
