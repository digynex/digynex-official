import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { brandingStore } from '../services/brandingService'

/**
 * Generates a professional PDF for Work Orders or Invoices
 * @param {Object} data - The record data (WO or Invoice)
 * @param {'WO' | 'Invoice'} type - Type of document
 */
export const generatePDF = (data, type = 'WO') => {
  const doc = new jsPDF()
  const primaryColor = brandingStore.primaryColor || '#6366f1'
  
  // Convert HEX to RGB
  const r = parseInt(primaryColor.slice(1, 3), 16)
  const g = parseInt(primaryColor.slice(3, 5), 16)
  const b = parseInt(primaryColor.slice(5, 7), 16)

  // 1. Header (Branding)
  doc.setFillColor(r, g, b)
  doc.rect(0, 0, 210, 40, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text(brandingStore.companyName.toUpperCase(), 15, 25)
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(brandingStore.website, 15, 33)

  // 2. Document Identifier
  doc.setTextColor(51, 65, 85)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text(type === 'WO' ? 'WORK ORDER MANIFEST' : 'COMMERCIAL INVOICE', 15, 55)
  
  doc.setFontSize(10)
  doc.setTextColor(100, 116, 139)
  doc.text(`DATE: ${new Date().toLocaleDateString()}`, 15, 62)
  doc.text(`REF ID: ${data.id?.slice(0, 8).toUpperCase() || 'PROD-AUTO'}`, 15, 67)

  // 3. Entity Details (Two Columns)
  // Left: From
  doc.setTextColor(51, 65, 85)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('ISSUED BY:', 15, 80)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text([
    brandingStore.companyName,
    brandingStore.address,
    `Email: ${brandingStore.contactEmail}`,
    `Tax ID: ${brandingStore.taxId}`
  ], 15, 85, { lineHeightFactor: 1.5 })

  // Right: To / Assignment
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text(type === 'WO' ? 'ASSIGNED TO:' : 'BILL TO:', 120, 80)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  
  const recipientData = type === 'WO' 
    ? [
        `Supervisor: ${data.assigned_supervisor || 'N/A'}`,
        `Subcontractor: ${data.assigned_subcontractor || 'N/A'}`,
        `Project Ref: ${data.po_id?.po_number || 'N/A'}`
      ]
    : [
        `Client: ${data.client_name || 'N/A'}`,
        `PO Reference: ${data.wo_id?.po_id?.po_number || 'N/A'}`
      ]
  
  doc.text(recipientData, 120, 85, { lineHeightFactor: 1.5 })

  // 4. Data Table
  const tableHeaders = type === 'WO' 
    ? [['TASK DESCRIPTION', 'ALLOCATION', 'DEADLINE', 'STATE']]
    : [['DESCRIPTION', 'RATE', 'QTY', 'TOTAL AMOUNT']]

  const tableBody = type === 'WO'
    ? [[
        data.name || 'System Execution',
        `${brandingStore.currency} ${Number(data.budget_allocation || 0).toLocaleString()}`,
        data.deadline || 'ASAP',
        data.status?.toUpperCase() || 'PENDING'
      ]]
    : [[
        `Service Charge for ${data.wo_id?.name || 'Workflow Execution'}`,
        `${brandingStore.currency} ${Number(data.amount || 0).toLocaleString()}`,
        '1',
        `${brandingStore.currency} ${Number(data.amount || 0).toLocaleString()}`
      ]]

  autoTable(doc, {
    startY: 110,
    head: tableHeaders,
    body: tableBody,
    theme: 'grid',
    headStyles: { fillColor: [r, g, b], fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 5 }
  })

  // 5. Summary & Footer
  const finalY = doc.lastAutoTable.finalY + 20
  doc.setFont('helvetica', 'bold')
  doc.text(`TOTAL VALUE: ${brandingStore.currency} ${Number(type === 'WO' ? data.budget_allocation : data.amount).toLocaleString()}`, 15, finalY)

  doc.setFontSize(8)
  doc.setTextColor(148, 163, 184)
  doc.setFont('helvetica', 'italic')
  const footerNote = type === 'WO' 
    ? 'This is a system-generated production order. Please adhere to the security protocols defined in the DigyNex 360 Ecosystem.'
    : 'Thank you for choosing DigyNex. Please make the payment within the grace period defined in your service agreement.'
  
  doc.text(footerNote, 105, 280, { align: 'center' })

  // 6. Save/Download
  const fileName = type === 'WO' ? `WorkOrder_${data.id?.slice(0, 5)}.pdf` : `Invoice_${data.id?.slice(0, 5)}.pdf`
  doc.save(fileName)
}
