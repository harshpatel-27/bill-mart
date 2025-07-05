import { CommonHeader } from "@/components/common-header";
import InvoicesTableWrapper from "@/components/tables/invoices/invoices-table-wrapper";

const page = async () => {
  return (
    <div className="pb-12">
      <CommonHeader
        title="All Invoices"
        btnText="Generate Invoice"
        href="/invoices/add"
      />
      <InvoicesTableWrapper />
    </div>
  );
};

export default page;
