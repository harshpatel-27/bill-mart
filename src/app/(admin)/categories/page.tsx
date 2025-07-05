import { CommonHeader } from "@/components/common-header";
import CategoryTableWrapper from "@/components/tables/categories/categories-table-wrapper";

const page = async () => {
  return (
    <div className="pb-12">
      <CommonHeader
        title="All Categories"
        btnText="Add new Category"
        href="/categories/add"
      />
      <CategoryTableWrapper />
    </div>
  );
};

export default page;
