// src/pages/properties/page.tsx
import React from 'react'
// import {useProperties} from '@/hooks/properties'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatCurrency } from '@/lib/utils'
import { Building2, ListFilter, MoreHorizontal, Plus } from 'lucide-react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/properties')({
  component: PropertiesPage,
})

function PropertiesPage() {
  const data = {
    properties: [
      {
        id: 1,
        title: '123 Main St',
        address: '123 Main St, Springfield, IL 62701',
        price: 450000,
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 1800,
        type: 'Single Family',
        images: ['/api/placeholder/400/300'],
      },
      {
        id: 2,
        title: '456 Elm St',
        address: '456 Elm St, Springfield, IL 62701',
        price: 350000,
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1500,
        type: 'Condo',
        images: ['/api/placeholder/400/300'],
      },
      {
        id: 3,
        title: '789 Oak Ave',
        address: '789 Oak Ave, Springfield, IL 62701',
        price: 550000,
        bedrooms: 4,
        bathrooms: 3,
        squareFeet: 2200,
        type: 'Single Family',
        images: ['/api/placeholder/400/300'],
      },
    ],
    isLoading: false,
  }

  const [view, setView] = React.useState<'grid' | 'list'>('grid')
  const [filterOpen, setFilterOpen] = React.useState(false)

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted-foreground">
            Manage and monitor your real estate portfolio
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Property
        </Button>
      </div>

      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Tabs defaultValue="all" className="w-[400px]">
              <TabsList>
                <TabsTrigger value="all">All Properties</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="sold">Sold</TabsTrigger>
              </TabsList>
            </Tabs>

            <Button
              variant="outline"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <ListFilter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Select defaultValue={view}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">Grid View</SelectItem>
                <SelectItem value="list">List View</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="newest">
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filterOpen && (
          <Card className="mb-6">
            <CardContent className="grid gap-4 p-6">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Property Type
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single_family">
                        Single Family
                      </SelectItem>
                      <SelectItem value="multi_family">Multi Family</SelectItem>
                      <SelectItem value="condo">Condo</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Price Range
                  </label>
                  <div className="flex items-center space-x-2">
                    <Input placeholder="Min" type="number" />
                    <span>to</span>
                    <Input placeholder="Max" type="number" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Bedrooms
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1+</SelectItem>
                      <SelectItem value="2">2+</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Location
                  </label>
                  <Input placeholder="Enter city or ZIP" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div
          className={view === 'grid' ? 'grid grid-cols-3 gap-6' : 'space-y-4'}
        >
          {data?.properties.map((property) => (
            <Card key={property.id} className={view === 'grid' ? '' : 'flex'}>
              <div
                className={`
                  ${view === 'grid' ? 'h-48' : 'w-48 h-48'} 
                  relative overflow-hidden
                `}
              >
                <img
                  src={property.images?.[0]}
                  alt={property.title}
                  className="object-cover w-full h-full"
                />
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Share</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className={view === 'grid' ? '' : 'flex-1 p-4'}>
                <CardHeader>
                  <CardTitle>{property.title}</CardTitle>
                  <CardDescription>{property.address}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="font-medium">
                      {formatCurrency(property.price)}
                    </div>
                    <div className="text-muted-foreground">
                      {property.bedrooms} beds • {property.bathrooms} baths •
                      {property.squareFeet} sqft
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    <span>{property.type}</span>
                  </div>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
