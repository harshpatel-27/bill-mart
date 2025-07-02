import { getInvoices } from "@/actions";
import { CommonHeader } from "@/components/common-header";
import InvoicesTableWrapper from "@/components/tables/invoices/invoices-table-wrapper";

const page = async () => {
  const invoices = await getInvoices();
  return (
    <div className="pb-12">
      <CommonHeader
        title="All Invoices"
        btnText="Add new Customer"
        href="/invoices/add"
      />
      <InvoicesTableWrapper data={invoices} />
    </div>
  );
};

export default page;
