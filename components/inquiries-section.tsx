"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { fetchWithAuth } from "@/lib/client-auth"
import { Loader2, FileText, Clock, CheckCircle, XCircle, DollarSign, Eye, Download, RefreshCw } from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { format } from "date-fns"
import jsPDF from "jspdf"

interface Inquiry {
  _id: string
  serviceName: string
  packageName?: string
  packagePrice?: string
  message: string
  status: string
  paymentStatus: string
  invoiceNumber: string
  totalAmount: string
  paymentScreenshot?: string
  paymentMethod?: 'bkash' | 'nagad' | 'bank' | 'other'
  transactionId?: string
  createdAt: string
  updatedAt: string
  statusHistory?: Array<{
    status: string
    changedBy: string
    changedAt: string
    note?: string
  }>
  adminNotes?: string
  notes?: string
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
  approved: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  paid: "bg-green-500/10 text-green-500 border-green-500/30",
  "in-progress": "bg-purple-500/10 text-purple-500 border-purple-500/30",
  completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/30",
}

const statusIcons: Record<string, any> = {
  pending: Clock,
  approved: CheckCircle,
  paid: DollarSign,
  "in-progress": Loader2,
  completed: CheckCircle,
  cancelled: XCircle,
}

export function InquiriesSection() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [uploading, setUploading] = useState(false)
  const [viewingImage, setViewingImage] = useState<string | null>(null)

  useEffect(() => {
    loadInquiries()
  }, [])

  const loadInquiries = async () => {
    try {
      const response = await fetchWithAuth('/api/inquiries')
      if (response.ok) {
        const data = await response.json()
        console.log('Loaded inquiries from API:', data.length, 'inquiries')
        // Log inquiries with payment screenshots
        data.forEach((inq: Inquiry) => {
          if (inq.paymentScreenshot) {
            console.log(`✓ Inquiry ${inq.invoiceNumber} HAS payment screenshot:`, inq.paymentScreenshot)
          } else {
            console.log(`✗ Inquiry ${inq.invoiceNumber} NO payment screenshot`)
          }
        })
        setInquiries(data)
      }
    } catch (error) {
      console.error('Error loading inquiries:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentUpload = async (inquiryId: string, file: File, paymentMethod: string, transactionId: string) => {
    if (!file) return

    // Validate file
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB")
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      // Upload to Cloudinary
      console.log('Uploading file to Cloudinary...')
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const uploadData = await uploadResponse.json()
      console.log('Cloudinary upload response:', uploadData)
      console.log('Upload response status:', uploadResponse.status)
      console.log('Upload response ok:', uploadResponse.ok)
      
      if (!uploadResponse.ok) {
        console.error('Upload failed with status:', uploadResponse.status)
        throw new Error(uploadData.error || "Upload failed")
      }

      // Check both url and data array for the URL
      const imageUrl = uploadData.url || (uploadData.data && uploadData.data[0])
      console.log('Extracted image URL:', imageUrl)
      console.log('Image URL type:', typeof imageUrl)
      console.log('Image URL length:', imageUrl?.length)

      if (!imageUrl || typeof imageUrl !== 'string') {
        console.error('Invalid URL. Full response:', uploadData)
        throw new Error("No valid URL received from upload")
      }

      // Validate payment method and transaction ID
      if (!paymentMethod || paymentMethod.trim() === '') {
        throw new Error("Payment method is required")
      }
      if (!transactionId || transactionId.trim() === '') {
        throw new Error("Transaction ID is required")
      }

      // Update inquiry with payment screenshot
      const updatePayload = {
        paymentScreenshot: imageUrl.trim(),
        paymentMethod: paymentMethod.trim(),
        transactionId: transactionId.trim(),
      }
      console.log('✓ Sending update to API with payload:', updatePayload)
      console.log('✓ Payload JSON:', JSON.stringify(updatePayload))

      const updateResponse = await fetchWithAuth(`/api/inquiries/${inquiryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload),
      })

      console.log('Update response status:', updateResponse.status)
      console.log('Update response ok:', updateResponse.ok)

      if (updateResponse.ok) {
        const updatedInquiry = await updateResponse.json()
        console.log('✓ Updated inquiry from API:', updatedInquiry)
        console.log('✓ Payment screenshot in response:', updatedInquiry.paymentScreenshot)
        console.log('✓ Payment method in response:', updatedInquiry.paymentMethod)
        console.log('✓ Transaction ID in response:', updatedInquiry.transactionId)
        
        // Update the inquiry in state immediately
        setInquiries(prev => {
          const updated = prev.map(inq => 
            inq._id === inquiryId ? updatedInquiry : inq
          )
          console.log('✓ Updated inquiries state. Finding inquiry:', inquiryId)
          const found = updated.find(inq => inq._id === inquiryId)
          console.log('✓ Found inquiry after update:', {
            hasScreenshot: !!found?.paymentScreenshot,
            screenshotUrl: found?.paymentScreenshot
          })
          return updated
        })
        
        alert("✓ Payment screenshot uploaded successfully! Close and reopen the dialog to see it.")
        
        // Also reload to ensure sync
        await loadInquiries()
      } else {
        const errorData = await updateResponse.json().catch(() => ({ error: 'Unknown error' }))
        console.error('Update failed with status:', updateResponse.status)
        console.error('Error data:', errorData)
        throw new Error(errorData.error || "Failed to update inquiry")
      }
    } catch (error: any) {
      console.error("Error uploading payment:", error)
      alert(error.message || "Failed to upload payment screenshot")
    } finally {
      setUploading(false)
    }
  }

  const downloadInvoice = (inquiry: Inquiry) => {
    const doc = new jsPDF()
    
    // Set colors
    const primaryColor: [number, number, number] = [14, 165, 233] // Sky-500
    const darkColor: [number, number, number] = [0, 0, 0]
    const grayColor: [number, number, number] = [107, 114, 128]
    
    let yPos = 20
    
    // Header - Company Name
    doc.setFontSize(24)
    doc.setTextColor(...primaryColor)
    doc.text('MEDIAMIND', 105, yPos, { align: 'center' })
    
    yPos += 10
    doc.setFontSize(16)
    doc.text('INVOICE', 105, yPos, { align: 'center' })
    
    // Line separator
    yPos += 5
    doc.setDrawColor(...primaryColor)
    doc.setLineWidth(0.5)
    doc.line(20, yPos, 190, yPos)
    
    // Invoice Info
    yPos += 10
    doc.setFontSize(10)
    doc.setTextColor(...darkColor)
    doc.text(`Invoice Number: ${inquiry.invoiceNumber}`, 20, yPos)
    doc.text(`Date: ${format(new Date(inquiry.createdAt), 'PP')}`, 140, yPos)
    
    yPos += 6
    doc.text(`Status: ${inquiry.status.toUpperCase()}`, 20, yPos)
    doc.text(`Payment: ${inquiry.paymentStatus.toUpperCase()}`, 140, yPos)
    
    // Service Details Section
    yPos += 12
    doc.setFillColor(...primaryColor)
    doc.rect(20, yPos - 5, 170, 7, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.text('SERVICE DETAILS', 22, yPos)
    
    yPos += 8
    doc.setTextColor(...darkColor)
    doc.setFontSize(10)
    doc.text(`Service: ${inquiry.serviceName}`, 22, yPos)
    
    if (inquiry.packageName) {
      yPos += 6
      doc.text(`Package: ${inquiry.packageName}`, 22, yPos)
    }
    
    if (inquiry.packagePrice) {
      yPos += 6
      doc.text(`Package Price: ${inquiry.packagePrice}`, 22, yPos)
    }
    
    // Project Details Section
    yPos += 12
    doc.setFillColor(...primaryColor)
    doc.rect(20, yPos - 5, 170, 7, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.text('PROJECT DETAILS', 22, yPos)
    
    yPos += 8
    doc.setTextColor(...darkColor)
    doc.setFontSize(10)
    const messageLines = doc.splitTextToSize(inquiry.message, 166)
    doc.text(messageLines, 22, yPos)
    yPos += messageLines.length * 5
    
    // Amount Section
    yPos += 10
    doc.setFillColor(...primaryColor)
    doc.rect(20, yPos - 5, 170, 7, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.text('AMOUNT', 22, yPos)
    
    yPos += 8
    doc.setTextColor(...darkColor)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(`Total Amount: ${inquiry.totalAmount}`, 22, yPos)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    yPos += 6
    doc.text(`Payment Status: ${inquiry.paymentStatus.toUpperCase()}`, 22, yPos)
    
    // Admin Notes if present
    if (inquiry.adminNotes && yPos < 250) {
      yPos += 12
      doc.setFillColor(...primaryColor)
      doc.rect(20, yPos - 5, 170, 7, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(12)
      doc.text('ADMIN NOTES', 22, yPos)
      
      yPos += 8
      doc.setTextColor(...darkColor)
      doc.setFontSize(10)
      const notesLines = doc.splitTextToSize(inquiry.adminNotes, 166)
      doc.text(notesLines, 22, yPos)
      yPos += notesLines.length * 5
    }
    
    // Status History
    if (inquiry.statusHistory && inquiry.statusHistory.length > 0 && yPos < 230) {
      yPos += 12
      doc.setFillColor(...primaryColor)
      doc.rect(20, yPos - 5, 170, 7, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(12)
      doc.text('STATUS HISTORY', 22, yPos)
      
      yPos += 8
      doc.setTextColor(...darkColor)
      doc.setFontSize(9)
      
      inquiry.statusHistory.forEach((history) => {
        if (yPos > 270) return // Avoid overflow
        doc.text(`${format(new Date(history.changedAt), 'PP p')} - ${history.status.toUpperCase()}`, 22, yPos)
        yPos += 5
        doc.setTextColor(...grayColor)
        doc.text(`By: ${history.changedBy}`, 27, yPos)
        if (history.note) {
          yPos += 5
          doc.text(`Note: ${history.note}`, 27, yPos)
        }
        yPos += 6
        doc.setTextColor(...darkColor)
      })
    }
    
    // Footer
    doc.setDrawColor(...primaryColor)
    doc.line(20, 280, 190, 280)
    doc.setFontSize(9)
    doc.setTextColor(...grayColor)
    doc.text('Thank you for choosing MediaMind!', 105, 286, { align: 'center' })
    doc.text('Visit us at: www.mediamind.com | WhatsApp: +880 1401-658685', 105, 291, { align: 'center' })
    
    // Save the PDF
    doc.save(`${inquiry.invoiceNumber}.pdf`)
  }

  const InquiryDetailDialog = ({ inquiry: initialInquiry }: { inquiry: Inquiry }) => {
    // Get current inquiry from state to ensure we show latest data
    const inquiry = inquiries.find(inq => inq._id === initialInquiry._id) || initialInquiry
    const StatusIcon = statusIcons[inquiry.status] || Clock
    const [refreshing, setRefreshing] = useState(false)

    // Debug logging
    useEffect(() => {
      console.log('=== DIALOG INQUIRY DEBUG ===')
      console.log('Initial inquiry ID:', initialInquiry._id)
      console.log('Initial inquiry has screenshot:', !!initialInquiry.paymentScreenshot)
      console.log('Current inquiries in state:', inquiries.length)
      console.log('Found inquiry in state:', !!inquiries.find(inq => inq._id === initialInquiry._id))
      
      const foundInquiry = inquiries.find(inq => inq._id === initialInquiry._id)
      if (foundInquiry) {
        console.log('Found inquiry details:', {
          id: foundInquiry._id,
          hasScreenshot: !!foundInquiry.paymentScreenshot,
          screenshotUrl: foundInquiry.paymentScreenshot,
          paymentMethod: foundInquiry.paymentMethod,
          transactionId: foundInquiry.transactionId
        })
      }
      
      console.log('Dialog showing inquiry:', {
        id: inquiry._id,
        hasScreenshot: !!inquiry.paymentScreenshot,
        screenshotUrl: inquiry.paymentScreenshot,
        paymentMethod: inquiry.paymentMethod,
        transactionId: inquiry.transactionId
      })
      console.log('=========================')
    }, [inquiry, inquiries, initialInquiry])

    const handleRefresh = async () => {
      setRefreshing(true)
      await loadInquiries()
      setRefreshing(false)
    }

    return (
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0F1113] border-[#1F2329]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-3 text-[#F4F7F5]">
                <FileText className="h-6 w-6 text-[#008CE2]" />
                Invoice Details
              </DialogTitle>
              <DialogDescription className="text-[#F4F7F5]/70">
                Complete information about your service inquiry and invoice
              </DialogDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="border-[#1F2329] bg-[#0F1113] text-[#F4F7F5] hover:bg-[#1A1D21] hover:border-[#008CE2]"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invoice Header */}
          <div className="p-6 rounded-lg bg-gradient-to-br from-[#008CE2]/10 to-[#06B9D0]/10 border border-[#008CE2]/30">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-[#F4F7F5]/70">Invoice Number</p>
                <p className="text-2xl font-bold text-[#F4F7F5]">{inquiry.invoiceNumber}</p>
              </div>
              <Badge className={statusColors[inquiry.status]}>
                <StatusIcon className={`h-3 w-3 mr-1 ${inquiry.status === 'in-progress' ? 'animate-spin' : ''}`} />
                {inquiry.status.toUpperCase().replace('-', ' ')}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[#F4F7F5]/70">Created Date</p>
                <p className="font-semibold text-[#F4F7F5]">
                  {format(new Date(inquiry.createdAt), 'PPP')}
                </p>
              </div>
              <div>
                <p className="text-[#F4F7F5]/70">Last Updated</p>
                <p className="font-semibold text-[#F4F7F5]">
                  {format(new Date(inquiry.updatedAt), 'PPP')}
                </p>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div>
            <h3 className="font-semibold text-[#F4F7F5] mb-3">Service Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#F4F7F5]/70">Service:</span>
                <span className="font-semibold text-[#F4F7F5]">{inquiry.serviceName}</span>
              </div>
              {inquiry.packageName && (
                <div className="flex justify-between">
                  <span className="text-[#F4F7F5]/70">Package:</span>
                  <span className="font-semibold text-[#F4F7F5]">{inquiry.packageName}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[#F4F7F5]/70">Total Amount:</span>
                <span className="font-bold text-[#008CE2] text-lg">{inquiry.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#F4F7F5]/70">Payment Status:</span>
                <Badge variant={inquiry.paymentStatus === 'paid' ? 'default' : 'secondary'} className={inquiry.paymentStatus === 'paid' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-[#F4F7F5]/10 text-[#F4F7F5]/70 border border-[#F4F7F5]/20'}>
                  {inquiry.paymentStatus.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div>
            <h3 className="font-semibold text-[#F4F7F5] mb-3">Your Message</h3>
            <p className="text-sm text-[#F4F7F5]/80 p-4 rounded-lg bg-[#1A1D21] border border-[#1F2329]">
              {inquiry.message}
            </p>
          </div>

          {/* Admin Notes */}
          {inquiry.adminNotes && (
            <div>
              <h3 className="font-semibold text-[#F4F7F5] mb-3">Admin Notes</h3>
              <p className="text-sm text-[#F4F7F5]/80 p-4 rounded-lg bg-[#008CE2]/10 border border-[#008CE2]/30">
                {inquiry.adminNotes}
              </p>
            </div>
          )}

          {/* Payment Information */}
          <div className="p-6 rounded-lg bg-[#1A1D21] border border-[#1F2329]">
            <h3 className="font-semibold text-[#F4F7F5] mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-[#008CE2]" />
              Payment Information
            </h3>
            
            {/* Payment Numbers */}
            <div className="mb-4 p-4 rounded-lg bg-[#0F1113] border border-[#1F2329]">
              <p className="text-sm text-[#F4F7F5]/70 mb-3">Send payment to:</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between p-2 bg-[#008CE2]/10 rounded border border-[#008CE2]/30">
                  <span className="font-semibold text-[#F4F7F5]">bKash</span>
                  <span className="text-[#008CE2] font-mono">+880 1401-658685</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-[#06B9D0]/10 rounded border border-[#06B9D0]/30">
                  <span className="font-semibold text-[#F4F7F5]">Nagad</span>
                  <span className="text-[#06B9D0] font-mono">+880 1401-658685</span>
                </div>
              </div>
            </div>

            {/* Upload Section */}
            {(() => {
              console.log('Payment section check:', {
                hasScreenshot: !!inquiry.paymentScreenshot,
                screenshotUrl: inquiry.paymentScreenshot
              })
              return !inquiry.paymentScreenshot
            })() ? (
              <div className="space-y-3">
                <label className="block">
                  <span className="text-sm text-[#F4F7F5]/70 mb-2 block">Payment Method:</span>
                  <select
                    id={`payment-method-${inquiry._id}`}
                    className="w-full p-2 rounded bg-[#0F1113] border border-[#1F2329] text-[#F4F7F5] text-sm"
                    defaultValue="bkash"
                  >
                    <option value="bkash">bKash</option>
                    <option value="nagad">Nagad</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="other">Other</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm text-[#F4F7F5]/70 mb-2 block">Transaction ID:</span>
                  <input
                    type="text"
                    id={`transaction-id-${inquiry._id}`}
                    placeholder="Enter transaction ID"
                    className="w-full p-2 rounded bg-[#0F1113] border border-[#1F2329] text-[#F4F7F5] text-sm placeholder:text-[#F4F7F5]/50"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-[#F4F7F5]/70 mb-2 block">Upload Payment Screenshot:</span>
                  <input
                    type="file"
                    accept="image/*"
                    id={`payment-upload-${inquiry._id}`}
                    className="w-full p-2 rounded bg-[#0F1113] border border-[#1F2329] text-[#F4F7F5] text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#008CE2] file:text-white file:cursor-pointer hover:file:bg-[#06B9D0]"
                    disabled={uploading}
                  />
                  <p className="text-xs text-[#F4F7F5]/50 mt-1">Max size: 5MB (JPG, PNG)</p>
                </label>

                <button
                  onClick={() => {
                    const fileInput = document.getElementById(`payment-upload-${inquiry._id}`) as HTMLInputElement
                    const methodSelect = document.getElementById(`payment-method-${inquiry._id}`) as HTMLSelectElement
                    const transactionInput = document.getElementById(`transaction-id-${inquiry._id}`) as HTMLInputElement
                    
                    if (fileInput?.files?.[0] && transactionInput.value) {
                      handlePaymentUpload(inquiry._id, fileInput.files[0], methodSelect.value, transactionInput.value)
                    } else {
                      alert("Please select an image and enter transaction ID")
                    }
                  }}
                  disabled={uploading}
                  className="w-full py-2 px-4 bg-[#008CE2] hover:bg-[#06B9D0] text-white rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {uploading ? 'Uploading...' : 'Upload Payment Proof'}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 rounded bg-green-500/10 border border-green-500/30">
                  <p className="text-sm text-green-400 font-semibold mb-2">✓ Payment screenshot uploaded</p>
                  <div className="text-xs text-[#F4F7F5]/70 space-y-1">
                    <p>Method: <span className="text-[#F4F7F5] font-semibold uppercase">{inquiry.paymentMethod}</span></p>
                    <p>Transaction ID: <span className="text-[#F4F7F5] font-mono">{inquiry.transactionId}</span></p>
                    {inquiry.paymentScreenshot && (
                      <p className="break-all">URL: <span className="text-[#008CE2] text-[10px]">{inquiry.paymentScreenshot}</span></p>
                    )}
                  </div>
                </div>
                
                {/* Thumbnail Preview */}
                <div className="relative aspect-video bg-black/50 rounded-lg overflow-hidden border border-[#1F2329]">
                  <img 
                    src={inquiry.paymentScreenshot} 
                    alt="Payment Screenshot Preview" 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      console.error('Failed to load image:', inquiry.paymentScreenshot)
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage Error%3C/text%3E%3C/svg%3E'
                    }}
                  />
                </div>

                <button
                  onClick={() => setViewingImage(inquiry.paymentScreenshot!)}
                  className="w-full py-2 px-4 bg-[#0F1113] hover:bg-[#1A1D21] border border-[#1F2329] hover:border-[#008CE2] text-[#F4F7F5] rounded font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  View Full Size Screenshot
                </button>
              </div>
            )}
          </div>

          {/* Status History */}
          {inquiry.statusHistory && inquiry.statusHistory.length > 0 && (
            <div>
              <h3 className="font-semibold text-[#F4F7F5] mb-3">Status History</h3>
              <div className="space-y-3">
                {inquiry.statusHistory.map((history, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm">
                    <div className="h-8 w-8 rounded-full bg-[#008CE2]/20 flex items-center justify-center flex-shrink-0 border border-[#008CE2]/30">
                      <CheckCircle className="h-4 w-4 text-[#008CE2]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-[#F4F7F5]">
                          {history.status.toUpperCase().replace('-', ' ')}
                        </p>
                        <p className="text-xs text-[#F4F7F5]/50">
                          {format(new Date(history.changedAt), 'PPp')}
                        </p>
                      </div>
                      <p className="text-xs text-[#F4F7F5]/70">by {history.changedBy}</p>
                      {history.note && <p className="text-xs text-[#F4F7F5]/70 mt-1">{history.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Download Button */}
          <div className="pt-4 border-t border-[#1F2329]">
            <Button 
              onClick={() => downloadInvoice(inquiry)}
              className="w-full bg-[#008CE2] hover:bg-[#06B9D0] text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Invoice (PDF)
            </Button>
          </div>
        </div>
      </DialogContent>
    )
  }

  if (loading) {
    return (
      <Card className="border-[#1F2329] bg-[#0F1113]/80 backdrop-blur-xl shadow-lg shadow-[#008CE2]/20">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#008CE2]" />
        </CardContent>
      </Card>
    )
  }

  if (inquiries.length === 0) {
    return (
      <Card className="border-[#1F2329] bg-[#0F1113]/80 backdrop-blur-xl shadow-lg shadow-[#008CE2]/20">
        <CardHeader>
          <CardTitle className="text-[#F4F7F5]">Your Inquiries & Invoices</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <FileText className="h-12 w-12 text-[#F4F7F5]/30 mx-auto mb-4" />
          <p className="text-[#F4F7F5]/70 mb-4">No inquiries yet</p>
          <Button asChild className="bg-[#008CE2] text-white hover:bg-[#06B9D0] hover:scale-105 transition-all duration-300">
            <Link href="/services">Browse Services</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="border-[#1F2329] bg-[#0F1113]/80 backdrop-blur-xl shadow-lg shadow-[#008CE2]/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-[#F4F7F5]">
            <span>Your Inquiries & Invoices</span>
            <Badge variant="secondary" className="bg-[#008CE2]/20 text-[#008CE2] border border-[#008CE2]/30">{inquiries.length} Total</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inquiries.map((inquiry) => {
              const StatusIcon = statusIcons[inquiry.status] || Clock
              
              return (
                <div
                  key={inquiry._id}
                  className="p-4 rounded-lg border border-[#1F2329] hover:border-[#008CE2] transition-all duration-300 bg-[#1A1D21] hover:shadow-md hover:shadow-[#008CE2]/20"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-[#F4F7F5]">{inquiry.serviceName}</h3>
                        <Badge className={statusColors[inquiry.status]}>
                          <StatusIcon className={`h-3 w-3 mr-1 ${inquiry.status === 'in-progress' ? 'animate-spin' : ''}`} />
                          {inquiry.status.toUpperCase().replace('-', ' ')}
                        </Badge>
                      </div>
                      {inquiry.packageName && (
                        <p className="text-sm text-[#F4F7F5]/70">{inquiry.packageName}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#008CE2]">{inquiry.totalAmount}</p>
                      <Badge variant={inquiry.paymentStatus === 'paid' ? 'default' : 'secondary'} className={inquiry.paymentStatus === 'paid' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-[#F4F7F5]/10 text-[#F4F7F5]/70 border border-[#F4F7F5]/20'}>
                        {inquiry.paymentStatus}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="space-y-1">
                      <p className="text-[#F4F7F5]/70">
                        Invoice: <span className="font-mono font-semibold text-[#F4F7F5]">{inquiry.invoiceNumber}</span>
                      </p>
                      <p className="text-xs text-[#F4F7F5]/50">
                        {format(new Date(inquiry.createdAt), 'PPP')}
                      </p>
                    </div>
                    
                  <Dialog key={`dialog-${inquiry._id}-${inquiry.updatedAt || inquiry.paymentScreenshot || 'initial'}`}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="border-[#1F2329] bg-[#0F1113] text-[#F4F7F5] hover:bg-[#1A1D21] hover:border-[#008CE2]">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <InquiryDetailDialog inquiry={inquiry} />
                  </Dialog>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Image Viewing Dialog */}
      <Dialog open={!!viewingImage} onOpenChange={() => setViewingImage(null)}>
        <DialogContent className="max-w-4xl bg-[#0F1113] border-[#1F2329]">
          <DialogHeader>
            <DialogTitle className="text-[#F4F7F5]">Payment Screenshot</DialogTitle>
            <DialogDescription className="text-[#F4F7F5]/70">
              View uploaded payment proof
            </DialogDescription>
          </DialogHeader>
          <div className="relative aspect-video bg-black/50 rounded-lg overflow-hidden">
            {viewingImage && (
              <img 
                src={viewingImage} 
                alt="Payment Screenshot" 
                className="w-full h-full object-contain"
              />
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              onClick={() => window.open(viewingImage!, '_blank')}
              className="bg-[#008CE2] hover:bg-[#06B9D0] text-white"
            >
              Open in New Tab
            </Button>
            <Button
              variant="outline"
              onClick={() => setViewingImage(null)}
              className="border-[#1F2329] bg-[#0F1113] text-[#F4F7F5] hover:bg-[#1A1D21]"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
