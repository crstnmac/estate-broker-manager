import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/workflows')({
  component: WorkflowBuilder,
})

import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd'
import {
  Settings,
  Plus,
  Save,
  PlayCircle,
  Trash2,
  Mail,
  MessageSquare,
  Bell,
  CalendarRange,
  UserCheck,
  FileCheck,
  ArrowDownUp,
  Clock,
  Webhook,
} from 'lucide-react'

interface WorkflowStep {
  id: string
  type: string
  name: string
  config: any
  conditions?: WorkflowCondition[]
  nextSteps?: string[]
}

interface WorkflowCondition {
  field: string
  operator: string
  value: any
}

 function WorkflowBuilder() {
  const [steps, setSteps] = React.useState<WorkflowStep[]>([])
  const [selectedStep, setSelectedStep] = React.useState<WorkflowStep | null>(
    null
  )

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(steps)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setSteps(items)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Workflow Builder
          </h1>
          <p className="text-muted-foreground">
            Create automated workflows for your tasks and processes
          </p>
        </div>
        <div className="flex space-x-4">
          <Button variant="outline">
            <PlayCircle className="mr-2 h-4 w-4" />
            Test Workflow
          </Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Workflow
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar with workflow components */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Components</CardTitle>
            <CardDescription>
              Drag and drop components to build your workflow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="notifications">
                <AccordionTrigger>Notifications</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <WorkflowComponent
                      icon={<Mail className="h-4 w-4" />}
                      title="Send Email"
                      type="email"
                    />
                    <WorkflowComponent
                      icon={<MessageSquare className="h-4 w-4" />}
                      title="Send SMS"
                      type="sms"
                    />
                    <WorkflowComponent
                      icon={<Bell className="h-4 w-4" />}
                      title="Push Notification"
                      type="push"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tasks">
                <AccordionTrigger>Tasks</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <WorkflowComponent
                      icon={<CalendarRange className="h-4 w-4" />}
                      title="Schedule Task"
                      type="schedule"
                    />
                    <WorkflowComponent
                      icon={<UserCheck className="h-4 w-4" />}
                      title="Assign Task"
                      type="assign"
                    />
                    <WorkflowComponent
                      icon={<FileCheck className="h-4 w-4" />}
                      title="Update Status"
                      type="status"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="logic">
                <AccordionTrigger>Logic</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <WorkflowComponent
                      icon={<ArrowDownUp className="h-4 w-4" />}
                      title="Condition"
                      type="condition"
                    />
                    <WorkflowComponent
                      icon={<Clock className="h-4 w-4" />}
                      title="Delay"
                      type="delay"
                    />
                    <WorkflowComponent
                      icon={<Webhook className="h-4 w-4" />}
                      title="Webhook"
                      type="webhook"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Main workflow canvas */}
        <div className="col-span-6">
          <Card className="h-[800px]">
            <CardHeader>
              <CardTitle>Workflow Steps</CardTitle>
              <CardDescription>
                Configure and connect your workflow steps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="workflow">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4"
                    >
                      {steps.map((step, index) => (
                        <Draggable
                          key={step.id}
                          draggableId={step.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <WorkflowStep
                                step={step}
                                onSelect={() => setSelectedStep(step)}
                                isSelected={selectedStep?.id === step.id}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              {steps.length === 0 && (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">
                      Drag and drop components here to start building your
                      workflow
                    </p>
                    <Button variant="outline" onClick={() => {}}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Step
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Properties panel */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Properties</CardTitle>
            <CardDescription>
              Configure the selected workflow step
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedStep ? (
              <div className="space-y-4">
                <div>
                  <Label>Step Name</Label>
                  <Input value={selectedStep.name} onChange={() => {}} />
                </div>

                {selectedStep.type === 'email' && (
                  <EmailStepConfig step={selectedStep} />
                )}

                {selectedStep.type === 'condition' && (
                  <ConditionStepConfig step={selectedStep} />
                )}

                {selectedStep.type === 'delay' && (
                  <DelayStepConfig step={selectedStep} />
                )}

                <div className="pt-4">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Step
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Step</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this step? This action
                          cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                Select a step to view and edit its properties
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Component for draggable workflow steps
const WorkflowComponent = ({
  icon,
  title,
  type,
}: {
  icon: React.ReactNode
  title: string
  type: string
}) => {
  return (
    <div className="flex items-center p-2 rounded-md border cursor-grab hover:bg-accent">
      <div className="p-2 rounded-md bg-primary/10 mr-3">{icon}</div>
      <span className="text-sm font-medium">{title}</span>
    </div>
  )
}

// Component for workflow steps in the canvas
const WorkflowStep = ({
  step,
  onSelect,
  isSelected,
}: {
  step: WorkflowStep
  onSelect: () => void
  isSelected: boolean
}) => {
  return (
    <div
      className={`
        p-4 rounded-lg border cursor-pointer
        ${isSelected ? 'border-primary ring-2 ring-primary/20' : ''}
        hover:bg-accent
      `}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-md bg-primary/10">
            {getStepIcon(step.type)}
          </div>
          <div>
            <h4 className="font-medium">{step.name}</h4>
            <p className="text-sm text-muted-foreground">
              {getStepDescription(step)}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// Configuration components for different step types
const EmailStepConfig = ({step}: {step: WorkflowStep}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Template</Label>
        <Select defaultValue={step.config?.template}>
          <SelectTrigger>
            <SelectValue placeholder="Select email template" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="welcome">Welcome Email</SelectItem>
            <SelectItem value="follow-up">Follow Up</SelectItem>
            <SelectItem value="reminder">Reminder</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Subject</Label>
        <Input value={step.config?.subject} onChange={() => {}} />
      </div>
    </div>
  )
}

const ConditionStepConfig = ({step}: {step: WorkflowStep}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Condition Type</Label>
        <Select defaultValue={step.config?.type}>
          <SelectTrigger>
            <SelectValue placeholder="Select condition type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="property">Property Status</SelectItem>
            <SelectItem value="lead">Lead Status</SelectItem>
            <SelectItem value="task">Task Status</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Operator</Label>
        <Select defaultValue={step.config?.operator}>
          <SelectTrigger>
            <SelectValue placeholder="Select operator" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="equals">Equals</SelectItem>
            <SelectItem value="not_equals">Not Equals</SelectItem>
            <SelectItem value="contains">Contains</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

const DelayStepConfig = ({step}: {step: WorkflowStep}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Delay Duration</Label>
        <div className="flex space-x-2">
          <Input
            type="number"
            value={step.config?.duration}
            onChange={() => {}}
          />
          <Select defaultValue={step.config?.unit}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="minutes">Minutes</SelectItem>
              <SelectItem value="hours">Hours</SelectItem>
              <SelectItem value="days">Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

// Helper functions
function getStepIcon(type: string) {
  const icons = {
    email: <Mail className="h-4 w-4" />,
    sms: <MessageSquare className="h-4 w-4" />,
    push: <Bell className="h-4 w-4" />,
    schedule: <CalendarRange className="h-4 w-4" />,
    assign: <UserCheck className="h-4 w-4" />,
    status: <FileCheck className="h-4 w-4" />,
    condition: <ArrowDownUp className="h-4 w-4" />,
    delay: <Clock className="h-4 w-4" />,
    webhook: <Webhook className="h-4 w-4" />,
  }
  return icons[type as keyof typeof icons]
}

// Continue getStepDescription function
function getStepDescription(step: WorkflowStep) {
  switch (step.type) {
    case 'email':
      return `Send "${step.config?.template}" email template`;
    case 'sms':
      return `Send SMS message to assigned contact`;
    case 'push':
      return `Send push notification`;
    case 'schedule':
      return `Schedule task for ${step.config?.date}`;
    case 'assign':
      return `Assign to ${step.config?.assignee}`;
    case 'status':
      return `Update status to "${step.config?.status}"`;
    case 'condition':
      return `Check if ${step.config?.field} ${step.config?.operator} ${step.config?.value}`;
    case 'delay':
      return `Wait for ${step.config?.duration} ${step.config?.unit}`;
    case 'webhook':
      return `Trigger webhook: ${step.config?.url}`;
    default:
      return 'Configure this step';
  }
}

// Add visual connection lines between steps
const StepConnector = ({ isConditional }: { isConditional?: boolean }) => {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 h-8 w-px bg-border">
      {isConditional && (
        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary" />
      )}
    </div>
  );
};

// Add a component for branch conditions
const BranchCondition = ({ condition }: { condition: WorkflowCondition }) => {
  return (
    <div className="ml-8 border-l-2 border-dashed border-border pl-6 py-2">
      <div className="text-sm text-muted-foreground">
        If {condition.field} {condition.operator} {condition.value}
      </div>
    </div>
  );
};

// Add a preview mode component
const WorkflowPreview = ({ workflow }: { workflow: WorkflowStep[] }) => {
  return (
    <div className="p-4 rounded-lg border bg-card">
      <h3 className="font-medium mb-4">Workflow Preview</h3>
      <div className="space-y-2">
        {workflow.map((step, index) => (
          <div key={step.id} className="flex items-center space-x-2 text-sm">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
              {index + 1}
            </div>
            <span>{getStepDescription(step)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Add templates selection
const WorkflowTemplates = ({ onSelect }: { onSelect: (template: any) => void }) => {
  const templates = [
    {
      id: 'lead-nurture',
      name: 'Lead Nurture',
      description: 'Automate lead follow-up and nurturing',
      steps: [
        {
          id: '1',
          type: 'email',
          name: 'Welcome Email',
          config: {
            template: 'welcome',
            subject: 'Welcome to our platform',
          },
        },
        {
          id: '2',
          type: 'delay',
          name: 'Wait 2 Days',
          config: {
            duration: 2,
            unit: 'days',
          },
        },
        {
          id: '3',
          type: 'condition',
          name: 'Check Email Opened',
          config: {
            field: 'email_opened',
            operator: 'equals',
            value: true,
          },
        },
      ],
    },
    // Add more templates
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {templates.map((template) => (
        <Card
          key={template.id}
          className="cursor-pointer hover:border-primary"
          onClick={() => onSelect(template)}
        >
          <CardHeader>
            <CardTitle>{template.name}</CardTitle>
            <CardDescription>{template.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {template.steps.length} steps
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Add validation component
const WorkflowValidation = ({ workflow }: { workflow: WorkflowStep[] }) => {
  const validate = () => {
    const errors: string[] = [];

    workflow.forEach((step) => {
      switch (step.type) {
        case 'email':
          if (!step.config?.template) {
            errors.push(`${step.name}: Email template is required`);
          }
          break;
        case 'condition':
          if (!step.config?.field || !step.config?.operator || !step.config?.value) {
            errors.push(`${step.name}: All condition fields are required`);
          }
          break;
        // Add more validations
      }
    });

    return errors;
  };

  const errors = validate();

  if (errors.length === 0) return null;

  return (
    <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
      <h4 className="font-medium mb-2">Validation Errors</h4>
      <ul className="list-disc list-inside space-y-1">
        {errors.map((error, index) => (
          <li key={index} className="text-sm">
            {error}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Add export/import functionality
const WorkflowActions = ({ 
  workflow,
  onImport,
}: { 
  workflow: WorkflowStep[];
  onImport: (workflow: WorkflowStep[]) => void;
}) => {
  const exportWorkflow = () => {
    const data = JSON.stringify(workflow, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workflow.json';
    a.click();
  };

  const importWorkflow = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const workflow = JSON.parse(e.target?.result as string);
          onImport(workflow);
        } catch (error) {
          console.error('Invalid workflow file');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex space-x-4">
      <Button variant="outline" onClick={exportWorkflow}>
        Export Workflow
      </Button>
      <div>
        <input
          type="file"
          accept=".json"
          className="hidden"
          id="import-workflow"
          onChange={importWorkflow}
        />
        <Button variant="outline" onClick={() => document.getElementById('import-workflow')?.click()}>
          Import Workflow
        </Button>
      </div>
    </div>
  );
};

// Add a component for testing the workflow
const WorkflowTester = ({ workflow }: { workflow: WorkflowStep[] }) => {
  const [testData, setTestData] = React.useState<any>({});
  const [currentStep, setCurrentStep] = React.useState<number>(0);
  const [testResults, setTestResults] = React.useState<any[]>([]);

  const runTest = async () => {
    setTestResults([]);
    for (let i = 0; i < workflow.length; i++) {
      setCurrentStep(i);
      const step = workflow[i];
      const result = await simulateStep(step, testData);
      setTestResults((prev) => [...prev, result]);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
    }
    setCurrentStep(-1);
  };

  const simulateStep = async (step: WorkflowStep, data: any) => {
    // Simulate step execution based on type
    switch (step.type) {
      case 'email':
        return {
          success: true,
          message: `Email "${step.config?.template}" would be sent`,
        };
      case 'condition':
        const result = evaluateCondition(step.config, data);
        return {
          success: true,
          message: `Condition evaluated to: ${result}`,
        };
      // Add more step simulations
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Workflow</CardTitle>
        <CardDescription>
          Simulate workflow execution with test data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Test Data (JSON)</Label>
            <textarea
              className="w-full min-h-[100px] p-2 rounded-md border"
              value={JSON.stringify(testData, null, 2)}
              onChange={(e) => {
                try {
                  setTestData(JSON.parse(e.target.value));
                } catch (error) {
                  // Handle invalid JSON
                }
              }}
            />
          </div>
          <Button onClick={runTest}>
            Run Test
          </Button>
          {testResults.length > 0 && (
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-md ${
                    result.success ? 'bg-green-50' : 'bg-red-50'
                  }`}
                >
                  {result.message}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

function evaluateCondition(config: any, data: any) {
  const { field, operator, value } = config;
  const fieldValue = data[field];

  switch (operator) {
    case 'equals':
      return fieldValue === value;
    case 'not_equals':
      return fieldValue !== value;
    case 'contains':
      return fieldValue?.includes(value);
    // Add more operators
    default:
      return false;
  }
}

