import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import dbConnect from '@/lib/mongoose'
import Inquiry from '@/lib/models/Inquiry'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')

// GET - Get single inquiry
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const token = request.cookies.get('client_token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { payload } = await jwtVerify(token, JWT_SECRET)
    const clientId = payload.id as string

    await dbConnect()

    const inquiry = await Inquiry.findOne({ _id: id, clientId }).lean()

    if (!inquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 })
    }

    return NextResponse.json(inquiry)
  } catch (error: any) {
    console.error('Error fetching inquiry:', error)
    return NextResponse.json({ error: error.message || 'Failed to fetch inquiry' }, { status: 500 })
  }
}

// PUT - Update inquiry (client can only update notes and payment proof)
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    console.log('🔵 PUT REQUEST RECEIVED')
    const { id } = await params
    console.log('🔵 Inquiry ID:', id)
    
    const token = request.cookies.get('client_token')?.value

    if (!token) {
      console.log('🔴 No token found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { payload } = await jwtVerify(token, JWT_SECRET)
    const clientId = payload.id as string
    console.log('🔵 Client ID:', clientId)

    const body = await request.json()
    console.log('📥 RAW BODY:', JSON.stringify(body))
    console.log('📥 RAW BODY keys:', Object.keys(body))
    console.log('📥 RAW BODY values:', Object.values(body))
    
    const { notes, paymentScreenshot, paymentMethod, transactionId } = body

    console.log('📥 Destructured values:', { 
      notes, 
      paymentScreenshot, 
      paymentMethod, 
      transactionId,
      notesType: typeof notes,
      screenshotType: typeof paymentScreenshot,
      methodType: typeof paymentMethod,
      idType: typeof transactionId
    })

    await dbConnect()

    // Build update object
    const updateFields: any = {}
    
    if (notes !== undefined) {
      updateFields.notes = notes
    }
    if (paymentScreenshot !== undefined && paymentScreenshot !== null) {
      updateFields.paymentScreenshot = paymentScreenshot
      console.log('✓ Will update paymentScreenshot:', paymentScreenshot)
    }
    if (paymentMethod !== undefined && paymentMethod !== null) {
      updateFields.paymentMethod = paymentMethod
      console.log('✓ Will update paymentMethod:', paymentMethod)
    }
    if (transactionId !== undefined && transactionId !== null) {
      updateFields.transactionId = transactionId
      console.log('✓ Will update transactionId:', transactionId)
    }

    console.log('📝 Update fields:', updateFields)

    // Use findOneAndUpdate for atomic operation
    const updatedInquiry = await Inquiry.findOneAndUpdate(
      { _id: id, clientId },
      { $set: updateFields },
      { new: true, runValidators: true }
    ).lean()

    if (!updatedInquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 })
    }

    console.log('✅ Inquiry updated in database:', {
      _id: updatedInquiry._id,
      paymentScreenshot: updatedInquiry.paymentScreenshot,
      paymentMethod: updatedInquiry.paymentMethod,
      transactionId: updatedInquiry.transactionId
    })

    // Verify by fetching again
    const verifyInquiry = await Inquiry.findById(id).lean()
    console.log('🔍 Verification fetch from DB:', {
      _id: verifyInquiry?._id,
      paymentScreenshot: verifyInquiry?.paymentScreenshot,
      paymentMethod: verifyInquiry?.paymentMethod,
      transactionId: verifyInquiry?.transactionId
    })

    return NextResponse.json(updatedInquiry)
  } catch (error: any) {
    console.error('Error updating inquiry:', error)
    return NextResponse.json({ error: error.message || 'Failed to update inquiry' }, { status: 500 })
  }
}

// DELETE - Cancel inquiry
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const token = request.cookies.get('client_token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { payload } = await jwtVerify(token, JWT_SECRET)
    const clientId = payload.id as string

    await dbConnect()

    const inquiry = await Inquiry.findOne({ _id: id, clientId })

    if (!inquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 })
    }

    // Only allow cancellation if not completed or cancelled
    if (inquiry.status === 'completed' || inquiry.status === 'cancelled') {
      return NextResponse.json(
        { error: 'Cannot cancel completed or already cancelled inquiry' },
        { status: 400 }
      )
    }

    inquiry.status = 'cancelled'
    inquiry.statusHistory.push({
      status: 'cancelled',
      changedBy: 'Client',
      changedAt: new Date(),
      note: 'Cancelled by client',
    })

    await inquiry.save()

    return NextResponse.json({ message: 'Inquiry cancelled successfully' })
  } catch (error: any) {
    console.error('Error cancelling inquiry:', error)
    return NextResponse.json({ error: error.message || 'Failed to cancel inquiry' }, { status: 500 })
  }
}
