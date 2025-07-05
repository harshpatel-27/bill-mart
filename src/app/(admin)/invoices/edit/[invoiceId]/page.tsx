import { InvoiceForm } from "@/components/forms/invoices/invoice-form";

const EditInvociePage = async ({ params }: { params: any }) => {
  const { invoiceId } = await params;
  return <InvoiceForm type="update" invoiceId={invoiceId} />;
};

export default EditInvociePage;
