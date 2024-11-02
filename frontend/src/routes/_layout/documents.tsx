import {createFileRoute} from '@tanstack/react-router'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {Plus, Search, File, Download} from 'lucide-react'

export const Route = createFileRoute('/_layout/documents')({
  component: DocumentManagement,
})

function DocumentManagement() {
  const documents = [
    {
      id: 1,
      name: 'Purchase Agreement.pdf',
      type: 'Contract',
      date: '2023-10-15',
      size: '1.2 MB',
    },
    {
      id: 2,
      name: 'Property Listing.docx',
      type: 'Listing',
      date: '2023-10-10',
      size: '500 KB',
    },
    {
      id: 3,
      name: 'Client Information.xlsx',
      type: 'Client',
      date: '2023-10-05',
      size: '750 KB',
    },
  ]

  return (
    <div className="p-8 min-h-screen rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Document Management</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Upload Document
        </Button>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Search documents..."
            className="w-64"
          />
          <Button size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-x-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="contract">Contracts</SelectItem>
              <SelectItem value="listing">Listings</SelectItem>
              <SelectItem value="client">Client Documents</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Sort</Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell className="flex items-center">
                <File className="mr-2 h-4 w-4" />
                {doc.name}
              </TableCell>
              <TableCell>{doc.type}</TableCell>
              <TableCell>{doc.date}</TableCell>
              <TableCell>{doc.size}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="ghost">Edit</Button>
                <Button variant="ghost">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
