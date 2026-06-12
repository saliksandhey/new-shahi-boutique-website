import { Html, Body, Head, Heading, Container, Preview, Section, Text, Button } from '@react-email/components'
import * as React from 'react'

interface ShippingNotificationProps {
  orderNumber: string
  customerName: string
  trackingNumber: string
  courierName: string
  trackingUrl?: string
}

export const ShippingNotificationEmail: React.FC<Readonly<ShippingNotificationProps>> = ({
  orderNumber,
  customerName,
  trackingNumber,
  courierName,
  trackingUrl
}) => (
  <Html>
    <Head />
    <Preview>Your Order Has Shipped!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>BOUTIQUE</Heading>
        </Section>
        
        <Section style={bodySection}>
          <Text style={greeting}>Hello {customerName},</Text>
          <Text style={text}>
            Great news! Your order <strong>{orderNumber}</strong> has been shipped and is on its way to you.
          </Text>
          
          <div style={summaryBox}>
            <Text style={summaryTitle}>Tracking Information</Text>
            <Text style={summaryText}><strong>Courier:</strong> {courierName}</Text>
            <Text style={summaryText}><strong>Tracking Number:</strong> {trackingNumber}</Text>
          </div>

          {trackingUrl ? (
             <Button style={button} href={trackingUrl}>
               Track Package
             </Button>
          ) : (
             <Button style={button} href="https://example.com/account/orders">
               View Order Status
             </Button>
          )}
        </Section>
        
        <Section style={footer}>
          <Text style={footerText}>© 2026 Boutique. All rights reserved.</Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

const main = {
  backgroundColor: '#f5f5f4',
  fontFamily: 'system-ui, -apple-system, sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px',
  backgroundColor: '#ffffff',
}

const header = {
  padding: '32px',
  backgroundColor: '#1c1917',
  textAlign: 'center' as const,
}

const h1 = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: '300',
  letterSpacing: '4px',
  margin: '0',
}

const bodySection = {
  padding: '32px',
}

const greeting = {
  fontSize: '18px',
  lineHeight: '28px',
  color: '#1c1917',
}

const text = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#57534e',
}

const summaryBox = {
  margin: '32px 0',
  padding: '24px',
  backgroundColor: '#fafaf9',
  border: '1px solid #e7e5e4',
}

const summaryTitle = {
  fontSize: '14px',
  fontWeight: 'bold',
  textTransform: 'uppercase' as const,
  letterSpacing: '2px',
  margin: '0 0 16px',
}

const summaryText = {
  fontSize: '16px',
  margin: '0 0 8px',
}

const button = {
  backgroundColor: '#1c1917',
  color: '#fff',
  padding: '16px 32px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  fontSize: '14px',
  textTransform: 'uppercase' as const,
  letterSpacing: '2px',
  marginTop: '32px'
}

const footer = {
  padding: '32px',
  textAlign: 'center' as const,
}

const footerText = {
  fontSize: '12px',
  color: '#a8a29e',
}

export default ShippingNotificationEmail
