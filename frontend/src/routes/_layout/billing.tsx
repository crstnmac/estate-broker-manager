import {BillingOverview} from '@/components/billing/billing-overview'
import {InvoiceHistory} from '@/components/billing/invoice-history'
import {PaymentMethods} from '@/components/billing/payment-methods'
import {SubscriptionPlans} from '@/components/billing/subscription-plans'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {createFileRoute} from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/billing')({
  component: Billing,
})

function Billing() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Billing & Subscription
        </h2>
        <p className="text-muted-foreground">
          Manage your subscription and billing information
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <BillingOverview />
        </TabsContent>
        <TabsContent value="plans" className="space-y-4">
          <SubscriptionPlans />
        </TabsContent>
        <TabsContent value="invoices">
          <InvoiceHistory />
        </TabsContent>
        <TabsContent value="payment">
          <PaymentMethods />
        </TabsContent>
      </Tabs>
    </div>
  )
}
