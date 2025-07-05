import { CustomerForm } from "@/components/forms/customers/customer-form";

const EditCustomerPage = async ({ params }: { params: any }) => {
  const { customerId } = await params;
  return <CustomerForm type="update" customerId={customerId} />;
};

export default EditCustomerPage;
