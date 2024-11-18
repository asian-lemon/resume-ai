// src/components/ui/resume-builder.tsx
"use client";

import * as React from "react";
import { useState, useCallback, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  FileText, 
  Upload, 
  Check, 
  AlertCircle, 
  FileUp,
  Download,
  Sparkles,
  BarChart,
  FileSearch,
  RefreshCcw,
  Clock
} from "lucide-react";

import { TemplateComparison } from "./template-comparison";
import { TemplateCustomization, type TemplateCustomizationOptions } from "./template-customization";
import { resumeTemplates, fontPairings, type ResumeTemplate } from "@/lib/templates";

// Types
interface ProcessedResume {
  optimizedResume: string;
  keywordAnalysis: string;
  success: boolean;
}

interface RateLimitInfo {
  isLimited: boolean;
  resetTime: number | null;
}

export function ResumeBuilder() {
  // File and form state
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("modern");

  // Template Customization state
  const [templateCustomization, setTemplateCustomization] = useState<TemplateCustomizationOptions>({
    colorScheme: resumeTemplates[0].colorSchemes[0].id,
    fontPairing: fontPairings[0].id,
    spacing: 'normal',
    fontSize: 'medium'
  });

  // UI state
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [processing, setProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [rateLimit, setRateLimit] = useState<RateLimitInfo>({
    isLimited: false,
    resetTime: null,
  });

  // Results state
  const [processedResume, setProcessedResume] = useState<ProcessedResume | null>(null);

  // Rate limit handler
  const handleRateLimit = useCallback((resetTime: number) => {
    setRateLimit({
      isLimited: true,
      resetTime,
    });

    const timeoutId = setTimeout(() => {
      setRateLimit({
        isLimited: false,
        resetTime: null,
      });
    }, resetTime * 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  // File upload handler
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file size
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("File size too large. Please upload a file smaller than 5MB");
      return;
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Invalid file type. Please upload a PDF or Word document");
      return;
    }

    setFile(selectedFile);
    setError("");
  }, []);

  // Template Customization handler
  const handleTemplateCustomization = (updates: Partial<TemplateCustomizationOptions>) => {
    setTemplateCustomization(prev => ({
      ...prev,
      ...updates
    }));
  };

  // Resume processing handler
  const processResume = async () => {
    if (!file) {
      setError("Please upload a resume file");
      return;
    }

    if (rateLimit.isLimited) {
      setError(`Please wait ${rateLimit.resetTime} seconds before trying again`);
      return;
    }

    setProcessing(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("template", selectedTemplate);
      formData.append("jobDescription", jobDescription);
      formData.append("templateCustomization", JSON.stringify(templateCustomization));

      const response = await fetch("/api/process-resume", {
        method: "POST",
        body: formData,
      });

      // Handle rate limiting
      if (response.status === 429) {
        const resetTime = parseInt(response.headers.get("Retry-After") || "60");
        handleRateLimit(resetTime);
        throw new Error(`Rate limit exceeded. Please try again in ${resetTime} seconds.`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process resume");
      }

      setProcessedResume({
        optimizedResume: data.optimizedResume,
        keywordAnalysis: data.keywordAnalysis,
        success: data.success
      });

      setActiveTab("results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while processing your resume");
      console.error("Processing error:", err);
    } finally {
      setProcessing(false);
    }
  };

  const RateLimitIndicator = () => {
    if (!rateLimit.isLimited || !rateLimit.resetTime) return null;

    return (
      <div className="flex items-center space-x-2 text-yellow-600 bg-yellow-50 p-2 rounded-md">
        <Clock className="h-4 w-4" />
        <span className="text-sm">
          Rate limit cooldown: {rateLimit.resetTime}s
        </span>
      </div>
    );
  };

  // Memoize the available templates
  const availableTemplates = useMemo(() => resumeTemplates, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            AI Resume <span className="text-blue-600">Optimizer</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Transform your resume with AI-powered optimization and ATS-friendly formatting
          </p>
        </div>

        {/* Main Card */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur">
          <CardHeader className="border-b pb-4">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              Resume Enhancement
            </CardTitle>
            <CardDescription>
              Upload your resume and let AI optimize it for your target role
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid grid-cols-3 gap-4 bg-gray-100 p-1 rounded-lg">
                {[
                  { value: 'upload', icon: FileUp, label: 'Upload' },
                  { value: 'template', icon: FileSearch, label: 'Template' },
                  { value: 'results', icon: BarChart, label: 'Results' },
                ].map(({ value, icon: Icon, label }) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-md transition
                      data-[state=active]:bg-white data-[state=active]:shadow-sm
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="upload" className="space-y-6">
                {/* File Upload Zone */}
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8">
                  <div className="flex flex-col items-center">
                    <Input
                      type="file"
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center space-y-4"
                    >
                      <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center">
                        <Upload className="h-8 w-8 text-blue-500" />
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-medium text-gray-700">
                          {file ? file.name : "Drop your resume here"}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          PDF or Word documents up to 5MB
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Job Description */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Job Description
                  </label>
                  <textarea
                    className="min-h-[150px] w-full rounded-lg border border-gray-200 p-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here for better keyword optimization..."
                  />
                </div>

                {/* Process Button */}
                <Button
                  onClick={processResume}
                  disabled={processing || !file || rateLimit.isLimited}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {processing ? (
                    <div className="flex items-center space-x-2">
                      <RefreshCcw className="h-4 w-4 animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Sparkles className="h-4 w-4" />
                      <span>Optimize Resume</span>
                    </div>
                  )}
                </Button>

                <RateLimitIndicator />
              </TabsContent>

              <TabsContent value="template" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Template Selection */}
                  <TemplateComparison
                  templates={availableTemplates}
                  selectedTemplate={selectedTemplate}
                  onSelectTemplate={setSelectedTemplate}
                />

                  {/* Template Customization */}
                  {selectedTemplate && (
                    <div className="lg:sticky lg:top-4">
                      <TemplateCustomization
                        selectedTemplateId={selectedTemplate}
                        templateCustomization={templateCustomization}
                        onUpdateTemplate={handleTemplateCustomization}
                      />
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="results">
                {processedResume ? (
                  <div className="space-y-6">
                    {/* Optimized Resume */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <FileText className="h-5 w-5 text-blue-500" />
                          Optimized Resume
                        </h3>
                        <Button
                          onClick={() => {
                            const blob = new Blob([processedResume.optimizedResume], {
                              type: "text/plain"
                            });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = "optimized-resume.tex";
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                          }}
                          variant="outline"
                          size="sm"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                      <pre className="bg-white rounded-lg p-4 text-sm overflow-auto max-h-96">
                        {processedResume.optimizedResume}
                      </pre>
                    </div>

                    {/* Keyword Analysis */}
                    {processedResume.keywordAnalysis && (
                      <div className="bg-blue-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                          <BarChart className="h-5 w-5 text-blue-500" />
                          Keyword Analysis
                        </h3>
                        <div className="prose max-w-none">
                          <p className="text-sm leading-relaxed">
                            {processedResume.keywordAnalysis}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileSearch className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No Results Yet
                    </h3>
                    <p className="text-gray-500">
                      Process your resume to see the optimized version
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>

          {error && (
            <CardFooter>
              <Alert variant="destructive" className="w-full">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </CardFooter>
          )}
        </Card>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: FileSearch,
              title: "ATS Optimization",
              description: "Ensure your resume passes through Applicant Tracking Systems",
            },
            {
              icon: Sparkles,
              title: "AI Enhancement",
              description: "Improve content and structure with advanced AI",
            },
            {
              icon: BarChart,
              title: "Keyword Analysis",
              description: "Match your resume with job requirements",
            },
          ].map(({ icon: Icon, title, description }) => (
            <Card key={title} className="border-0 shadow-lg bg-white/90 backdrop-blur">
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-gray-600 text-sm">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}