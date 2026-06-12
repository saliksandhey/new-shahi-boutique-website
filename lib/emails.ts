'use server'

import { Resend } from 'resend'
import { OrderConfirmationEmail } from '@/components/emails/OrderConfirmation'
import { ShippingNotificationEmail } from '@/components/emails/ShippingNotification'
import React from 'react'

// You would store RESEND_API_KEY in .env.local
const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key')

export async function sendOrderConfirmationEmail(userEmail: string, orderNumber: string, total: number, customerName: string) {
  try {
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'Boutique <orders@yourdomain.com>',
        to: userEmail,
        subject: `Order Confirmation - ${orderNumber}`,
        react: React.createElement(OrderConfirmationEmail, { orderNumber, total, customerName })
      })
    } else {
      console.log(`[DEV MODE] Skipping Resend for ${orderNumber}`)
    }
  } catch (error) {
    console.error('Failed to send email:', error)
  }
}

export async function sendShippingNotificationEmail(userEmail: string, orderNumber: string, customerName: string, trackingNumber: string, courierName: string, trackingUrl?: string) {
  try {
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'Boutique <orders@yourdomain.com>',
        to: userEmail,
        subject: `Your Order ${orderNumber} Has Shipped!`,
        react: React.createElement(ShippingNotificationEmail, { orderNumber, customerName, trackingNumber, courierName, trackingUrl })
      })
    } else {
      console.log(`[DEV MODE] Skipping Resend for Shipping ${orderNumber}`)
    }
  } catch (error) {
    console.error('Failed to send email:', error)
  }
}
