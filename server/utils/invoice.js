import PDFDocument from 'pdfkit';

export const generateInvoicePDF = (order, buyer) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        const buffers = [];

        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', reject);

        // Header
        doc.fontSize(24).font('Helvetica-Bold').text('ARLAN TOPH FORTH', { align: 'center' });
        doc.fontSize(10).font('Helvetica').text('Premium Wholesale Fashion', { align: 'center' });
        doc.moveDown();

        // Invoice details
        doc.fontSize(16).font('Helvetica-Bold').text('INVOICE', { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(10).font('Helvetica');
        doc.text(`Invoice No: ${order.invoiceNumber}`);
        doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`);
        doc.text(`Status: ${order.status}`);
        doc.moveDown();

        // Buyer details
        doc.fontSize(12).font('Helvetica-Bold').text('Bill To:');
        doc.fontSize(10).font('Helvetica');
        doc.text(buyer.name);
        if (buyer.company) doc.text(buyer.company);
        doc.text(buyer.email);
        if (buyer.phone) doc.text(buyer.phone);
        if (buyer.gstin) doc.text(`GSTIN: ${buyer.gstin}`);
        doc.moveDown();

        // Shipping address
        doc.fontSize(12).font('Helvetica-Bold').text('Ship To:');
        doc.fontSize(10).font('Helvetica');
        const addr = order.shippingAddress;
        doc.text(`${addr.street}, ${addr.city}`);
        doc.text(`${addr.state} - ${addr.pincode}, ${addr.country}`);
        doc.moveDown();

        // Items table header
        doc.fontSize(10).font('Helvetica-Bold');
        const tableTop = doc.y;
        doc.text('Item', 50, tableTop, { width: 200 });
        doc.text('Size', 250, tableTop, { width: 50 });
        doc.text('Qty', 310, tableTop, { width: 50 });
        doc.text('Price', 370, tableTop, { width: 80 });
        doc.text('Total', 460, tableTop, { width: 80 });
        doc.moveTo(50, tableTop + 15).lineTo(540, tableTop + 15).stroke();

        // Items
        let y = tableTop + 25;
        doc.font('Helvetica');
        for (const item of order.items) {
            doc.text(item.name, 50, y, { width: 200 });
            doc.text(item.size || '-', 250, y, { width: 50 });
            doc.text(item.quantity.toString(), 310, y, { width: 50 });
            doc.text(`₹${item.price}`, 370, y, { width: 80 });
            doc.text(`₹${(item.price * item.quantity).toLocaleString('en-IN')}`, 460, y, { width: 80 });
            y += 20;
        }

        doc.moveTo(50, y).lineTo(540, y).stroke();
        y += 10;

        // Total
        doc.fontSize(12).font('Helvetica-Bold');
        doc.text(`Total Amount: ₹${order.totalAmount.toLocaleString('en-IN')}`, 350, y, { width: 200, align: 'right' });

        doc.moveDown(3);
        doc.fontSize(8).font('Helvetica').text('This is a computer-generated invoice. Thank you for your business!', { align: 'center' });

        doc.end();
    });
};
