import { getStockTransactions } from "@/actions";
import StockReportTableWrapper from "@/components/tables/stock-report/stock-report-table-wrapper";

const StockReportPage = async () => {
  const data = (await getStockTransactions()).documents;
  return <StockReportTableWrapper data={data} />;
};

export default StockReportPage;
