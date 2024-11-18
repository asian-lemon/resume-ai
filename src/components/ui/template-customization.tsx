import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { resumeTemplates, fontPairings } from '@/lib/templates';
import { Palette, Type, Maximize, TextQuote } from 'lucide-react';

export interface TemplateCustomizationOptions {
  colorScheme: string;
  fontPairing: string;
  spacing: 'compact' | 'normal' | 'spacious';
  fontSize: 'small' | 'medium' | 'large';
}

interface TemplateCustomizationProps {
  selectedTemplateId: string;
  templateCustomization: TemplateCustomizationOptions;
  onUpdateTemplate: (updates: Partial<TemplateCustomizationOptions>) => void;
}

export function TemplateCustomization({
  selectedTemplateId,
  templateCustomization,
  onUpdateTemplate,
}: TemplateCustomizationProps) {
  const selectedTemplate = resumeTemplates.find(t => t.id === selectedTemplateId);

  if (!selectedTemplate) return null;

  const customizationOptions = [
    {
      icon: Palette,
      label: 'Color Scheme',
      value: templateCustomization.colorScheme,
      onChange: (value: string) => onUpdateTemplate({ colorScheme: value }),
      options: selectedTemplate.colorSchemes.map(scheme => ({
        value: scheme.id,
        label: scheme.name,
      })),
    },
    {
      icon: Type,
      label: 'Font Pairing',
      value: templateCustomization.fontPairing,
      onChange: (value: string) => onUpdateTemplate({ fontPairing: value }),
      options: fontPairings.map(font => ({
        value: font.id,
        label: font.name,
      })),
    },
    {
      icon: Maximize,
      label: 'Spacing',
      value: templateCustomization.spacing,
      onChange: (value: string) => 
        onUpdateTemplate({ spacing: value as TemplateCustomizationOptions['spacing'] }),
      options: [
        { value: 'compact', label: 'Compact' },
        { value: 'normal', label: 'Normal' },
        { value: 'spacious', label: 'Spacious' },
      ],
    },
    {
      icon: TextQuote,
      label: 'Font Size',
      value: templateCustomization.fontSize,
      onChange: (value: string) => 
        onUpdateTemplate({ fontSize: value as TemplateCustomizationOptions['fontSize'] }),
      options: [
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' },
      ],
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <h3 className="text-lg font-semibold">Customize Template</h3>
        <p className="text-sm text-gray-500">
          Adjust the appearance of your resume
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {customizationOptions.map(({ icon: Icon, label, value, onChange, options }) => (
          <div key={label} className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700 gap-2">
              <Icon className="h-4 w-4 text-gray-500" />
              {label}
            </label>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger id={`customization-${label.toLowerCase()}`} className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {options.map(option => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="cursor-pointer"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
        
        {/* Color Preview */}
        {selectedTemplate.colorSchemes.map(scheme => (
          scheme.id === templateCustomization.colorScheme && (
            <div key={scheme.id} className="grid grid-cols-3 gap-2">
              <div 
                className="h-8 rounded"
                style={{ backgroundColor: scheme.primary }}
              />
              <div 
                className="h-8 rounded"
                style={{ backgroundColor: scheme.secondary }}
              />
              <div 
                className="h-8 rounded"
                style={{ backgroundColor: scheme.accent }}
              />
            </div>
          )
        ))}
      </CardContent>
    </Card>
  );
}