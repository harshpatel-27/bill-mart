import { getCustomers } from "@/actions";
import { CommonHeader } from "@/components/common-header";
import CustomersTableWrapper from "@/components/tables/customers/customers-table-wrapper";

const page = async () => {
  const customers = await getCustomers();
  return (
    <div className="pb-12">
      <CommonHeader
        title="All Customers"
        btnText="Add new Customer"
        href="/customers/add"
      />
      <CustomersTableWrapper data={customers} />
    </div>
  );
};

export default page;
