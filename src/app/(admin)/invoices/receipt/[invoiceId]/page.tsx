import { InvoiceTemplate } from "./invoice-template";

const page = async ({ params }: { params: any }) => {
  const { invoiceId } = params;
  return <InvoiceTemplate invoiceId={invoiceId} />;
};

export default page;
