"use client";

import { CustomLoader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { useDataStore } from "@/stores/data.store";
import { format } from "date-fns";
import { Models } from "node-appwrite";
import { useEffect, useState } from "react";
import generatePDF from "react-to-pdf";

const getTargetElement = () => document.getElementById("pdf-element");

export const InvoiceTemplate = ({ invoiceId }: { invoiceId: string }) => {
  const invoices = useDataStore((state) => state.invoices);
  const products = useDataStore((state) => state.products);

  const [singleInvoice, setSingleInvoice] = useState<
    Models.Document | undefined
  >(undefined);
  useEffect(() => {
    const tempInvoice = invoices.find(({ $id }) => $id == invoiceId);
    const parsedItems = tempInvoice?.items
      .map((item) => JSON.parse(item))
      .map((item) => ({
        ...item,
        product: products.find(({ $id }) => $id == item?.productId),
        quantity: parseInt(item?.quantity),
      }));

    const findInvoiceById: any = {
      ...tempInvoice,
      items: parsedItems,
    };
    setSingleInvoice(findInvoiceById);
  }, [invoices]);

  useEffect(() => {
    console.log({ singleInvoice });
  }, [singleInvoice]);

  if (singleInvoice == undefined || !singleInvoice?.$id)
    return <CustomLoader />;

  return (
    <div className="flex items-center flex-col justify-center gap-4">
      <Button
        onClick={() =>
          generatePDF(getTargetElement, {
            filename: `bill-mart-invoice-${singleInvoice.$id}`,
          })
        }
      >
        Download Pdf
      </Button>
      <div style={styles.container} id={"pdf-element"}>
        {/* Header */}
        <table style={styles.header}>
          <tbody style={{ width: "100%" }}>
            <tr
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <td>
                <img
                  src="/logo.png"
                  alt="Bill Mart"
                  style={{
                    height: 64,
                    width: 64,
                  }}
                />
                <h1 style={styles.companyName}>Bill Mart</h1>
                {/* <p style={styles.receiptText}>RECEIPT</p> */}
              </td>
              <td>
                Invoice #: {singleInvoice?.$id}
                <br />
                Created:{" "}
                {singleInvoice
                  ? format(singleInvoice?.$createdAt, "dd-MM-yyyy")
                  : null}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Customer Info */}
        <div style={styles.section}>
          <div style={styles.infoGrid}>
            <div>
              <p style={styles.infoLabel}>Customer Name:</p>
              <p style={styles.infoValue}>{singleInvoice?.customer?.name}</p>
            </div>
            <div>
              <p style={styles.infoLabel}>Customer Mobile:</p>
              <p style={styles.infoValue}>
                {singleInvoice?.customer?.phone || "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div style={styles.section}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <th style={styles.tableHeader}>Sno.</th>
                <th style={styles.tableHeader}>Item</th>
                <th style={styles.tableHeader}>Price</th>
                <th style={styles.tableHeader}>Qty</th>
                <th style={styles.tableHeader}>Total</th>
              </tr>
            </thead>
            <tbody>
              {singleInvoice.items.map((item, index) => (
                <tr
                  key={index}
                  style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
                >
                  <td style={{ ...styles.tableCell, textAlign: "center" }}>
                    {index + 1}
                  </td>
                  <td style={{ ...styles.tableCell, textAlign: "center" }}>
                    {item.product.name}
                  </td>
                  <td style={{ ...styles.tableCell, textAlign: "center" }}>
                    ₹{item.amount.toFixed(2)}
                  </td>
                  <td style={{ ...styles.tableCell, textAlign: "center" }}>
                    {item.quantity}
                  </td>
                  <td style={{ ...styles.tableCell, textAlign: "center" }}>
                    ₹{(item.amount * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div style={styles.totalSection}>
          <div style={styles.totalRow}>
            <p style={styles.totalLabel}>TOTAL:</p>
            <p style={styles.totalAmount}>₹{singleInvoice.total.toFixed(2)}</p>
          </div>
        </div>

        {/* Payment Method */}
        <div style={styles.totalSection}>
          <div style={styles.totalRow}>
            <p style={{}}>Payment Method:</p>
            <p style={{}}>{singleInvoice.paymentMethod}</p>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <p style={styles.footerText}>Thank you for shopping with us!</p>
          <p style={styles.footerText}>{new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "850px",
    margin: "0px auto",
    padding: "20px",
    backgroundColor: "#fff",
    boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#333",
  },
  header: {
    marginBottom: "10px",
    borderBottom: "2px solid #f0f0f0",
    paddingBottom: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  companyName: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#2c3e50",
    margin: "0",
  },
  receiptText: {
    fontSize: "16px",
    color: "#7f8c8d",
    margin: "5px 0 0",
    letterSpacing: "2px",
  },
  section: {
    marginBottom: "25px",
  },
  sectionTitle: {
    fontSize: "18px",
    color: "#2c3e50",
    borderBottom: "1px solid #eee",
    paddingBottom: "8px",
    marginBottom: "15px",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
  },
  infoLabel: {
    fontSize: "14px",
    color: "#7f8c8d",
    margin: "0 0 5px",
  },
  infoValue: {
    fontSize: "16px",
    fontWeight: "500",
    margin: "0",
  },
  paymentMethod: {
    fontSize: "16px",
    padding: "8px 12px",
    backgroundColor: "#f8f9fa",
    borderRadius: "5px",
    display: "inline-block",
  },
  table: {
    width: "100%",
    marginTop: "15px",
  },
  tableHeaderRow: {
    backgroundColor: "#2c3e50",
    color: "white",
  },
  tableHeader: {
    padding: "12px",
    fontSize: "14px",
  },
  tableRow: {
    borderBottom: "1px solid #eee",
    backgroundColor: "#fff",
  },
  tableRowAlt: {
    borderBottom: "1px solid #eee",
    backgroundColor: "#f8f9fa",
  },
  tableCell: {
    padding: "12px",
    fontSize: "14px",
  },
  totalSection: {
    marginTop: "10px",
    backgroundColor: "#f8f9fa",
    padding: "15px",
    borderRadius: "5px",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: "18px",
    fontWeight: "bold",
    margin: "0",
  },
  totalAmount: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#2c3e50",
    margin: "0",
  },
  footer: {
    marginTop: "30px",
    color: "#7f8c8d",
    fontSize: "14px",
    borderTop: "1px solid #eee",
    paddingTop: "20px",
  },
  footerText: {
    margin: "5px 0",
  },
};
