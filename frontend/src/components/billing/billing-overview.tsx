import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";


export function BillingOverview() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>Professional Plan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">$49/month</span>
            <Button variant="outline">Change Plan</Button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Listings Used</span>
              <span>45/50</span>
            </div>
            <Progress value={90} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Team Members</span>
              <span>8/10</span>
            </div>
            <Progress value={80} />
          </div>
          <p className="text-sm text-muted-foreground">
            Next billing date: December 1, 2023
          </p>
        </CardContent>
      </Card>
    </>
  )
}
