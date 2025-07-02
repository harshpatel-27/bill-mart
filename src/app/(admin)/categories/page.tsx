import { CommonHeader } from "@/components/common-header";

const page = () => {
  return (
    <div className="pb-12">
      <CommonHeader
        title="All Categories"
        btnText="Add new Category"
        href="/categories/add"
      />
    </div>
  );
};

export default page;
