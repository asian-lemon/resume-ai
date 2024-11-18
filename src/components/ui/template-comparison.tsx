import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import type { ResumeTemplate } from '@/lib/templates';

interface TemplateComparisonProps {
  templates: ResumeTemplate[];
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
}

export function TemplateComparison({
  templates,
  selectedTemplate,
  onSelectTemplate,
}: TemplateComparisonProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Choose Template</h3>
      <div className="grid gap-4">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`relative cursor-pointer transition-all ${
              selectedTemplate === template.id
                ? 'ring-2 ring-blue-500'
                : 'hover:border-blue-200'
            }`}
            onClick={() => onSelectTemplate(template.id)}
          >
            {selectedTemplate === template.id && (
              <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                <Check className="h-4 w-4" />
              </div>
            )}
            <CardHeader className="pb-2">
              <h4 className="font-medium text-sm">{template.name}</h4>
              <p className="text-xs text-gray-500">{template.category}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">{template.description}</p>
                <div className="grid grid-cols-2 gap-2">
                  {template.features.slice(0, 4).map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center text-xs text-gray-500"
                    >
                      <span className="h-1 w-1 bg-blue-400 rounded-full mr-2" />
                      {feature}
                    </div>
                  ))}
                </div>
                {template.features.length > 4 && (
                  <p className="text-xs text-gray-400">
                    +{template.features.length - 4} more features
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}