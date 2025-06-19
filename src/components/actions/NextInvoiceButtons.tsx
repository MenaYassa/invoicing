// File: components/actions/NextInvoiceButtons.tsx

export default function NextInvoiceButtons() {
  return (
    <div className="flex items-center gap-2 flex-wrap">
        <button id="createNextInvoiceButton" className="px-6 py-2 ...">Create Next Month&apos;s Invoice</button>
        <button id="createAcceptedInvoiceButton" className="px-6 py-2 ...">Create Accepted Version</button>
        <button id="createNatInvoiceButton" className="px-6 py-2 ...">Create Presented to NAT</button>
    </div>
  );
}